import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAuditLogs = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;

  // RBAC: Strict enterprise governance - only Admin and Procurement Manager can access full audit logs
  if (user?.role !== 'admin' && user?.role !== 'procurement_manager') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Audit logs are reserved for administrative compliance and procurement oversight.',
    });
    return;
  }

  res.json({
    success: true,
    count: db.auditLogs.length,
    data: db.auditLogs,
  });
};
