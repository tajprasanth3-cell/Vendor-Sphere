import { Router } from 'express';
import { 
  getAllRFQs, 
  createRFQ, 
  submitBid, 
  awardBid 
} from '../controllers/rfqController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllRFQs);
router.post('/', requireRole('procurement_manager', 'admin'), createRFQ);
router.post('/:rfqId/bids', requireRole('vendor', 'admin'), submitBid);
router.post('/:rfqId/award/:bidId', requireRole('procurement_manager', 'admin'), awardBid);

export default router;

