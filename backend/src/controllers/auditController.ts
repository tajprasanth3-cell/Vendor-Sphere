import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAuditLogs = (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    count: db.auditLogs.length,
    data: db.auditLogs,
  });
};

