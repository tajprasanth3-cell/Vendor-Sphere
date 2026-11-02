import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAllOrders = (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    count: db.purchaseOrders.length,
    data: db.purchaseOrders,
  });
};

export const getOrderById = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const po = db.purchaseOrders.find((p) => p.id === id || p.poNumber === id);

  if (!po) {
    res.status(404).json({ success: false, message: 'Purchase Order not found.' });
    return;
  }

  res.json({ success: true, data: po });
};

