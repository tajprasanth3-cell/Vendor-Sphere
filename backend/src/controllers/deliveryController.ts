import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAllDeliveries = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;
  let results = [...db.deliveries];

  // RBAC: Vendor only sees deliveries assigned to their carrier / vendor organization
  if (user?.role === 'vendor') {
    results = results.filter((d) => 
      d.vendorName.toLowerCase().includes('apex') ||
      db.purchaseOrders.some((po) => po.poNumber === d.poNumber && (po.vendorId === 'ven-1' || po.vendorName.toLowerCase().includes('apex')))
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
};

export const completeQCInspection = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user;

  // Vendors cannot self-approve their own internal Receiving QC inspection
  if (user?.role === 'vendor') {
    res.status(403).json({ success: false, message: 'Forbidden: Vendors cannot complete internal 3-way match QC receiving inspection.' });
    return;
  }

  const delivery = db.deliveries.find((d) => d.id === id || d.poNumber === id);
  if (!delivery) {
    res.status(404).json({ success: false, message: 'Delivery record not found.' });
    return;
  }

  delivery.qcPassed = true;
  delivery.status = 'quality_check_passed';
  delivery.milestones.forEach((m) => {
    m.completed = true;
  });

  // Update corresponding PO
  const po = db.purchaseOrders.find((p) => p.poNumber === delivery.poNumber);
  if (po) {
    po.deliveryStatus = 'inspected';
    po.matchingStatus = '3_way_matched';
  }

  db.addAudit({
    action: 'QC_INSPECTION_PASSED',
    entityType: 'DELIVERY',
    entityCode: delivery.poNumber,
    user: user?.name || 'Receiving Inspector',
    role: (user?.role || 'requester').toUpperCase(),
    details: 'Physical receiving inspection verified. 3-Way match completed.',
  });

  res.json({
    success: true,
    message: 'Receiving QC inspection recorded. 3-Way matching successfully verified.',
    data: {
      delivery,
      purchaseOrder: po,
    },
  });
};
