import { Router } from 'express';
import authRoutes from './authRoutes.js';
import requestRoutes from './requestRoutes.js';
import rfqRoutes from './rfqRoutes.js';
import orderRoutes from './orderRoutes.js';
import deliveryRoutes from './deliveryRoutes.js';
import vendorRoutes from './vendorRoutes.js';
import auditRoutes from './auditRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/requests', requestRoutes);
apiRouter.use('/rfqs', rfqRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/deliveries', deliveryRoutes);
apiRouter.use('/vendors', vendorRoutes);
apiRouter.use('/audits', auditRoutes);

export default apiRouter;

