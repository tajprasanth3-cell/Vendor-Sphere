import { Router } from 'express';
import { getAllOrders, getOrderById } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);

export default router;

