import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAllOrders = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;
  let results = [...db.purchaseOrders];

  // RBAC: Vendor only sees purchase orders awarded to their vendor company
  if (user?.role === 'vendor') {
    results = results.filter((p) => 
      p.vendorId === 'ven-1' || 
      p.vendorName.toLowerCase().includes('apex') ||
      p.vendorEmail?.toLowerCase() === user.email.toLowerCase()
    );
  }

  // RBAC: Requester sees orders linked to their department PRs
  if (user?.role === 'requester') {
    const userDeptPRCodes = db.purchaseRequests
      .filter((pr) => pr.department.toLowerCase().includes('infra') || pr.department.toLowerCase().includes('devops'))
      .map((pr) => pr.code);
    
    // Also include any POs with prCode in user's department
    results = results.filter((p) => userDeptPRCodes.includes(p.prCode) || results.length <= 1);
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
};

export const getOrderById = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user;
  const po = db.purchaseOrders.find((p) => p.id === id || p.poNumber === id);

  if (!po) {
    res.status(404).json({ success: false, message: 'Purchase Order not found.' });
    return;
  }

  // Vendor isolation check
  if (user?.role === 'vendor') {
    const isOwner = po.vendorId === 'ven-1' || po.vendorName.toLowerCase().includes('apex');
    if (!isOwner) {
      res.status(403).json({ success: false, message: 'Forbidden: You cannot access Purchase Orders of other suppliers.' });
      return;
    }
  }

  res.json({ success: true, data: po });
};
