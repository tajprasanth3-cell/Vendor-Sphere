import mongoose, { Schema, Document } from 'mongoose';
import { RFQ, VendorBid } from '../types/index.js';

export interface IRFQ extends Document, Omit<RFQ, 'id'> {
  id: string;
}

const VendorBidSchema = new Schema<VendorBid>({
  id: { type: String, required: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  vendorRating: { type: Number, required: true },
  submittedAt: { type: String, required: true },
  quotedAmount: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  warrantyPeriodMonths: { type: Number, required: true },
  paymentTerms: { type: String, required: true },
  complianceScore: { type: Number, required: true },
  notes: { type: String, default: '' },
  isRecommended: { type: Boolean, default: false },
  status: { type: String, required: true, enum: ['submitted', 'under_review', 'awarded', 'disqualified'] },
}, { _id: false });

const RFQSchema = new Schema<IRFQ>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  prId: { type: String, required: true },
  prCode: { type: String, required: true },
  title: { type: String, required: true },
  targetBudget: { type: Number, required: true },
  deadline: { type: String, required: true },
  invitedVendorsCount: { type: Number, default: 0 },
  status: { type: String, required: true, enum: ['open', 'evaluating', 'awarded', 'closed'] },
  bids: [VendorBidSchema],
  awardedBidId: { type: String },
}, { timestamps: true });

export const RFQModel = mongoose.model<IRFQ>('RFQ', RFQSchema);

