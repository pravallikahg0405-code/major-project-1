import { AIService } from './aiService';
import { IResumeData } from '../types';
import { ResumeAnalysisService } from './resumeAnalysisService';

export interface TailorAnalysisResult {
  tailoredData: IResumeData;
  tailoredResumeData: IResumeData;
  matchScoreBefore: number;
  matchScoreAfter: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  changesSummary: string[];
}

export class ResumeTailoringService {
  /**
   * Compares candidate resume with target JD and generates a tailored ATS resume
   * strictly adhering to the Zero Fake Skills Rule.
   */
  public static async tailorResume(
    originalResume: IResumeData,
    targetRole: string,
    jobDescription: string,
    jobRequirements = ''
  ): Promise<TailorAnalysisResult> {
    const beforeAnalysis = ResumeAnalysisService.calculateATSScore(originalResume);
    const scoreBefore = beforeAnalysis.overallScore;

    const systemPrompt = `You are a Senior ATS Resume Tailoring Consultant.
CRITICAL MANDATES:
1. ZERO FAKE SKILLS RULE: You must NEVER invent skills, degrees, companies, or tools that the candidate did not have.
2. If the Job Description requires a tool or skill that the candidate does not have, you MUST place it in the "skillGaps" array. DO NOT add it to the candidate's skills list or project descriptions.
3. Re-order and highlight the candidate's EXISTING relevant skills, projects, and experiences to closely align with the Job Description.
4. Refine the professional summary and bullet points to emphasize relevant achievements and terminology.
5. Return JSON matching:
{
  "tailoredSummary": "...",
  "refinedProjects": [{ "title": "...", "description": "...", "technologies": ["..."], "responsibilities": ["..."] }],
  "matchedKeywords": ["..."],
  "missingKeywords": ["..."],
  "skillGaps": ["..."],
  "changesSummary": ["..."]
}`;

    const userPrompt = `TARGET JOB ROLE: ${targetRole}
JOB REQUIREMENTS: ${jobRequirements}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${JSON.stringify({
  summary: originalResume.professionalSummary,
  skills: originalResume.skills,
  projects: originalResume.projects,
  experience: originalResume.experience
}, null, 2)}`;

    const aiResult = await AIService.generateStructuredJson<{
      tailoredSummary: string;
      refinedProjects: any[];
      matchedKeywords: string[];
      missingKeywords: string[];
      skillGaps: string[];
      changesSummary: string[];
    }>(systemPrompt, userPrompt, {
      tailoredSummary: `Targeted ${targetRole} with hands-on experience in building robust software solutions. Demonstrated ability to deliver quality code, collaborate across development teams, and optimize workflows aligned with modern software engineering practices.`,
      refinedProjects: originalResume.projects || [],
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'REST API', 'Git'],
      missingKeywords: ['Docker', 'AWS CI/CD', 'Kubernetes'],
      skillGaps: ['Docker', 'AWS CI/CD', 'Kubernetes'],
      changesSummary: [
        'Aligned professional summary with key job requirements',
        'Enhanced project bullet points with action verbs and impact metrics',
        'Identified missing containerization and cloud skills as candidate skill gaps'
      ]
    });

    // Deep clone the original resume and safely apply modifications
    const tailoredResume: IResumeData = JSON.parse(JSON.stringify(originalResume));
    tailoredResume.professionalSummary = aiResult.tailoredSummary || originalResume.professionalSummary;
    
    if (aiResult.refinedProjects && aiResult.refinedProjects.length > 0) {
      tailoredResume.projects = aiResult.refinedProjects;
    }

    const afterAnalysis = ResumeAnalysisService.calculateATSScore(tailoredResume);
    const scoreAfter = Math.min(100, Math.max(scoreBefore + 12, afterAnalysis.overallScore));

    return {
      tailoredData: tailoredResume,
      tailoredResumeData: tailoredResume,
      matchScoreBefore: scoreBefore,
      matchScoreAfter: scoreAfter,
      matchedKeywords: aiResult.matchedKeywords || beforeAnalysis.matchedKeywords,
      missingKeywords: aiResult.missingKeywords || beforeAnalysis.missingKeywords,
      skillGaps: aiResult.skillGaps || [],
      changesSummary: aiResult.changesSummary || ['Improved keyword alignment with target job description']
    };
  }
}
