import mongoose, { Schema, Document } from 'mongoose';
import { IResumeData } from '../types';

export interface IResumeDocument extends Document, IResumeData {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'My Resume', trim: true },
    templateId: { 
      type: String, 
      enum: ['ats-classic', 'ats-modern', 'ats-technical'], 
      default: 'ats-classic' 
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    careerTarget: {
      targetRole: { type: String, default: 'Full Stack Developer' },
      specialization: { type: String, default: '' }
    },
    education: [
      {
        degree: { type: String, default: '' },
        institution: { type: String, default: '' },
        university: { type: String, default: '' },
        startYear: { type: String, default: '' },
        endYear: { type: String, default: '' },
        cgpaOrPercentage: { type: String, default: '' }
      }
    ],
    skills: {
      programmingLanguages: [{ type: String }],
      frameworks: [{ type: String }],
      libraries: [{ type: String }],
      databases: [{ type: String }],
      tools: [{ type: String }],
      cloud: [{ type: String }],
      otherTechnologies: [{ type: String }]
    },
    projects: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        technologies: [{ type: String }],
        responsibilities: [{ type: String }],
        liveLink: { type: String, default: '' },
        githubLink: { type: String, default: '' }
      }
    ],
    experience: [
      {
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        current: { type: Boolean, default: false },
        responsibilities: [{ type: String }]
      }
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        issueDate: { type: String, default: '' },
        credentialUrl: { type: String, default: '' }
      }
    ],
    achievements: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        date: { type: String, default: '' }
      }
    ],
    softSkills: [{ type: String }],
    languages: [{ type: String }],
    professionalSummary: { type: String, default: '' },
    atsScore: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: 'resumes'
  }
);

export const Resume = mongoose.model<IResumeDocument>('Resume', ResumeSchema);
