import mongoose, { Schema, Document } from 'mongoose';
import { IResumeData } from '../types';

export interface ITailoredResumeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  jobDescription: string;
  jobRequirements?: string;
  originalResumeText?: string;
  tailoredData: IResumeData;
  matchScoreBefore: number;
  matchScoreAfter: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  changesSummary: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TailoredResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobRequirements: { type: String, default: '' },
    originalResumeText: { type: String, default: '' },
    tailoredData: { type: Schema.Types.Mixed, required: true },
    matchScoreBefore: { type: Number, default: 0 },
    matchScoreAfter: { type: Number, default: 0 },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    skillGaps: [{ type: String }],
    changesSummary: [{ type: String }]
  },
  {
    timestamps: true,
    collection: 'tailored_resumes'
  }
);

export const TailoredResume = mongoose.model<ITailoredResumeDocument>('TailoredResume', TailoredResumeSchema);
