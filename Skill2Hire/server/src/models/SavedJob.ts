import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedJobDocument extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  salary: string;
  description: string;
  source: string;
  applicationUrl: string;
  skills: string[];
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  matchReason?: string;
  savedAt: Date;
}

const SavedJobSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    workMode: { type: String, default: 'On-site' },
    salary: { type: String, default: 'Not specified' },
    description: { type: String, default: '' },
    source: { type: String, default: 'Skill2Hire Job Aggregator' },
    applicationUrl: { type: String, required: true },
    skills: [{ type: String }],
    matchPercentage: { type: Number, default: 0 },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    matchReason: { type: String, default: '' },
    savedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'saved_jobs'
  }
);

SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJobDocument>('SavedJob', SavedJobSchema);
