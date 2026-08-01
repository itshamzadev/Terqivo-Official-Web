import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  education: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'enrolled', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
