import mongoose from 'mongoose';

const userAuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  action: { type: String, required: true, trim: true },
  details: { type: String, trim: true, default: '' },
}, { timestamps: true });

export const UserAuditLog = mongoose.model('UserAuditLog', userAuditLogSchema);
