import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Admin', 'Editor'], default: 'Admin' },
  name: { type: String, required: true },
}, { timestamps: true });

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
