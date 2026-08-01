import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  features: [{ type: String }],
  process: [{
    title: { type: String },
    description: { type: String }
  }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' }
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);
