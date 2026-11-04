import mongoose, { Schema, Document } from 'mongoose';
import { Vendor } from '../types/index.js';

export interface IVendor extends Document, Omit<Vendor, 'id'> {
  id: string;
}

const VendorSchema = new Schema<IVendor>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  onTimeDeliveryRate: { type: Number, default: 100 },
  qualityComplianceRate: { type: Number, default: 100 },
  status: { type: String, required: true, enum: ['preferred', 'active', 'under_review', 'blocked'] },
  totalSpendYTD: { type: Number, default: 0 },
  activeOrdersCount: { type: Number, default: 0 },
  address: { type: String, required: true },
}, { timestamps: true });

export const VendorModel = mongoose.model<IVendor>('Vendor', VendorSchema);

