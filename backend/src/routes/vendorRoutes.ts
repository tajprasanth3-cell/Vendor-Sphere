import { Router } from 'express';
import { getAllVendors } from '../controllers/vendorController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllVendors);

export default router;

