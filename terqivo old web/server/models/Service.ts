import { Schema, model } from 'mongoose';

const serviceSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  features: [{ type: String }],
  process: [{ 
    title: { type: String },
    description: { type: String }
  }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export const Service = model('Service', serviceSchema);
