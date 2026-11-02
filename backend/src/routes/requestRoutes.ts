import { Router } from 'express';
import { 
  getAllRequests, 
  getRequestById, 
  createRequest, 
  approveRequestStep, 
  rejectRequest 
} from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllRequests);
router.get('/:id', getRequestById);
router.post('/', createRequest);
router.patch('/:id/approve', requireRole('procurement_manager', 'admin'), approveRequestStep);
router.patch('/:id/reject', requireRole('procurement_manager', 'admin'), rejectRequest);

export default router;

