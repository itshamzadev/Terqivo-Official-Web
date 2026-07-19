import { Schema, model } from 'mongoose';

const jobSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  department: { type: String },
  location: { type: String },
  workType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  experienceLevel: { type: String },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  applicationDeadline: { type: Date }
}, { timestamps: true });

export const Job = model('Job', jobSchema);
