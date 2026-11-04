import mongoose, { Schema, Document } from 'mongoose';
import { PurchaseRequest } from '../types/index.js';

export interface IPurchaseRequest extends Document, Omit<PurchaseRequest, 'id'> {
  id: string;
}

const LineItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  estimatedUnitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  specifications: { type: String },
}, { _id: false });

const ApprovalStepSchema = new Schema({
  stepName: { type: String, required: true },
  approverRole: { type: String, required: true },
  approverName: { type: String },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected', 'skipped'] },
  updatedAt: { type: String },
  comments: { type: String },
}, { _id: false });

const PurchaseRequestSchema = new Schema<IPurchaseRequest>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  requestedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'urgent'] },
  status: { type: String, required: true },
  items: [LineItemSchema],
  subtotal: { type: Number, required: true },
  estimatedTax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  businessJustification: { type: String, required: true },
  createdAt: { type: String, required: true },
  requiredDate: { type: String, required: true },
  approvalChain: [ApprovalStepSchema],
}, { timestamps: true });

export const PurchaseRequestModel = mongoose.model<IPurchaseRequest>('PurchaseRequest', PurchaseRequestSchema);

