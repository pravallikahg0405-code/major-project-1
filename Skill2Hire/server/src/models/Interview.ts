import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewDocument extends Document {
  userId: mongoose.Types.ObjectId;
  interviewType: 'General' | 'Role-Based' | 'Job-Specific';
  targetRole: string;
  difficulty: 'Fresher' | 'Intermediate' | 'Advanced';
  status: 'In-Progress' | 'Completed' | 'Failed';
  currentRound: 'Eligibility' | 'Aptitude' | 'Technical' | 'HR' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    interviewType: { 
      type: String, 
      enum: ['General', 'Role-Based', 'Job-Specific'], 
      default: 'Role-Based' 
    },
    targetRole: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ['Fresher', 'Intermediate', 'Advanced'], 
      default: 'Fresher' 
    },
    status: { 
      type: String, 
      enum: ['In-Progress', 'Completed', 'Failed'], 
      default: 'In-Progress' 
    },
    currentRound: { 
      type: String, 
      enum: ['Eligibility', 'Aptitude', 'Technical', 'HR', 'Completed'], 
      default: 'Eligibility' 
    }
  },
  {
    timestamps: true,
    collection: 'interviews'
  }
);

export const Interview = mongoose.model<IInterviewDocument>('Interview', InterviewSchema);
