import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest, RFQ, VendorBid, PurchaseOrder, DeliveryShipment } from '../types/index.js';

export const getAllRFQs = (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    count: db.rfqs.length,
    data: db.rfqs,
  });
};

export const createRFQ = (req: AuthenticatedRequest, res: Response): void => {
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
    user: req.user?.name || 'Procurement Specialist',
    role: (req.user?.role || 'procurement_manager').toUpperCase(),
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

  const rfq = db.rfqs.find((r) => r.id === rfqId);
  if (!rfq) {
    res.status(404).json({ success: false, message: 'RFQ not found.' });
    return;
  }

  const newBid: VendorBid = {
    id: `bid-${Date.now()}`,
    vendorId: req.user?.id || 'ven-unknown',
    vendorName: req.user?.department || req.user?.name || 'Supplier Partner',
    vendorRating: 4.8,
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    quotedAmount: Number(quotedAmount),
    deliveryDays: Number(deliveryDays) || 7,
    warrantyPeriodMonths: Number(warrantyPeriodMonths) || 12,
    paymentTerms: paymentTerms || 'Net 30 Days',
    complianceScore: 95,
    notes: notes || 'Commercial offer submitted via vendor portal.',
    status: 'submitted',
  };

  rfq.bids.push(newBid);

  db.addAudit({
    action: 'BID_SUBMITTED',
    entityType: 'RFQ',
    entityCode: rfq.code,
    user: req.user?.name || 'Vendor',
    role: 'VENDOR',
    details: `Bid offer submitted: $${newBid.quotedAmount.toLocaleString()}`,
  });

  res.status(201).json({
    success: true,
    message: 'Bid successfully received and logged.',
    data: newBid,
  });
};

export const awardBid = (req: AuthenticatedRequest, res: Response): void => {
  const { rfqId, bidId } = req.params;

  const rfq = db.rfqs.find((r) => r.id === rfqId);
  if (!rfq) {
    res.status(404).json({ success: false, message: 'RFQ not found.' });
    return;
  }

  const winningBid = rfq.bids.find((b) => b.id === bidId);
  if (!winningBid) {
    res.status(404).json({ success: false, message: 'Target quotation bid not found.' });
    return;
  }

  // Award RFQ
  rfq.status = 'awarded';
  rfq.awardedBidId = bidId;
  rfq.bids.forEach((b) => {
    b.status = b.id === bidId ? 'awarded' : 'disqualified';
  });

  // Automatically generate Purchase Order
  const poNumber = `PO-2026-${Math.floor(8000 + Math.random() * 1999)}`;
  const newPO: PurchaseOrder = {
    id: `po-${Date.now()}`,
    poNumber,
    rfqCode: rfq.code,
    prCode: rfq.prCode,
    vendorId: winningBid.vendorId,
    vendorName: winningBid.vendorName,
    vendorEmail: 'orders@vendorpartner.com',
    items: [
      {
        id: `item-${Date.now()}`,
        name: rfq.title,
        category: 'Contract Sourcing',
        quantity: 1,
        unit: 'lot',
        estimatedUnitPrice: winningBid.quotedAmount,
        totalPrice: winningBid.quotedAmount,
      },
    ],
    totalAmount: winningBid.quotedAmount,
    currency: 'USD',
    paymentTerms: winningBid.paymentTerms,
    paymentStatus: 'unpaid',
    deliveryStatus: 'processing',
    matchingStatus: 'pending_invoice',
    issueDate: new Date().toISOString().substring(0, 10),
    expectedDeliveryDate: new Date(Date.now() + winningBid.deliveryDays * 86400000)
      .toISOString()
      .substring(0, 10),
    shippingAddress: '450 Innovation Parkway, Bldg 4, San Francisco, CA 94105',
  };

  db.purchaseOrders.unshift(newPO);

  // Generate delivery shipment
  const newDelivery: DeliveryShipment = {
    id: `del-${Date.now()}`,
    poNumber,
    trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 89999999)}`,
    carrier: 'DHL Express Global',
    vendorName: winningBid.vendorName,
    status: 'in_transit',
    estimatedDelivery: newPO.expectedDeliveryDate,
    itemsCount: 1,
    qcPassed: false,
    milestones: [
      {
        step: 'PO Issued & Contract Signed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: 'Enterprise Sourcing HQ',
        completed: true,
      },
      {
        step: 'Vendor Assembly & Packaging',
        timestamp: 'In Progress',
        location: `${winningBid.vendorName} Logistics Hub`,
        completed: false,
      },
    ],
  };

  db.deliveries.unshift(newDelivery);

  db.addAudit({
    action: 'BID_AWARDED_PO_GENERATED',
    entityType: 'PO',
    entityCode: poNumber,
    user: req.user?.name || 'Sourcing Manager',
    role: (req.user?.role || 'procurement_manager').toUpperCase(),
    details: `Tender awarded to ${winningBid.vendorName} for $${winningBid.quotedAmount.toLocaleString()}. PO generated.`,
  });

  res.json({
    success: true,
    message: 'Contract awarded, Purchase Order generated, and Logistics tracking initialized.',
    data: {
      rfq,
      purchaseOrder: newPO,
      delivery: newDelivery,
    },
  });
};

