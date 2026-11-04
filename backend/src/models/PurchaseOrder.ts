import mongoose, { Schema, Document } from 'mongoose';
import { PurchaseOrder } from '../types/index.js';

export interface IPurchaseOrder extends Document, Omit<PurchaseOrder, 'id'> {
  id: string;
}

const POLineItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  estimatedUnitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  specifications: { type: String },
}, { _id: false });

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  id: { type: String, required: true, unique: true },
  poNumber: { type: String, required: true, unique: true },
  rfqCode: { type: String },
  prCode: { type: String, required: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true },
  items: [POLineItemSchema],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentTerms: { type: String, required: true },
  paymentStatus: { type: String, required: true, enum: ['unpaid', 'partial', 'paid'] },
  deliveryStatus: { type: String, required: true, enum: ['processing', 'shipped', 'in_transit', 'delivered', 'inspected'] },
  matchingStatus: { type: String, required: true, enum: ['3_way_matched', 'pending_invoice', 'discrepancy'] },
  issueDate: { type: String, required: true },
  expectedDeliveryDate: { type: String, required: true },
  shippingAddress: { type: String, required: true },
}, { timestamps: true });

export const PurchaseOrderModel = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
