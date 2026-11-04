import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest, RFQ, VendorBid, PurchaseOrder, DeliveryShipment } from '../types/index.js';

export const getAllRFQs = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;

  // RBAC: If vendor, mask competitors' confidential pricing and scoring
  if (user?.role === 'vendor') {
    const sanitized = db.rfqs.map((rfq) => ({
      ...rfq,
      bids: rfq.bids.map((b) => {
        const isMyBid = b.vendorId === 'ven-1' || b.vendorName.toLowerCase().includes('apex');
        if (isMyBid) return b;
        return {
          ...b,
          vendorName: 'Confidential Competitor Bid',
          vendorEmail: undefined,
          quotedAmount: 0,
          notes: 'Sealed commercial proposal submitted for review.',
          scoreBreakdown: undefined,
          complianceScore: undefined,
          isRecommended: false,
        };
      }),
    }));

    res.json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
    return;
  }

  res.json({
    success: true,
    count: db.rfqs.length,
    data: db.rfqs,
  });
};

export const createRFQ = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;
  if (user?.role !== 'procurement_manager' && user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden: Only procurement managers can initiate RFQ tenders.' });
    return;
  }

  const { prId, deadline } = req.body;
  const pr = db.purchaseRequests.find((p) => p.id === prId);
  if (!pr) {
    res.status(404).json({ success: false, message: 'Source purchase request not found.' });
    return;
  }

  const rfqCode = `RFQ-2026-0${Math.floor(10 + Math.random() * 89)}`;
  const newRfq: RFQ = {
    id: `rfq-${Date.now()}`,
    code: rfqCode,
    prId: pr.id,
    prCode: pr.code,
    title: `Competitive Tender: ${pr.title}`,
    targetBudget: pr.totalAmount,
    deadline: deadline || '2026-11-30',
    invitedVendorsCount: 3,
    status: 'open',
    bids: [],
  };

  db.rfqs.unshift(newRfq);
  pr.status = 'rfq_initiated';

  db.addAudit({
    action: 'RFQ_INITIATED',
    entityType: 'RFQ',
    entityCode: rfqCode,
    user: user?.name || 'Elena Rostova',
    role: (user?.role || 'procurement_manager').toUpperCase(),
    details: `Tender published for ${pr.code} with cap budget $${pr.totalAmount.toLocaleString()}`,
  });

  res.status(201).json({
    success: true,
    message: 'RFQ tender successfully initiated.',
    data: newRfq,
  });
};

export const submitBid = (req: AuthenticatedRequest, res: Response): void => {
  const { rfqId } = req.params;
  const { quotedAmount, deliveryDays, warrantyPeriodMonths, paymentTerms, notes } = req.body;
  const user = req.user;

  const rfq = db.rfqs.find((r) => r.id === rfqId);
  if (!rfq) {
    res.status(404).json({ success: false, message: 'RFQ tender not found.' });
    return;
  }

  if (rfq.status !== 'open') {
    res.status(400).json({ success: false, message: 'Bidding is closed for this tender.' });
    return;
  }

  const vendorName = user?.name && user?.role === 'vendor' ? user.department || user.name : 'Apex Cloud Solutions Inc.';
  const vendorId = 'ven-1';

  // Check if this vendor already submitted a bid
  const existingBidIndex = rfq.bids.findIndex((b) => b.vendorId === vendorId);

  const priceRatio = Number(quotedAmount) / rfq.targetBudget;
  const pricingScore = Math.max(70, Math.min(100, Math.round(100 - (priceRatio - 0.9) * 100)));
  const speedScore = Math.max(70, Math.min(100, Math.round(100 - Number(deliveryDays) * 2)));
  const complianceScore = Math.round((pricingScore * 0.4) + (speedScore * 0.3) + (99 * 0.3));

  const newBid: VendorBid = {
    id: `bid-${Date.now()}`,
    vendorId,
    vendorName,
    vendorRating: 4.9,
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    quotedAmount: Number(quotedAmount),
    deliveryDays: Number(deliveryDays) || 7,
    warrantyPeriodMonths: Number(warrantyPeriodMonths) || 12,
    paymentTerms: paymentTerms || 'Net 30 Days',
    complianceScore,
    notes: notes || 'Commercial offer submitted via Vendor Portal.',
    isRecommended: complianceScore > 90,
    status: 'submitted',
  };

  if (existingBidIndex >= 0) {
    rfq.bids[existingBidIndex] = newBid;
  } else {
    rfq.bids.push(newBid);
  }

  db.addAudit({
    action: 'VENDOR_BID_SUBMITTED',
    entityType: 'RFQ',
    entityCode: rfq.code,
    user: user?.name || vendorName,
    role: (user?.role || 'vendor').toUpperCase(),
    details: `Bid submitted by ${vendorName} for $${Number(quotedAmount).toLocaleString()}`,
  });

  res.status(201).json({
    success: true,
    message: 'Quotation bid submitted successfully.',
    data: newBid,
  });
};

