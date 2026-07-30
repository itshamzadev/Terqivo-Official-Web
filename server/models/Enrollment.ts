import { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  education: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'approved', 'rejected', 'completed'], default: 'pending' }
}, { timestamps: true });

export const Enrollment = model('Enrollment', enrollmentSchema);
