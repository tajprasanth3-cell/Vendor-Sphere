import mongoose, { Schema, Document } from 'mongoose';
import { AuditLog } from '../types/index.js';

export interface IAuditLog extends Document, Omit<AuditLog, 'id'> {
  id: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
  id: { type: String, required: true, unique: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true, enum: ['PR', 'RFQ', 'PO', 'DELIVERY', 'VENDOR', 'AUTH'] },
  entityCode: { type: String, required: true },
  user: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: String, required: true },
  details: { type: String, required: true },
}, { timestamps: true });

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
