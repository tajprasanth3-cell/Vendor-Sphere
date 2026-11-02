import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAllVendors = (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    count: db.vendors.length,
    data: db.vendors,
  });
};

