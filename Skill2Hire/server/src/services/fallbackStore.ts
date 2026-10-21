import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface LocalUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  targetRole: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalInterviewReport {
  id: string;
  userId: string;
  targetRole: string;
  difficulty?: string;
  eligibilityResult?: any;
  aptitudeScore?: any;
  technicalScore: number;
  hrScore: number;
  overallScore: number;
  communicationAssessment?: any;
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  improvementSuggestions: string[];
  recommendedLearningResources: any[];
  overallResult: string;
  createdAt: string;
}

export interface LocalResume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  personalInfo: any;
  careerTarget: any;
  education: any[];
  skills: any;
  projects: any[];
  experience: any[];
  certifications: any[];
  achievements: any[];
  softSkills: string[];
  languages: string[];
  professionalSummary: string;
  atsScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalSavedJob {
  id: string;
  userId: string;
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
  matchPercentage?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
  matchReason?: string;
  savedAt: string;
}

interface StoreSchema {
  users: LocalUser[];
  reports: LocalInterviewReport[];
  resumes: LocalResume[];
  savedJobs: LocalSavedJob[];
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

class FallbackStore {
  private store: StoreSchema = {
    users: [],
    reports: [],
    resumes: [],
    savedJobs: []
  };

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        this.store = JSON.parse(raw);
      } else {
        // Pre-seed demo user
        const salt = bcrypt.genSaltSync(10);
        const demoPasswordHash = bcrypt.hashSync('Demo123!', salt);
        this.store.users.push({
          id: 'demo_user_001',
          fullName: 'Demo Candidate',
          email: 'demo@skill2hire.com',
          passwordHash: demoPasswordHash,
          targetRole: 'Full Stack Developer',
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'Git'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        this.save();
      }
    } catch (e) {
      console.warn('[FallbackStore] Could not load store from disk, initializing in-memory store:', e);
    }
  }

  private save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[FallbackStore] Failed to write store to disk:', e);
    }
  }

  // --- USER METHODS ---
  public findUserByEmail(email: string): LocalUser | undefined {
    const cleanEmail = email.toLowerCase().trim();
    return this.store.users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  }

  public findUserById(id: string): LocalUser | undefined {
    return this.store.users.find(u => u.id === id);
  }

  public createUser(userData: {
    fullName: string;
    email: string;
    passwordHash: string;
    targetRole?: string;
    skills?: string[];
  }): LocalUser {
    const newUser: LocalUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: userData.fullName.trim(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      targetRole: userData.targetRole || 'Software Engineer',
      skills: userData.skills || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.store.users.push(newUser);
    this.save();
    return newUser;
  }

  // --- REPORT METHODS ---
  public saveReport(reportData: Omit<LocalInterviewReport, 'id' | 'createdAt'>): LocalInterviewReport {
    const newReport: LocalInterviewReport = {
      id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...reportData,
      createdAt: new Date().toISOString()
    };
    this.store.reports.unshift(newReport);
    this.save();
    return newReport;
  }

  public listReports(userId: string): LocalInterviewReport[] {
    return this.store.reports.filter(r => r.userId === userId);
  }

  public getReportById(id: string): LocalInterviewReport | undefined {
    return this.store.reports.find(r => r.id === id);
  }

  // --- RESUME METHODS ---
  public saveResume(resumeData: Omit<LocalResume, 'id' | 'createdAt' | 'updatedAt'>): LocalResume {
    const newResume: LocalResume = {
      id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...resumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.resumes.unshift(newResume);
    this.save();
    return newResume;
  }

  public listResumes(userId: string): LocalResume[] {
    return this.store.resumes.filter(r => r.userId === userId);
  }

  public getResumeById(id: string): LocalResume | undefined {
    return this.store.resumes.find(r => r.id === id);
  }

  public updateResume(id: string, userId: string, updateData: Partial<LocalResume>): LocalResume | null {
    const index = this.store.resumes.findIndex(r => r.id === id && r.userId === userId);
    if (index === -1) return null;
    this.store.resumes[index] = {
      ...this.store.resumes[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.store.resumes[index];
  }

  // --- SAVED JOBS ---
  public saveJob(jobData: Omit<LocalSavedJob, 'id' | 'savedAt'>): LocalSavedJob {
    const existing = this.store.savedJobs.find(j => j.userId === jobData.userId && j.jobId === jobData.jobId);
    if (existing) {
      Object.assign(existing, jobData, { savedAt: new Date().toISOString() });
      this.save();
      return existing;
    }
    const newJob: LocalSavedJob = {
      id: 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...jobData,
      savedAt: new Date().toISOString()
    };
    this.store.savedJobs.unshift(newJob);
    this.save();
    return newJob;
  }

  public listSavedJobs(userId: string): LocalSavedJob[] {
    return this.store.savedJobs.filter(j => j.userId === userId);
  }

  public deleteSavedJob(id: string, userId: string): boolean {
    const initialLen = this.store.savedJobs.length;
    this.store.savedJobs = this.store.savedJobs.filter(j => !(j.id === id && j.userId === userId));
    const deleted = this.store.savedJobs.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }
}

export const fallbackStore = new FallbackStore();
