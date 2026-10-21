import { IResumeData } from '../types';

export interface ATSAnalysisResult {
  overallScore: number;
  scoreBreakdown: {
    sectionCompleteness: number; // Max 25
    keywordRelevance: number;    // Max 25
    skillsMatch: number;         // Max 25
    structureAndHeadings: number;// Max 15
    formattingAndImpact: number; // Max 10
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionIssues: string[];
  recommendations: string[];
  disclaimer: string;
}

export class ResumeAnalysisService {
  /**
   * Measurable Rule-Based ATS Analysis Engine
   */
  public static calculateATSScore(resumeData: Partial<IResumeData>): ATSAnalysisResult {
    let sectionCompleteness = 0;
    let keywordRelevance = 0;
    let skillsMatch = 0;
    let structureAndHeadings = 0;
    let formattingAndImpact = 0;

    const sectionIssues: string[] = [];
    const recommendations: string[] = [];
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    // 1. SECTION COMPLETENESS (Max 25 pts)
    const personal = resumeData.personalInfo;
    if (personal?.fullName && personal?.email && personal?.phone && personal?.location) {
      sectionCompleteness += 5;
    } else {
      sectionIssues.push('Incomplete contact information (Missing phone, location, or email).');
    }

    if (resumeData.professionalSummary && resumeData.professionalSummary.length > 50) {
      sectionCompleteness += 5;
    } else {
      sectionIssues.push('Professional Summary is missing or too short.');
      recommendations.push('Add a 3-4 sentence professional summary highlighting your core tech stack and value.');
    }

    if (resumeData.education && resumeData.education.length > 0) {
      sectionCompleteness += 5;
    } else {
      sectionIssues.push('Education section is missing.');
    }

    if (resumeData.projects && resumeData.projects.length >= 2) {
      sectionCompleteness += 5;
    } else if (resumeData.projects && resumeData.projects.length === 1) {
      sectionCompleteness += 3;
      recommendations.push('Include at least 2 detailed technical projects demonstrating full development lifecycle.');
    } else {
      sectionIssues.push('No technical projects found.');
    }

    if (resumeData.experience && resumeData.experience.length > 0) {
      sectionCompleteness += 5;
    } else {
      // If student/fresher, give partial points if projects are strong
      sectionCompleteness += (resumeData.projects && resumeData.projects.length >= 2) ? 4 : 2;
    }

    // 2. SKILLS MATCH (Max 25 pts)
    const allSkills: string[] = [
      ...(resumeData.skills?.programmingLanguages || []),
      ...(resumeData.skills?.frameworks || []),
      ...(resumeData.skills?.libraries || []),
      ...(resumeData.skills?.databases || []),
      ...(resumeData.skills?.tools || []),
      ...(resumeData.skills?.cloud || []),
      ...(resumeData.skills?.otherTechnologies || []),
      ...(resumeData.softSkills || [])
    ];

    if (allSkills.length >= 10) {
      skillsMatch = 25;
    } else if (allSkills.length >= 6) {
      skillsMatch = 18;
      recommendations.push('Expand your technical skills list to cover databases, testing tools, and deployment environments.');
    } else if (allSkills.length >= 3) {
      skillsMatch = 12;
    } else {
      skillsMatch = 5;
      sectionIssues.push('Skills section has very few listed technologies.');
    }

    // 3. KEYWORD RELEVANCE (Max 25 pts)
    const targetRole = (resumeData.careerTarget?.targetRole || '').toLowerCase();
    const roleKeywordDictionary: Record<string, string[]> = {
      'frontend': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind', 'Redux', 'REST API', 'Responsive Design', 'Webpack/Vite'],
      'backend': ['Node.js', 'Express', 'Java', 'Spring Boot', 'Python', 'Django', 'MongoDB', 'PostgreSQL', 'REST API', 'Microservices', 'Docker'],
      'full stack': ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Express', 'MongoDB', 'SQL', 'Git', 'REST API', 'CI/CD', 'Tailwind'],
      'software engineer': ['Data Structures', 'Algorithms', 'OOP', 'Git', 'System Design', 'Unit Testing', 'CI/CD', 'REST API', 'SQL']
    };

    let targetDict: string[] = roleKeywordDictionary['full stack'];
    for (const key of Object.keys(roleKeywordDictionary)) {
      if (targetRole.includes(key)) {
        targetDict = roleKeywordDictionary[key];
        break;
      }
    }

    const flatResumeText = JSON.stringify(resumeData).toLowerCase();
    let matchedCount = 0;

    for (const kw of targetDict) {
      if (flatResumeText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
        matchedCount++;
      } else {
        missingKeywords.push(kw);
      }
    }

    keywordRelevance = Math.round((matchedCount / targetDict.length) * 25);

    // 4. STRUCTURE & HEADINGS (Max 15 pts)
    // ATS Single column & standard template checks
    structureAndHeadings += 15; // Built-in templates comply with single column & standard headers

    // 5. FORMATTING & IMPACT METRICS (Max 10 pts)
    const allBullets: string[] = [];
    resumeData.projects?.forEach(p => p.responsibilities?.forEach(r => allBullets.push(r)));
    resumeData.experience?.forEach(e => e.responsibilities?.forEach(r => allBullets.push(r)));

    const strongActionVerbs = ['developed', 'architected', 'engineered', 'built', 'implemented', 'designed', 'optimized', 'reduced', 'increased', 'delivered'];
    let strongVerbCount = 0;
    let metricCount = 0;

    for (const b of allBullets) {
      const lower = b.toLowerCase();
      if (strongActionVerbs.some(v => lower.includes(v))) strongVerbCount++;
      if (/\d+%|\$\d+|\d+\s*(ms|users|requests|x)/i.test(b)) metricCount++;
    }

    if (strongVerbCount >= 3) formattingAndImpact += 5;
    else recommendations.push('Start your experience and project bullet points with strong action verbs (e.g., Architected, Optimized).');

    if (metricCount >= 2) formattingAndImpact += 5;
    else recommendations.push('Quantify results in your bullet points with measurable impact numbers (e.g., "reduced latency by 20%").');

    const overallScore = Math.min(
      100,
      Math.max(0, sectionCompleteness + keywordRelevance + skillsMatch + structureAndHeadings + formattingAndImpact)
    );

    return {
      overallScore,
      scoreBreakdown: {
        sectionCompleteness,
        keywordRelevance,
        skillsMatch,
        structureAndHeadings,
        formattingAndImpact
      },
      matchedKeywords,
      missingKeywords,
      sectionIssues,
      recommendations,
      disclaimer: 'Skill2Hire ATS Compatibility Score — An algorithmic estimation of resume structure and keyword readiness, not an endorsement by any specific proprietary ATS.'
    };
  }
}
