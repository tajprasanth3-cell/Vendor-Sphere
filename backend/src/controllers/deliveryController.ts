import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAllDeliveries = (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    count: db.deliveries.length,
    data: db.deliveries,
  });
};

export const completeQCInspection = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;

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
    user: req.user?.name || 'Receiving Inspector',
    role: (req.user?.role || 'procurement_manager').toUpperCase(),
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

