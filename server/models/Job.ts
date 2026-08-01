import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  department: { type: String },
  location: { type: String },
  workType: { type: String }, // Remote, On-site, Hybrid
  experienceLevel: { type: String },
  description: { type: String },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  status: { type: String, enum: ['open', 'closed', 'draft'], default: 'draft' },
  deadline: { type: Date }
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
