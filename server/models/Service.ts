import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  shortDescription: { type: String, trim: true, default: '' },
  fullDescription: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  imageUrl: { type: String, trim: true, default: '' },
  icon: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: '' },
  features: [{ type: String }],
  process: [{
    title: { type: String },
    description: { type: String }
  }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  published: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);
