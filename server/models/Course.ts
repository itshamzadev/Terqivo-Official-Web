import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  thumbnail: { type: String },
  category: { type: String },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
  learningMode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] },
  duration: { type: String },
  description: { type: String, required: true },
  summary: { type: String, required: true },
  features: [{ type: String }],
  price: { type: Number },
  salePrice: { type: Number },
  enrollmentStatus: { type: String, enum: ['open', 'closed'], default: 'open' },
  whatsappContact: { type: String },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export const Course = model('Course', courseSchema);
