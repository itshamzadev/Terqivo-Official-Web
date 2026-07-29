import { Schema, model } from 'mongoose';

const adminUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Admin', 'Editor'], default: 'Admin' },
}, { timestamps: true });

export const AdminUser = model('AdminUser', adminUserSchema);
