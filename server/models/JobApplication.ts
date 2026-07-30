import { Schema, model } from 'mongoose';

const jobApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cvUrl: { type: String, required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'interviewed', 'rejected', 'hired'], default: 'pending' }
}, { timestamps: true });

export const JobApplication = model('JobApplication', jobApplicationSchema);
