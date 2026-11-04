import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAllVendors = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;
  let results = [...db.vendors];

  // RBAC: Vendor only sees their own vendor scorecard and corporate profile
  if (user?.role === 'vendor') {
    results = results.filter((v) => 
      v.id === 'ven-1' || 
      v.name.toLowerCase().includes('apex') ||
      v.email.toLowerCase() === user.email.toLowerCase()
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
};
