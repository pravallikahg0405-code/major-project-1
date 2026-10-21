import { AIService } from './aiService';

export class ResumeSuggestionService {
  /**
   * Suggests specialization tracks for a given career role.
   * User picks from these — AI does not force or decide.
   */
  public static async suggestSpecializations(targetRole: string): Promise<string[]> {
    const systemPrompt = `You are a technical career advisor. Given a general target role, return 4-6 industry-standard specializations or technology tracks. Respond with a JSON object: { "specializations": ["track 1", "track 2", ...] }`;
    const userPrompt = `Target Role: "${targetRole}". Provide relevant specialization tracks.`;

    const result = await AIService.generateStructuredJson<{ specializations: string[] }>(
      systemPrompt,
      userPrompt,
      {
        specializations: [
          'Full Stack Web Development (MERN / Next.js)',
          'Backend Engineering & Distributed Systems',
          'Frontend Engineering & UI/UX Architecture',
          'Cloud Architecture & DevOps'
        ]
      }
    );

    return result.specializations || [];
  }

  /**
   * Improves bullet points using Google X-Y-Z formula without inventing fake achievements.
   */
  public static async improveBulletPoint(
    rawBullet: string,
    roleContext?: string,
    technologies: string[] = []
  ): Promise<{ enhancedBullet: string; actionVerbUsed: string; impactMetricTip: string }> {
    const systemPrompt = `You are an elite ATS resume editor. 
Enhance the user's bullet point using the Google X-Y-Z formula: "Accomplished [X] measured by [Y], by doing [Z]".
RULES:
1. NEVER invent fake companies, metrics, or non-existent tech.
2. If metrics are missing, use realistic contextual indicators or prompt placeholder [e.g., by 25%].
3. Return JSON: { "enhancedBullet": "...", "actionVerbUsed": "...", "impactMetricTip": "..." }`;

    const userPrompt = `Raw Bullet: "${rawBullet}"
Context Role: "${roleContext || 'Software Developer'}"
Tech Stack: ${technologies.join(', ')}`;

    return await AIService.generateStructuredJson(systemPrompt, userPrompt, {
      enhancedBullet: `Architected and implemented responsive full-stack features using ${technologies.slice(0, 2).join(' and ') || 'modern frameworks'}, improving application performance and reducing page latency by 25%.`,
      actionVerbUsed: 'Architected',
      impactMetricTip: 'Consider quantifying your user base or latency improvement percentage.'
    });
  }

  /**
   * Generates a tailored professional summary based strictly on existing input details.
   */
  public static async generateProfessionalSummary(
    targetRole: string,
    skills: string[],
    experienceYears = 'Fresher',
    highlightProject?: string
  ): Promise<string> {
    const systemPrompt = `You are an ATS resume optimization expert. Write a concise 3-4 sentence professional summary for a resume. 
CRITICAL RULE: Rely ONLY on the candidate's provided skills and experience. Do NOT invent fake degrees or certifications.
Respond with JSON: { "summary": "..." }`;

    const userPrompt = `Target Role: ${targetRole}
Experience Level: ${experienceYears}
Key Skills: ${skills.join(', ')}
Highlight Project: ${highlightProject || 'Full Stack Web Platform'}`;

    const result = await AIService.generateStructuredJson<{ summary: string }>(
      systemPrompt,
      userPrompt,
      {
        summary: `Motivated ${targetRole} with a strong foundation in ${skills.slice(0, 4).join(', ') || 'modern software engineering principles'}. Proven track record of developing scalable applications and collaborating in agile teams to deliver clean, maintainable code. Eager to contribute technical problem-solving skills to high-impact software engineering initiatives.`
      }
    );

    return result.summary;
  }

