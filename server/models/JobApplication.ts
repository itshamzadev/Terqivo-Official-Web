import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cvUrl: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'interviewing', 'hired', 'rejected'], default: 'pending' }
}, { timestamps: true });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
