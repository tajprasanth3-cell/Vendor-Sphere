import { db } from './store.js';
import { 
  User, 
  PurchaseRequestModel, 
  RFQModel, 
  PurchaseOrderModel, 
  DeliveryModel, 
  VendorModel, 
  AuditLogModel 
} from '../models/index.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial MongoDB enterprise data...');
      await User.insertMany(db.users);
      await PurchaseRequestModel.insertMany(db.purchaseRequests);
      await RFQModel.insertMany(db.rfqs);
      await PurchaseOrderModel.insertMany(db.purchaseOrders);
      await DeliveryModel.insertMany(db.deliveries);
      await VendorModel.insertMany(db.vendors);
      await AuditLogModel.insertMany(db.auditLogs);
      console.log('✅ Initial MongoDB enterprise collections initialized.');
    } else {
      console.log(`📦 MongoDB collections verified (${userCount} enterprise accounts present).`);
    }
  } catch (error: any) {
    console.error('⚠️ Database initial seeding note:', error.message);
  }
};