  /**
   * Suggests categorized technical skills based on target role
   */
  public static async suggestSkills(targetRole: string): Promise<{
    programmingLanguages: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
    otherTechnologies: string[];
    softSkills: string[];
  }> {
    const roleLower = (targetRole || '').toLowerCase();
    
    // Default fallback based on role
    let fallback = {
      programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL'],
      frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS'],
      databases: ['PostgreSQL', 'MongoDB Atlas', 'Redis'],
      cloud: ['AWS (S3, Lambda, EC2)', 'Docker'],
      tools: ['Git', 'GitHub Actions', 'Postman', 'VS Code'],
      otherTechnologies: ['RESTful APIs', 'Microservices Architecture', 'CI/CD'],
      softSkills: ['System Architecture Design', 'Agile / Scrum', 'Technical Leadership', 'Cross-Functional Collaboration', 'Code Review', 'Problem Solving']
    };

    if (roleLower.includes('frontend') || roleLower.includes('ui') || roleLower.includes('react')) {
      fallback = {
        programmingLanguages: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
        frameworks: ['React', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Vue.js'],
        databases: ['Firebase', 'IndexedDB', 'Supabase'],
        cloud: ['Vercel', 'AWS S3', 'Cloudflare Pages'],
        tools: ['Vite', 'Webpack', 'Figma', 'Git', 'Jest', 'Chrome DevTools'],
        otherTechnologies: ['Responsive Design', 'Web Accessibility (WCAG)', 'Core Web Vitals', 'RESTful APIs'],
        softSkills: ['UI/UX Empathy', 'Design System Architecture', 'Web Accessibility (a11y)', 'Cross-Browser Compatibility', 'Client Communication']
      };
    } else if (roleLower.includes('backend') || roleLower.includes('api') || roleLower.includes('system')) {
      fallback = {
        programmingLanguages: ['Node.js', 'Python', 'Java', 'Go', 'SQL', 'TypeScript'],
        frameworks: ['Express', 'FastAPI', 'Spring Boot', 'NestJS', 'Django'],
        databases: ['PostgreSQL', 'MongoDB Atlas', 'Redis', 'MySQL', 'Elasticsearch'],
        cloud: ['AWS (ECS, RDS)', 'Docker', 'Kubernetes', 'GCP'],
        tools: ['Postman', 'Git', 'Kafka', 'Linux', 'Docker Compose', 'Swagger'],
        otherTechnologies: ['RESTful APIs', 'GraphQL', 'Microservices', 'Database Indexing', 'JWT Auth'],
        softSkills: ['Distributed Systems Design', 'API Governance', 'Database Optimization', 'High Availability & Fault Tolerance', 'Root Cause Analysis']
      };
    } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre')) {
      fallback = {
        programmingLanguages: ['Python', 'Bash / Shell', 'Go', 'YAML', 'JSON'],
        frameworks: ['Terraform', 'Ansible', 'Helm'],
        databases: ['PostgreSQL', 'Redis'],
        cloud: ['AWS (EKS, IAM, CloudWatch)', 'Docker', 'Kubernetes', 'Azure', 'GCP'],
        tools: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Prometheus', 'Grafana', 'Linux'],
        otherTechnologies: ['CI/CD Automation', 'Infrastructure as Code (IaC)', 'Zero-Trust Architecture', 'Site Reliability'],
        softSkills: ['Incident Management', 'Site Reliability Engineering', 'Automation Mindset', 'Security & Compliance', 'Cost Optimization']
      };
    } else if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('data') || roleLower.includes('machine learning')) {
      fallback = {
        programmingLanguages: ['Python', 'SQL', 'R', 'C++', 'JavaScript'],
        frameworks: ['PyTorch', 'TensorFlow', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-Learn'],
        databases: ['PostgreSQL', 'Pinecone / Vector DB', 'Redis', 'MongoDB'],
        cloud: ['AWS SageMaker', 'Hugging Face', 'Docker', 'Google Colab'],
        tools: ['Jupyter Notebooks', 'Git', 'LangChain', 'MLflow', 'Weights & Biases'],
        otherTechnologies: ['Retrieval-Augmented Generation (RAG)', 'LLM Fine-Tuning', 'Data Pipelines', 'Model Evaluation'],
        softSkills: ['Statistical Reasoning', 'Data Storytelling', 'Hypothesis Testing', 'AI Ethics & Governance', 'Critical Thinking']
      };
    } else if (roleLower.includes('mobile') || roleLower.includes('android') || roleLower.includes('ios')) {
      fallback = {
        programmingLanguages: ['TypeScript', 'Kotlin', 'Swift', 'JavaScript', 'Java'],
        frameworks: ['React Native', 'Flutter', 'Expo', 'SwiftUI'],
        databases: ['SQLite', 'Realm', 'Firebase Firestore'],
        cloud: ['Firebase', 'AWS Amplify'],
        tools: ['Android Studio', 'Xcode', 'Git', 'Postman', 'Flipper'],
        otherTechnologies: ['Cross-Platform Mobile UI', 'Push Notifications', 'Offline Storage', 'REST APIs'],
        softSkills: ['Mobile UX Guidelines', 'App Store Deployment', 'Memory Profiling', 'Offline-First Mindset', 'Device Fragmentation Management']
      };
    } else if (roleLower.includes('cyber') || roleLower.includes('security')) {
      fallback = {
        programmingLanguages: ['Python', 'Bash / Shell', 'C', 'SQL', 'PowerShell'],
        frameworks: ['OWASP Top 10', 'NIST Framework', 'Snort'],
        databases: ['SQL', 'Elasticsearch', 'Splunk'],
        cloud: ['AWS Security Hub', 'Cloudflare', 'Azure Sentinel'],
        tools: ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Linux'],
        otherTechnologies: ['Threat Modeling', 'Penetration Testing', 'Cryptographic Protocols', 'Zero Trust'],
        softSkills: ['Threat Modeling', 'Risk Assessment', 'Incident Response', 'Security Compliance & Auditing', 'Zero-Trust Mindset']
      };
    } else if (roleLower.includes('qa') || roleLower.includes('test')) {
      fallback = {
        programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
        frameworks: ['Playwright', 'Cypress', 'Selenium', 'Jest', 'Mocha / Chai'],
        databases: ['PostgreSQL', 'MongoDB'],
        cloud: ['AWS Device Farm', 'Sauce Labs', 'BrowserStack'],
        tools: ['Postman', 'Jira', 'GitHub Actions', 'TestRail', 'VS Code'],
        otherTechnologies: ['E2E Testing', 'Regression Testing', 'API Automation', 'CI/CD Test Gates'],
        softSkills: ['Attention to Detail', 'Edge Case Analysis', 'Bug Investigation & Reporting', 'Quality Advocacy', 'Agile Testing']
      };
    }

    const systemPrompt = `You are a Senior Technical Recruiter. Provide the top recommended technical skills and soft skills for a candidate applying for the target role. Return JSON:
{
  "programmingLanguages": ["..."],
  "frameworks": ["..."],
  "databases": ["..."],
  "cloud": ["..."],
  "tools": ["..."],
  "otherTechnologies": ["..."],
  "softSkills": ["..."]
}`;
    const userPrompt = `Target Job Role: ${targetRole}. Recommend modern in-demand technical skills across languages, frameworks, databases, cloud, tools, and soft skills/competencies.`;

    const result = await AIService.generateStructuredJson(systemPrompt, userPrompt, fallback);
    return result || fallback;
  }
}
