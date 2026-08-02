import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  phone: { type: String, trim: true, default: '' },
  referenceNumber: { type: String, unique: true, sparse: true, index: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'resolved', 'archived'], default: 'unread' },
  replyHistory: [{ subject: String, messageSummary: String, recipient: String, sentAt: Date, sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }, status: String, errorSummary: String }],
}, { timestamps: true });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
