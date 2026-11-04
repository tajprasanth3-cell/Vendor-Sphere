import mongoose, { Schema, Document } from 'mongoose';
import { DeliveryShipment, DeliveryMilestone } from '../types/index.js';

export interface IDeliveryShipment extends Document, Omit<DeliveryShipment, 'id'> {
  id: string;
}

const DeliveryMilestoneSchema = new Schema<DeliveryMilestone>({
  step: { type: String, required: true },
  timestamp: { type: String, required: true },
  location: { type: String, required: true },
  completed: { type: Boolean, required: true },
}, { _id: false });

const DeliverySchema = new Schema<IDeliveryShipment>({
  id: { type: String, required: true, unique: true },
  poNumber: { type: String, required: true },
  trackingNumber: { type: String, required: true, unique: true },
  carrier: { type: String, required: true },
  vendorName: { type: String, required: true },
  status: { type: String, required: true, enum: ['in_transit', 'out_for_delivery', 'delivered', 'quality_check_passed'] },
  estimatedDelivery: { type: String, required: true },
  milestones: [DeliveryMilestoneSchema],
  itemsCount: { type: Number, default: 1 },
  qcPassed: { type: Boolean, default: false },
}, { timestamps: true });

export const DeliveryModel = mongoose.model<IDeliveryShipment>('Delivery', DeliverySchema);
