import { Schema, model } from 'mongoose';

const activityLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  action: { type: String, required: true },
  details: { type: String },
  entityType: { type: String },
  entityId: { type: Schema.Types.ObjectId }
}, { timestamps: true });

export const ActivityLog = model('ActivityLog', activityLogSchema);