export const awardBid = (req: AuthenticatedRequest, res: Response): void => {
  const { rfqId, bidId } = req.params;
  const user = req.user;

  if (user?.role !== 'procurement_manager' && user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden: Only procurement managers can award contracts.' });
    return;
  }

  const rfq = db.rfqs.find((r) => r.id === rfqId);
  if (!rfq) {
    res.status(404).json({ success: false, message: 'RFQ tender not found.' });
    return;
  }

  const bid = rfq.bids.find((b) => b.id === bidId);
  if (!bid) {
    res.status(404).json({ success: false, message: 'Quotation bid not found.' });
    return;
  }

  rfq.status = 'awarded';
  rfq.awardedBidId = bid.id;
  rfq.bids.forEach((b) => {
    b.status = b.id === bid.id ? 'awarded' : 'disqualified';
  });

  // Automatically generate Purchase Order
  const poNumber = `PO-2026-${Math.floor(8000 + Math.random() * 1999)}`;
  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + (bid.deliveryDays || 14));

  const newPO: PurchaseOrder = {
    id: `po-${Date.now()}`,
    poNumber,
    rfqCode: rfq.code,
    prCode: rfq.prCode,
    vendorId: bid.vendorId,
    vendorName: bid.vendorName,
    vendorEmail: 'orders@vendorpartner.com',
    items: [
      {
        id: `item-${Date.now()}`,
        name: rfq.title.replace('Competitive Tender: ', ''),
        category: 'Contract Award',
        quantity: 1,
        unit: 'lot',
        estimatedUnitPrice: bid.quotedAmount,
        totalPrice: bid.quotedAmount,
      },
    ],
    totalAmount: bid.quotedAmount,
    currency: 'USD',
    paymentTerms: bid.paymentTerms,
    paymentStatus: 'unpaid',
    deliveryStatus: 'processing',
    matchingStatus: 'pending_invoice',
    issueDate: new Date().toISOString().substring(0, 10),
    expectedDeliveryDate: expectedDate.toISOString().substring(0, 10),
    shippingAddress: '450 Innovation Parkway, Receiving Bay 4, San Francisco, CA',
  };

  db.purchaseOrders.unshift(newPO);

  // Auto-generate Delivery Shipment Tracking
  const newDelivery: DeliveryShipment = {
    id: `del-${Date.now()}`,
    poNumber: newPO.poNumber,
    trackingNumber: `FX-TRK-${Math.floor(100000 + Math.random() * 899999)}`,
    carrier: 'FedEx Express Freight',
    vendorName: bid.vendorName,
    status: 'in_transit',
    estimatedDelivery: newPO.expectedDeliveryDate,
    itemsCount: 1,
    qcPassed: false,
    milestones: [
      {
        step: 'PO Dispatched to Vendor',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: 'Enterprise Sourcing Dispatch Bay',
        completed: true,
      },
      {
        step: 'Fulfillment & Carrier Processing',
        timestamp: 'In Progress',
        location: `${bid.vendorName} Fulfillment Center`,
        completed: false,
      },
    ],
  };

  db.deliveries.unshift(newDelivery);

  db.addAudit({
    action: 'BID_AWARDED_PO_GENERATED',
    entityType: 'RFQ',
    entityCode: rfq.code,
    user: user?.name || 'Elena Rostova',
    role: (user?.role || 'procurement_manager').toUpperCase(),
    details: `Tender awarded to ${bid.vendorName} for $${bid.quotedAmount.toLocaleString()}. Dispatched ${poNumber}.`,
  });

  res.json({
    success: true,
    message: `Tender awarded. Purchase Order ${poNumber} generated and dispatched.`,
    data: {
      rfq,
      purchaseOrder: newPO,
      delivery: newDelivery,
    },
  });
};
