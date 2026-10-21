import mongoose, { Schema, Document } from 'mongoose';

export interface IJobPreferenceDocument extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  preferredLocation: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobPreferenceSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    targetRole: { type: String, default: 'Software Developer' },
    preferredLocation: { type: String, default: '' },
    workMode: { 
      type: String, 
      enum: ['Remote', 'Hybrid', 'On-site', 'Any'], 
      default: 'Any' 
    },
    experienceLevel: { type: String, default: 'Fresher' },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skills: [{ type: String }]
  },
  {
    timestamps: true,
    collection: 'job_preferences'
  }
);

export const JobPreference = mongoose.model<IJobPreferenceDocument>('JobPreference', JobPreferenceSchema);
