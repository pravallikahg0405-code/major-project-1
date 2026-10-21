import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export class ParserService {
  /**
   * Safely extract raw text from PDF or DOCX buffer
   */
  public static async extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (mimeType === 'application/pdf') {
        const data = await pdfParse(buffer);
        return data.text || '';
      }

      if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
      }

      throw new Error('Unsupported MIME type for resume text extraction.');
    } catch (error: any) {
      console.error('[ParserService Error]:', error.message);
      throw new Error(`Failed to extract text from resume: ${error.message}`);
    }
  }

  /**
   * Extract basic heuristic sections from raw text
   */
  public static parseSectionsFromText(text: string): {
    extractedEmail?: string;
    extractedPhone?: string;
    extractedSkills: string[];
    rawText: string;
  } {
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

    const commonTechSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
      'React', 'Node.js', 'Express', 'Next.js', 'Angular', 'Vue.js', 'Spring Boot', 'Django', 'FastAPI',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'SQLite',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'CI/CD', 'GraphQL', 'REST API',
      'Tailwind CSS', 'HTML5', 'CSS3', 'Jest', 'Mocha', 'Postman'
    ];

    const extractedSkills: string[] = [];
    for (const skill of commonTechSkills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        extractedSkills.push(skill);
      }
    }

    return {
      extractedEmail: emailMatch ? emailMatch[0] : undefined,
      extractedPhone: phoneMatch ? phoneMatch[0] : undefined,
      extractedSkills,
      rawText: text
    };
  }
}
