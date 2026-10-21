import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewReportDocument extends Document {
  userId: mongoose.Types.ObjectId;
  interviewId?: mongoose.Types.ObjectId;
  targetRole: string;
  eligibilityResult: {
    passed: boolean;
    missingSkills: string[];
    weakAreas: string[];
  };
  aptitudeScore: {
    overall: number;
    quantitative: number;
    logical: number;
    verbal: number;
    dataInterpretation: number;
    passed: boolean;
  };
  technicalScore: number;
  hrScore: number;
  overallScore: number;
  communicationAssessment: {
    clarityScore: number;
    relevanceScore: number;
    structureScore: number;
    feedback: string;
  };
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  improvementSuggestions: string[];
  recommendedLearningResources: {
    topic: string;
    resourceName: string;
    url: string;
    type: string;
  }[];
  overallResult: 'Passed' | 'Needs Improvement';
  createdAt: Date;
}

const InterviewReportSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', default: null },
    targetRole: { type: String, required: true },
    eligibilityResult: {
      passed: { type: Boolean, default: true },
      missingSkills: [{ type: String }],
      weakAreas: [{ type: String }]
    },
    aptitudeScore: {
      overall: { type: Number, default: 0 },
      quantitative: { type: Number, default: 0 },
      logical: { type: Number, default: 0 },
      verbal: { type: Number, default: 0 },
      dataInterpretation: { type: Number, default: 0 },
      passed: { type: Boolean, default: true }
    },
    technicalScore: { type: Number, default: 0 },
    hrScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    communicationAssessment: {
      clarityScore: { type: Number, default: 0 },
      relevanceScore: { type: Number, default: 0 },
      structureScore: { type: Number, default: 0 },
      feedback: { type: String, default: '' }
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    skillGaps: [{ type: String }],
    improvementSuggestions: [{ type: String }],
    recommendedLearningResources: [
      {
        topic: { type: String },
        resourceName: { type: String },
        url: { type: String },
        type: { type: String }
      }
    ],
    overallResult: { 
      type: String, 
      enum: ['Passed', 'Needs Improvement'], 
      default: 'Passed' 
    }
  },
  {
    timestamps: true,
    collection: 'interview_reports'
  }
);

export const InterviewReport = mongoose.model<IInterviewReportDocument>('InterviewReport', InterviewReportSchema);
