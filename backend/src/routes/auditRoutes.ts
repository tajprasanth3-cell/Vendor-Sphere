import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('admin', 'procurement_manager'), getAuditLogs);

export default router;

