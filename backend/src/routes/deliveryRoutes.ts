import { Router } from 'express';
import { getAllDeliveries, completeQCInspection } from '../controllers/deliveryController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllDeliveries);
router.post('/:id/qc', requireRole('procurement_manager', 'admin', 'requester'), completeQCInspection);

export default router;

