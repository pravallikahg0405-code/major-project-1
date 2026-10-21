export interface IUser {
  id: string;
  fullName: string;
  email: string;
  targetRole?: string;
  skills: string[];
}

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ICareerTarget {
  targetRole: string;
  specialization?: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  university?: string;
  startYear?: string;
  endYear: string;
  cgpaOrPercentage: string;
}

export interface ISkillsCategory {
  programmingLanguages: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  tools: string[];
  cloud: string[];
  otherTechnologies: string[];
}

export interface IProject {
  title: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  liveLink?: string;
  githubLink?: string;
}

export interface IExperience {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export interface ICertification {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface IAchievement {
  title: string;
  description: string;
  date?: string;
}

export interface IResumeData {
  _id?: string;
  title: string;
  templateId: 'ats-classic' | 'ats-modern' | 'ats-technical';
  personalInfo: IPersonalInfo;
  careerTarget: ICareerTarget;
  education: IEducation[];
  skills: ISkillsCategory;
  projects: IProject[];
  experience: IExperience[];
  certifications: ICertification[];
  achievements: IAchievement[];
  softSkills: string[];
  languages: string[];
  professionalSummary: string;
  atsScore?: number;
  updatedAt?: string;
}

export interface IATSScoreBreakdown {
  overallScore: number;
  scoreBreakdown: {
    sectionCompleteness: number;
    keywordRelevance: number;
    skillsMatch: number;
    structureAndHeadings: number;
    formattingAndImpact: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionIssues: string[];
  recommendations: string[];
  disclaimer: string;
}

export interface ITailoredResume {
  targetRole: string;
  jobDescription: string;
  jobRequirements?: string[];
  tailoredResumeData: IResumeData;
  matchScoreBefore: number;
  matchScoreAfter: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  changesSummary: string[];
  createdAt?: string;
}

export interface ITailoredResumeRecord {
  _id?: string;
  targetRole: string;
  jobDescription: string;
  jobRequirements?: string;
  tailoredData: IResumeData;
  matchScoreBefore: number;
  matchScoreAfter: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  changesSummary: string[];
  createdAt?: string;
}

export interface IJob {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  experience: string;
  description: string;
  skills: string[];
  source: string;
  applicationUrl: string;
  postedDate: string;
  matchPercentage?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
  matchReason?: string;
}

export interface IAptitudeQuestion {
  id: number;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Data Interpretation';
  question: string;
  options: string[];
}

export interface IInterviewReport {
  _id?: string;
  targetRole: string;
  difficulty?: string;
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
  createdAt?: string;
}

export interface INewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  category: string;
  publishedDate: string;
  coverImage?: string;
  originalSummary: string;
  aiKeyTakeaways: string[];
}
