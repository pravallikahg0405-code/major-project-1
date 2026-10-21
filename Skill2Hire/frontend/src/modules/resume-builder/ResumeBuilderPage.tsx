import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, getErrorMessage } from '../../services/api';
import { IResumeData, IATSScoreBreakdown } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { SkillTagInput } from '../../components/common/SkillTagInput';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Layout, 
  ArrowRight,
  RefreshCw,
  Eye,
  FileCode,
  FileSpreadsheet,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Award,
  Check,
  FolderGit2,
  Code2,
  Layers,
  Database,
  Wrench,
  Users
} from 'lucide-react';

const defaultResume: IResumeData = {
  title: 'My ATS Professional Resume',
  templateId: 'ats-modern',
  personalInfo: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/aarav-sharma-dev',
    github: 'github.com/aarav-dev',
    portfolio: 'aarav-portfolio.dev'
  },
  careerTarget: {
    targetRole: 'Senior Full Stack Software Engineer',
    specialization: 'Cloud Microservices & Modern Web Platforms'
  },
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'State University of Technology',
      university: 'Tech University',
      startYear: '2020',
      endYear: '2024',
      cgpaOrPercentage: '3.8 / 4.0 GPA'
    }
  ],
  skills: {
    programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'Go'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Mongoose', 'Prisma', 'Axios', 'Jest'],
    libraries: [],
    databases: ['PostgreSQL', 'MongoDB Atlas', 'Redis', 'AWS (ECS, S3, Lambda)', 'Vercel', 'GCP'],
    tools: ['Git', 'GitHub Actions', 'Docker', 'Postman', 'VS Code', 'RESTful APIs', 'GraphQL', 'Microservices Architecture', 'CI/CD Pipelines'],
    cloud: [],
    otherTechnologies: []
  },
  projects: [
    {
      title: 'Distributed Cloud Event Platform',
      description: 'High-throughput real-time event processing system handling asynchronous notifications and analytics.',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB Atlas', 'Redis', 'AWS'],
      responsibilities: [
        'Architected modular REST and WebSocket backend services supporting 20k+ concurrent connected users.',
        'Engineered Redis caching layer and optimized MongoDB indexes, reducing average API response latency by 35%.',
        'Implemented automated CI/CD deployment pipelines using GitHub Actions and AWS containerized infrastructure.'
      ],
      liveLink: 'https://cloud-event-platform.dev',
      githubLink: 'https://github.com/aarav-dev/event-platform'
    }
  ],
  experience: [
    {
      company: 'TechMatrix Systems',
      role: 'Full Stack Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jun 2024',
      endDate: 'Present',
      current: true,
      responsibilities: [
        'Designed and shipped enterprise dashboard features used by 50,000+ active monthly enterprise clients.',
        'Refactored legacy REST microservices into modern TypeScript services, improving system test coverage to 92%.',
        'Collaborated with product and DevOps teams to reduce cloud infrastructure overhead by 22%.'
      ]
    }
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect — Associate', issuer: 'Amazon Web Services', issueDate: '2024' }
  ],
  achievements: [
    { title: '1st Place Winner — Global Cloud Innovations Hackathon', description: 'Engineered an offline-first disaster response coordination application in 36 hours.' }
  ],
  softSkills: ['System Architecture Design', 'Agile Leadership', 'Technical Mentorship', 'Cross-Functional Collaboration', 'Code Review & Mentorship', 'Problem Solving'],
  languages: ['English (Fluent)', 'Spanish (Conversational)'],
  professionalSummary: 'Results-driven Full Stack Software Engineer with expertise in building resilient TypeScript/React web applications and scalable Node.js microservices. Proven track record in cloud architecture, database performance optimization, and implementing rigorous ATS standards.'
};

// Pure sanitizer to prevent duplicated skills from previously saved drafts
const normalizeResumeSkills = (draft: IResumeData): IResumeData => {
  const mergeDedup = (...arrays: (string[] | undefined)[]): string[] => {
    const seen = new Set<string>();
    const res: string[] = [];
    for (const arr of arrays) {
      if (!arr) continue;
      for (const item of arr) {
        const clean = item?.trim();
        if (!clean) continue;
        const lower = clean.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          res.push(clean);
        }
      }
    }
    return res;
  };

  const existingSkills = draft?.skills || {
    programmingLanguages: [],
    frameworks: [],
    libraries: [],
    databases: [],
    tools: [],
    cloud: [],
    otherTechnologies: []
  };

  return {
    ...draft,
    softSkills: mergeDedup(draft?.softSkills),
    skills: {
      programmingLanguages: mergeDedup(existingSkills.programmingLanguages),
      frameworks: mergeDedup(existingSkills.frameworks, existingSkills.libraries),
      libraries: [],
      databases: mergeDedup(existingSkills.databases, existingSkills.cloud),
      cloud: [],
      tools: mergeDedup(existingSkills.tools, existingSkills.otherTechnologies),
      otherTechnologies: []
    }
  };
};

// Summary suggestions by role
const summarySuggestionsByRole = [
  {
    role: 'Full Stack Engineer',
    text: 'Results-driven Full Stack Software Engineer with expertise in architecting high-performance React and Node.js web applications. Demonstrated success in scaling cloud microservices, optimizing database throughput by 30%+, and delivering secure, accessible user experiences.'
  },
  {
    role: 'Frontend Specialist',
    text: 'User-centric Frontend Engineer specializing in React, TypeScript, and modern design systems. Passionate about web performance optimization, sub-second render speeds, component reusability, and responsive cross-platform accessibility.'
  },
  {
    role: 'Backend & Cloud SDE',
    text: 'Performance-focused Backend Engineer with deep knowledge of distributed systems, RESTful & GraphQL APIs, and cloud infrastructure (AWS/Docker). Proven ability to design fault-tolerant microservices handling high transaction volumes with 99.9% uptime.'
  },
  {
    role: 'Recent Graduate / Entry Level',
    text: 'Ambitious Computer Science graduate with hands-on project experience in full-stack web development, data structures, and cloud databases. Quick learner adept at TypeScript, modern frameworks, and agile software development lifecycle.'
  }
];

const roleSkillsCatalog: Record<string, {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  softSkills: string[];
}> = {
  'Full Stack': {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'HTML5', 'CSS3'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
    databases: ['PostgreSQL', 'MongoDB Atlas', 'Redis', 'MySQL'],
    tools: ['Git', 'GitHub Actions', 'Docker', 'AWS (S3, Lambda)', 'Postman', 'RESTful APIs'],
    softSkills: ['System Architecture Design', 'Agile / Scrum', 'Technical Leadership', 'Cross-Functional Collaboration', 'Code Review & Mentorship', 'Problem Solving']
  },
  'Frontend': {
    languages: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Vue.js', 'Vite'],
    databases: ['Firebase', 'Supabase', 'IndexedDB'],
    tools: ['Git', 'Figma', 'Jest', 'Chrome DevTools', 'Webpack', 'Responsive Design'],
    softSkills: ['UI/UX Empathy', 'Design System Architecture', 'Web Accessibility (WCAG)', 'Cross-Browser Compatibility', 'Client Communication', 'Visual Hierarchy']
  },
  'Backend': {
    languages: ['Node.js', 'Python', 'Java', 'Go', 'SQL', 'TypeScript', 'C++'],
    frameworks: ['Express', 'FastAPI', 'Spring Boot', 'NestJS', 'Django'],
    databases: ['PostgreSQL', 'MongoDB Atlas', 'Redis', 'MySQL', 'Elasticsearch'],
    tools: ['Docker', 'AWS (ECS, RDS)', 'Kafka', 'Postman', 'Git', 'Microservices Architecture'],
    softSkills: ['Distributed Systems Architecture', 'API Governance', 'Database Optimization', 'High Availability & Fault Tolerance', 'Root Cause Analysis', 'System Security']
  },
  'DevOps / Cloud': {
    languages: ['Python', 'Bash / Shell', 'Go', 'YAML', 'JSON'],
    frameworks: ['Terraform', 'Ansible', 'Helm'],
    databases: ['PostgreSQL', 'Redis'],
    tools: ['Kubernetes', 'Docker', 'AWS (EKS, IAM)', 'GitHub Actions', 'Linux', 'CI/CD Pipelines'],
    softSkills: ['Infrastructure Automation', 'Incident Management & RCA', 'Site Reliability Engineering', 'Security & Compliance', 'Cost Optimization', 'Disaster Recovery Planning']
  },
  'AI / Data Science': {
    languages: ['Python', 'SQL', 'R', 'C++', 'JavaScript'],
    frameworks: ['PyTorch', 'TensorFlow', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-Learn'],
    databases: ['PostgreSQL', 'Pinecone / Vector DB', 'Redis'],
    tools: ['Jupyter Notebooks', 'Git', 'LangChain', 'Docker', 'Hugging Face', 'Data Pipelines'],
    softSkills: ['Statistical Reasoning', 'Data Storytelling', 'Hypothesis Testing', 'AI Ethics & Governance', 'Critical Thinking', 'Model Validation']
  },
  'Mobile (React Native / Android)': {
    languages: ['TypeScript', 'Kotlin', 'Swift', 'JavaScript', 'Java'],
    frameworks: ['React Native', 'Flutter', 'Expo', 'SwiftUI'],
    databases: ['SQLite', 'Firebase Firestore', 'Realm'],
    tools: ['Android Studio', 'Xcode', 'Git', 'Postman', 'Push Notifications'],
    softSkills: ['Mobile UX Guidelines', 'App Store Release Management', 'Memory Profiling', 'Offline-First Architecture', 'Device Fragmentation Handling']
  },
  'Cybersecurity': {
    languages: ['Python', 'Bash / Shell', 'C', 'SQL', 'PowerShell'],
    frameworks: ['OWASP Top 10', 'NIST Framework', 'Snort'],
    databases: ['SQL', 'Elasticsearch', 'Splunk'],
    tools: ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Linux', 'Cryptographic Protocols'],
    softSkills: ['Threat Modeling', 'Risk Assessment', 'Incident Response', 'Security Compliance & Auditing', 'Zero-Trust Mindset', 'Security Forensics']
  },
  'QA / Testing': {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
    frameworks: ['Playwright', 'Cypress', 'Selenium', 'Jest', 'Mocha / Chai'],
    databases: ['PostgreSQL', 'MongoDB'],
    tools: ['Postman', 'Jira', 'GitHub Actions', 'TestRail', 'BrowserStack'],
    softSkills: ['Attention to Detail', 'Edge Case Analysis', 'Bug Investigation & Reporting', 'Quality Advocacy', 'Agile Testing']
  },
  'Data Analyst / BI': {
    languages: ['SQL', 'Python', 'R', 'DAX', 'PowerQuery'],
    frameworks: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    databases: ['BigQuery', 'Snowflake', 'PostgreSQL', 'SQL Server'],
    tools: ['Power BI', 'Tableau', 'Excel (Advanced)', 'Git', 'dbt'],
    softSkills: ['Business Intelligence', 'Data Storytelling', 'Stakeholder Presentations', 'Quantitative Analysis', 'KPI Tracking']
  }
};

export const ResumeBuilderPage: React.FC = () => {
  const { isAuthenticated, openAuthModal, saveGuestDraft, getGuestDraft } = useAuth();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState<IResumeData>(() => 
    normalizeResumeSkills(getGuestDraft('resume_draft', defaultResume))
  );
  const [atsScoreData, setAtsScoreData] = useState<IATSScoreBreakdown | null>(null);
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Smart Technical & Soft Skill Suggestions state
  const [activeSkillCategoryTab, setActiveSkillCategoryTab] = useState('Full Stack');
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [aiSkillSuggestions, setAiSkillSuggestions] = useState<{
    programmingLanguages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
    softSkills?: string[];
  } | null>(null);

  // Toggle or add a skill to a specific resume section
  const handleToggleSkill = (
    category: 'programmingLanguages' | 'frameworks' | 'databases' | 'tools' | 'softSkills',
    skill: string
  ) => {
    setResumeData(prev => {
      if (category === 'softSkills') {
        const currentList = prev.softSkills || [];
        const exists = currentList.some(s => s.toLowerCase() === skill.toLowerCase());
        const updatedList = exists
          ? currentList.filter(s => s.toLowerCase() !== skill.toLowerCase())
          : [...currentList, skill];
        return {
          ...prev,
          softSkills: updatedList
        };
      }

      const currentList = prev.skills[category] || [];
      const exists = currentList.some(s => s.toLowerCase() === skill.toLowerCase());
      const updatedList = exists
        ? currentList.filter(s => s.toLowerCase() !== skill.toLowerCase())
        : [...currentList, skill];

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: updatedList,
          ...(category === 'frameworks' ? { libraries: [] } : {}),
          ...(category === 'databases' ? { cloud: [] } : {}),
          ...(category === 'tools' ? { otherTechnologies: [] } : {})
        }
      };
    });
  };

  // Add all recommended skills for current role preset
  const handleAddAllSkillsForRole = (roleKey: string) => {
    const catalog = roleSkillsCatalog[roleKey];
    if (!catalog) return;

    setResumeData(prev => {
      const mergeUnique = (existing: string[] = [], incoming: string[] = []) => {
        const set = new Set(existing.map(s => s.toLowerCase()));
        const additions = incoming.filter(s => !set.has(s.toLowerCase()));
        return [...existing, ...additions];
      };

      return {
        ...prev,
        softSkills: mergeUnique(prev.softSkills || [], catalog.softSkills || []),
        skills: {
          ...prev.skills,
          programmingLanguages: mergeUnique(prev.skills.programmingLanguages, catalog.languages),
          frameworks: mergeUnique(prev.skills.frameworks.concat(prev.skills.libraries || []), catalog.frameworks),
          libraries: [],
          databases: mergeUnique(prev.skills.databases.concat(prev.skills.cloud || []), catalog.databases),
          cloud: [],
          tools: mergeUnique(prev.skills.tools.concat(prev.skills.otherTechnologies || []), catalog.tools),
          otherTechnologies: []
        }
      };
    });
    setSaveStatus(`✅ Added all recommended technical & soft skills for "${roleKey}"`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // AI: Fetch smart skill suggestions based on target role
  const handleAiSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const res = await api.post('/resumes/ai-skills', {
        targetRole: resumeData.careerTarget.targetRole
      });
      if (res.data?.success && res.data?.data) {
        const suggested = res.data.data;
        setAiSkillSuggestions({
          programmingLanguages: suggested.programmingLanguages || [],
          frameworks: suggested.frameworks || [],
          databases: suggested.databases || [],
          tools: suggested.tools || [],
          softSkills: suggested.softSkills || []
        });

        setResumeData(prev => {
          const mergeUnique = (existing: string[] = [], incoming: string[] = []) => {
            const set = new Set(existing.map(s => s.toLowerCase()));
            const additions = incoming.filter(s => !set.has(s.toLowerCase()));
            return [...existing, ...additions];
          };

          return {
            ...prev,
            softSkills: mergeUnique(prev.softSkills || [], suggested.softSkills || []),
            skills: {
              ...prev.skills,
              programmingLanguages: mergeUnique(prev.skills.programmingLanguages, suggested.programmingLanguages),
              frameworks: mergeUnique(prev.skills.frameworks.concat(prev.skills.libraries || []), suggested.frameworks),
              libraries: [],
              databases: mergeUnique(prev.skills.databases.concat(prev.skills.cloud || []), suggested.databases),
              cloud: [],
              tools: mergeUnique(prev.skills.tools.concat(prev.skills.otherTechnologies || []), suggested.tools),
              otherTechnologies: []
            }
          };
        });
        setSaveStatus(`✅ Added AI-recommended technical & soft skills for "${resumeData.careerTarget.targetRole}"`);
        setTimeout(() => setSaveStatus(null), 3500);
      }
    } catch (e) {
      console.warn('AI skills error:', e);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  // Auto-save guest draft to localStorage on change
  useEffect(() => {
    saveGuestDraft('resume_draft', resumeData);
    runATSAnalysis(resumeData);
  }, [resumeData]);

  const runATSAnalysis = async (data: IResumeData) => {
    try {
      const res = await api.post('/resumes/ats-analysis', data);
      if (res.data?.success) {
        setAtsScoreData(res.data.data);
      }
    } catch (e) {
      // Local fallback calculation if backend is loading
    }
  };

  // AI: Suggest Specializations
  const handleSuggestSpecializations = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.post('/resumes/ai-specializations', {
        targetRole: resumeData.careerTarget.targetRole
      });
      if (res.data?.success && res.data?.data?.specializations) {
        setAiSuggestions(res.data.data.specializations);
      }
    } catch (error) {
      console.warn('AI suggestions error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI: Enhance Professional Summary
  const handleEnhanceSummary = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.post('/resumes/ai-summary', {
        targetRole: resumeData.careerTarget.targetRole,
        skills: [
          ...resumeData.skills.programmingLanguages,
          ...resumeData.skills.frameworks,
          ...resumeData.skills.databases
        ],
        highlightProject: resumeData.projects[0]?.title
      });
      if (res.data?.success && res.data?.data?.summary) {
        setResumeData(prev => ({
          ...prev,
          professionalSummary: res.data.data.summary
        }));
      }
    } catch (error) {
      console.warn('AI summary error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick Action: Apply a professional summary template
  const applySummaryTemplate = (summaryText: string) => {
    setResumeData(prev => ({ ...prev, professionalSummary: summaryText }));
  };

  // Quick Action: Add Google X-Y-Z formula bullet to project
  const addProjectBulletSuggestion = (projIdx: number, suggestionType: 'metric' | 'scale' | 'security') => {
    let suggestion = '';
    if (suggestionType === 'metric') {
      suggestion = 'Optimized application rendering pipeline, decreasing page load time by 38% and boosting user engagement.';
    } else if (suggestionType === 'scale') {
      suggestion = 'Architected resilient microservices supporting 15,000+ daily requests with 99.9% uptime.';
    } else {
      suggestion = 'Implemented secure JWT authentication and role-based access control (RBAC) across all protected endpoints.';
    }

    const updated = [...resumeData.projects];
    updated[projIdx].responsibilities = [...updated[projIdx].responsibilities, suggestion];
    setResumeData(prev => ({ ...prev, projects: updated }));
  };

  // Quick Action: Add Google X-Y-Z formula bullet to experience
  const addExpBulletSuggestion = (expIdx: number, suggestionType: 'kpi' | 'refactor' | 'collab') => {
    let suggestion = '';
    if (suggestionType === 'kpi') {
      suggestion = 'Accelerated core API query performance by 40% through query index optimizations and distributed caching.';
    } else if (suggestionType === 'refactor') {
      suggestion = 'Spearheaded codebase modularization and automated testing, elevating test coverage from 65% to 94%.';
    } else {
      suggestion = 'Collaborated with cross-functional product and design teams in Agile sprints to ship bi-weekly release milestones.';
    }

    const updated = [...resumeData.experience];
    updated[expIdx].responsibilities = [...updated[expIdx].responsibilities, suggestion];
    setResumeData(prev => ({ ...prev, experience: updated }));
  };

  // Action: Save to Cloud
  const handleSaveToCloud = async () => {
    if (!isAuthenticated) {
      openAuthModal('Create a free account to save and sync your resume in cloud storage.', handleSaveToCloud);
      return;
    }

    try {
      setSaveStatus('Saving resume to cloud...');
      const res = await api.post('/resumes', resumeData);
      if (res.data?.success) {
        setSaveStatus('✅ Resume successfully saved to your account!');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (error: any) {
      setSaveStatus(`❌ Error: ${getErrorMessage(error)}`);
    }
  };

  // Action: Download PDF
  const handleDownloadPDF = async () => {
    if (!isAuthenticated) {
      openAuthModal('Create a free account to download your ATS-compliant PDF resume.', handleDownloadPDF);
      return;
    }

    try {
      setSaveStatus('Generating ATS PDF...');
      const res = await api.post('/resumes/export-pdf', resumeData, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSaveStatus(null);
    } catch (error: any) {
      setSaveStatus('Failed to download PDF.');
    }
  };

  // Action: Download DOCX
  const handleDownloadDOCX = async () => {
    if (!isAuthenticated) {
      openAuthModal('Create a free account to download your editable Word (.docx) resume.', handleDownloadDOCX);
      return;
    }

    try {
      setSaveStatus('Generating ATS DOCX...');
      const res = await api.post('/resumes/export-docx', resumeData, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_ATS_Resume.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSaveStatus(null);
    } catch (error: any) {
      setSaveStatus('Failed to download DOCX.');
    }
  };

  // Shortcut to Resume Tailoring
  const handleSendToTailor = () => {
    saveGuestDraft('tailor_imported_resume', resumeData);
    navigate('/tailor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">ATS Resume Engine</Badge>
            <Badge variant="success" size="sm">Single-Column Standard</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume builder (ATS friendly)
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Build ATS-compliant resumes with real-time keyword scoring, Google X-Y-Z metric bullets, and instant PDF/DOCX exports.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={handleSaveToCloud}>
            <Save className="w-4 h-4 text-emerald-400" />
            Save to Cloud
          </Button>

          <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4" />
            Download PDF
          </Button>

          <Button variant="secondary" size="sm" onClick={handleDownloadDOCX}>
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            Download DOCX
          </Button>

          <Button variant="ghost" size="sm" onClick={handleSendToTailor} className="text-brand-400 border border-brand-500/30 hover:bg-brand-500/10">
            Tailor for Job
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {saveStatus && (
        <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-brand-500/30 text-xs text-brand-300 flex items-center justify-between animate-fadeIn">
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Grid: Form / ATS Meter / Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Form Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Template Selector */}
          <Card className="p-4 bg-slate-900/90">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-brand-400" />
                Select ATS-Friendly Template
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">95%+ ATS Parsable</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ats-classic', name: 'ATS Classic', desc: 'Traditional Linear' },
                { id: 'ats-modern', name: 'ATS Modern', desc: 'Clean Section Dividers' },
                { id: 'ats-technical', name: 'ATS Technical', desc: 'Developer Matrix' }
              ].map(tmpl => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setResumeData(prev => ({ ...prev, templateId: tmpl.id as any }))}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    resumeData.templateId === tmpl.id
                      ? 'bg-brand-500/15 border-brand-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{tmpl.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Section 1: Personal Details */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={resumeData.personalInfo.fullName}
                  onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, fullName: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. alex.morgan@example.com"
                  value={resumeData.personalInfo.email}
                  onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, email: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 234-5678"
                  value={resumeData.personalInfo.phone}
                  onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, phone: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location (City, Country) *</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  value={resumeData.personalInfo.location}
                  onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, location: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  placeholder="e.g. linkedin.com/in/alexmorgan"
                  value={resumeData.personalInfo.linkedin}
                  onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, linkedin: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  placeholder="e.g. github.com/alexmorgan or alexmorgan.dev"
                  value={resumeData.personalInfo.github}
                  onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, github: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Career Target & AI Specialization */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                Career Target & Specialization
              </h3>
              <Button variant="ghost" size="sm" onClick={handleSuggestSpecializations} isLoading={isAiLoading} className="text-xs text-brand-400 gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Suggest Specializations
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={resumeData.careerTarget.targetRole}
                  onChange={e => setResumeData(p => ({ ...p, careerTarget: { ...p.careerTarget, targetRole: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specialization Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Microservices & Distributed Architecture"
                  value={resumeData.careerTarget.specialization}
                  onChange={e => setResumeData(p => ({ ...p, careerTarget: { ...p.careerTarget, specialization: e.target.value } }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            {aiSuggestions.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs text-brand-400 font-medium block mb-2">AI Suggested Specializations (Click to apply):</span>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((track, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setResumeData(p => ({ ...p, careerTarget: { ...p.careerTarget, specialization: track } }))}
                      className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-brand-400 text-slate-300 hover:text-white transition-colors"
                    >
                      + {track}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Section 3: Professional Summary & Suggestions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                Professional Summary
              </h3>
              <Button variant="ghost" size="sm" onClick={handleEnhanceSummary} isLoading={isAiLoading} className="text-xs text-brand-400 gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Enhance Summary
              </Button>
            </div>

            {/* Ready-to-Use Summary Suggestion Chips */}
            <div className="mb-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Summary Templates (Click to insert):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {summarySuggestionsByRole.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applySummaryTemplate(item.text)}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-brand-400 text-left transition-colors group"
                  >
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-brand-300 flex items-center justify-between">
                      <span>{item.role}</span>
                      <span className="text-[10px] text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">Apply</span>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{item.text}</div>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              value={resumeData.professionalSummary}
              onChange={e => setResumeData(p => ({ ...p, professionalSummary: e.target.value }))}
              placeholder="e.g. Results-driven Software Engineer with 3+ years of experience architecting high-throughput microservices and responsive web applications. Proven track record in TypeScript, React, and cloud scalability..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 leading-relaxed font-sans"
            />
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
              <span>💡 Ideal length: 3–4 concise sentences highlighting years of experience, core tech stack, and key impact.</span>
              <span className="text-slate-500">{resumeData.professionalSummary?.length || 0} chars</span>
            </div>
          </Card>

          {/* Section 4: Categorized Skills & Smart Skill Recommender */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  Technical Skills & Competencies
                </h3>
                <span className="text-[11px] text-slate-400">Click suggested badges below or type comma-separated values to create interactive tags</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAiSuggestSkills}
                isLoading={isSuggestingSkills}
                className="text-xs text-brand-400 gap-1.5 self-start sm:self-auto border border-brand-500/30 hover:bg-brand-500/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                AI Suggest for "{resumeData.careerTarget.targetRole || 'Target Role'}"
              </Button>
            </div>

            {/* AI Skill Suggestions Banner (Shown when AI suggest is triggered) */}
            {aiSkillSuggestions && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-brand-950/70 via-slate-900/90 to-purple-950/70 border border-brand-500/30 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-500/20 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-300">
                    <Sparkles className="w-4 h-4 text-brand-400 shrink-0 animate-pulse" />
                    <span>AI Tailored Skills for "{resumeData.careerTarget.targetRole}":</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => {
                        const mergeUnique = (existing: string[] = [], incoming: string[] = []) => {
                          const set = new Set(existing.map(s => s.toLowerCase()));
                          const additions = incoming.filter(s => !set.has(s.toLowerCase()));
                          return [...existing, ...additions];
                        };
                        return {
                          ...prev,
                          softSkills: mergeUnique(prev.softSkills || [], aiSkillSuggestions.softSkills || []),
                          skills: {
                            ...prev.skills,
                            programmingLanguages: mergeUnique(prev.skills.programmingLanguages, aiSkillSuggestions.programmingLanguages || []),
                            frameworks: mergeUnique(prev.skills.frameworks.concat(prev.skills.libraries || []), aiSkillSuggestions.frameworks || []),
                            libraries: [],
                            databases: mergeUnique(prev.skills.databases.concat(prev.skills.cloud || []), aiSkillSuggestions.databases || []),
                            cloud: [],
                            tools: mergeUnique(prev.skills.tools.concat(prev.skills.otherTechnologies || []), aiSkillSuggestions.tools || []),
                            otherTechnologies: []
                          }
                        };
                      });
                      setSaveStatus(`✅ Added all AI skills for "${resumeData.careerTarget.targetRole}"`);
                      setTimeout(() => setSaveStatus(null), 3000);
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-brand-500/20 border border-brand-500/40 text-brand-300 hover:text-white hover:bg-brand-500/30 transition-colors font-medium self-start sm:self-auto"
                  >
                    + Add All AI Recommendations
                  </button>
                </div>

                <div className="space-y-2.5 pt-1 text-xs">
                  {/* AI Languages */}
                  {aiSkillSuggestions.programmingLanguages && aiSkillSuggestions.programmingLanguages.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-brand-300/80 block mb-1">Languages:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSkillSuggestions.programmingLanguages.map((skill, idx) => {
                          const isAdded = resumeData.skills.programmingLanguages.some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleSkill('programmingLanguages', skill)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-brand-400 hover:text-white'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-brand-400 font-bold">+</span>}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Frameworks */}
                  {aiSkillSuggestions.frameworks && aiSkillSuggestions.frameworks.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-300/80 block mb-1">Frameworks & Libraries:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSkillSuggestions.frameworks.map((skill, idx) => {
                          const isAdded = (resumeData.skills.frameworks || []).concat(resumeData.skills.libraries || []).some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleSkill('frameworks', skill)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-emerald-400 hover:text-white'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-emerald-400 font-bold">+</span>}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Databases */}
                  {aiSkillSuggestions.databases && aiSkillSuggestions.databases.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-cyan-300/80 block mb-1">Databases & Cloud:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSkillSuggestions.databases.map((skill, idx) => {
                          const isAdded = (resumeData.skills.databases || []).concat(resumeData.skills.cloud || []).some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleSkill('databases', skill)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-cyan-400 hover:text-white'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-cyan-400 font-bold">+</span>}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Tools */}
                  {aiSkillSuggestions.tools && aiSkillSuggestions.tools.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-amber-300/80 block mb-1">Tools & Infrastructure:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSkillSuggestions.tools.map((skill, idx) => {
                          const isAdded = (resumeData.skills.tools || []).concat(resumeData.skills.otherTechnologies || []).some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleSkill('tools', skill)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-amber-400 hover:text-white'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-amber-400 font-bold">+</span>}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Soft Skills */}
                  {aiSkillSuggestions.softSkills && aiSkillSuggestions.softSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-purple-300/80 block mb-1">Soft Skills & Competencies:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSkillSuggestions.softSkills.map((skill, idx) => {
                          const isAdded = (resumeData.softSkills || []).some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleSkill('softSkills', skill)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-medium'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-purple-400 hover:text-white'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3 text-purple-400" /> : <span className="text-purple-400 font-bold">+</span>}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Smart Technical & Soft Skill Recommender Panel */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Role-Based Skill Suggestions:</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddAllSkillsForRole(activeSkillCategoryTab)}
                  className="text-xs px-2.5 py-1 rounded bg-brand-500/20 border border-brand-500/40 text-brand-300 hover:text-white hover:bg-brand-500/30 transition-colors font-medium self-start sm:self-auto"
                >
                  + Add All {activeSkillCategoryTab} Skills
                </button>
              </div>

              {/* Role Preset Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {Object.keys(roleSkillsCatalog).map(roleKey => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setActiveSkillCategoryTab(roleKey)}
                    className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                      activeSkillCategoryTab === roleKey
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {roleKey}
                  </button>
                ))}
              </div>

              {/* Categorized Clickable Skill Badges */}
              <div className="space-y-3 pt-1">
                {/* Languages */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Languages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleSkillsCatalog[activeSkillCategoryTab]?.languages.map((skill, idx) => {
                      const isAdded = resumeData.skills.programmingLanguages.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleSkill('programmingLanguages', skill)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-brand-400 hover:text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-brand-400 font-bold">+</span>}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frameworks & Libraries */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Frameworks & Libraries:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleSkillsCatalog[activeSkillCategoryTab]?.frameworks.map((skill, idx) => {
                      const isAdded = (resumeData.skills.frameworks || []).concat(resumeData.skills.libraries || []).some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleSkill('frameworks', skill)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-brand-400 hover:text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-brand-400 font-bold">+</span>}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Databases & Cloud */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Databases & Cloud:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleSkillsCatalog[activeSkillCategoryTab]?.databases.map((skill, idx) => {
                      const isAdded = (resumeData.skills.databases || []).concat(resumeData.skills.cloud || []).some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleSkill('databases', skill)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-brand-400 hover:text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-brand-400 font-bold">+</span>}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tools & Methodologies */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Tools & Methodologies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleSkillsCatalog[activeSkillCategoryTab]?.tools.map((skill, idx) => {
                      const isAdded = (resumeData.skills.tools || []).concat(resumeData.skills.otherTechnologies || []).some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleSkill('tools', skill)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-brand-400 hover:text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-brand-400 font-bold">+</span>}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Soft Skills & Competencies */}
                <div>
                  <span className="text-[11px] font-semibold text-purple-300/90 block mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    Soft Skills & Professional Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleSkillsCatalog[activeSkillCategoryTab]?.softSkills.map((skill, idx) => {
                      const isAdded = (resumeData.softSkills || []).some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleSkill('softSkills', skill)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-medium'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-purple-400 hover:text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-purple-400" /> : <span className="text-purple-400 font-bold">+</span>}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Inputs for Direct Tag Editing with Comma Support */}
            <div className="space-y-4 pt-1">
              <SkillTagInput
                label="Programming Languages"
                icon={<Code2 className="w-3.5 h-3.5 text-brand-400" />}
                skills={resumeData.skills.programmingLanguages}
                onChange={newSkills => setResumeData(p => ({
                  ...p,
                  skills: { ...p.skills, programmingLanguages: newSkills }
                }))}
                placeholder="e.g. TypeScript, JavaScript, Python, Java, SQL, Go (press comma or Enter)..."
                suggestions={roleSkillsCatalog[activeSkillCategoryTab]?.languages || []}
                badgeVariant="brand"
              />

              <SkillTagInput
                label="Frameworks & Libraries"
                icon={<Layers className="w-3.5 h-3.5 text-emerald-400" />}
                skills={resumeData.skills.frameworks.concat(resumeData.skills.libraries || [])}
                onChange={newSkills => setResumeData(p => ({
                  ...p,
                  skills: { ...p.skills, frameworks: newSkills, libraries: [] }
                }))}
                placeholder="e.g. React, Node.js, Express, Next.js, Redux, Tailwind CSS (press comma or Enter)..."
                suggestions={roleSkillsCatalog[activeSkillCategoryTab]?.frameworks || []}
                badgeVariant="emerald"
              />

              <SkillTagInput
                label="Databases & Cloud Infrastructure"
                icon={<Database className="w-3.5 h-3.5 text-cyan-400" />}
                skills={resumeData.skills.databases.concat(resumeData.skills.cloud || [])}
                onChange={newSkills => setResumeData(p => ({
                  ...p,
                  skills: { ...p.skills, databases: newSkills, cloud: [] }
                }))}
                placeholder="e.g. PostgreSQL, MongoDB, Redis, AWS, Docker, Kubernetes (press comma or Enter)..."
                suggestions={roleSkillsCatalog[activeSkillCategoryTab]?.databases || []}
                badgeVariant="cyan"
              />

              <SkillTagInput
                label="Tools & Methodologies"
                icon={<Wrench className="w-3.5 h-3.5 text-amber-400" />}
                skills={resumeData.skills.tools.concat(resumeData.skills.otherTechnologies || [])}
                onChange={newSkills => setResumeData(p => ({
                  ...p,
                  skills: { ...p.skills, tools: newSkills, otherTechnologies: [] }
                }))}
                placeholder="e.g. Git, GitHub Actions, CI/CD, Postman, Linux, Agile (press comma or Enter)..."
                suggestions={roleSkillsCatalog[activeSkillCategoryTab]?.tools || []}
                badgeVariant="amber"
              />

              <SkillTagInput
                label="Soft Skills & Professional Competencies"
                icon={<Users className="w-3.5 h-3.5 text-purple-400" />}
                skills={resumeData.softSkills || []}
                onChange={newSkills => setResumeData(p => ({
                  ...p,
                  softSkills: newSkills
                }))}
                placeholder="e.g. System Architecture, Agile Leadership, Cross-Functional Collaboration (press comma or Enter)..."
                suggestions={roleSkillsCatalog[activeSkillCategoryTab]?.softSkills || []}
                badgeVariant="purple"
              />
            </div>
          </Card>

          {/* Section 5: Technical Projects & Suggestions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                Technical Projects
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setResumeData(p => ({
                  ...p,
                  projects: [
                    ...p.projects,
                    {
                      title: 'New Cloud Project',
                      description: 'Distributed microservices web platform.',
                      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
                      responsibilities: [
                        'Architected high-throughput REST APIs handling 10,000+ daily active user requests.',
                        'Optimized database queries and added caching, reducing latency by 30%.'
                      ]
                    }
                  ]
                }))}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </Button>
            </div>

            <div className="space-y-5">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="e.g. Real-Time Collaborative Whiteboard Platform"
                      value={proj.title}
                      onChange={e => {
                        const updated = [...resumeData.projects];
                        updated[idx].title = e.target.value;
                        setResumeData(p => ({ ...p, projects: updated }));
                      }}
                      className="font-bold text-sm bg-transparent text-white placeholder-slate-500 border-b border-slate-800 hover:border-slate-600 focus:border-brand-400 focus:outline-none w-3/4 pb-1"
                    />
                    <button
                      type="button"
                      onClick={() => setResumeData(p => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }))}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Project Description / Overview</label>
                    <input
                      type="text"
                      placeholder="e.g. High-concurrency collaboration engine with live state synchronization and analytics dashboard."
                      value={proj.description}
                      onChange={e => {
                        const updated = [...resumeData.projects];
                        updated[idx].description = e.target.value;
                        setResumeData(p => ({ ...p, projects: updated }));
                      }}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>

                  <div>
                    <SkillTagInput
                      label="Technologies Used"
                      skills={proj.technologies || []}
                      onChange={newTech => {
                        const updated = [...resumeData.projects];
                        updated[idx].technologies = newTech;
                        setResumeData(p => ({ ...p, projects: updated }));
                      }}
                      placeholder="e.g. React, TypeScript, PostgreSQL (press comma or Enter)..."
                      suggestions={[
                        ...(roleSkillsCatalog[activeSkillCategoryTab]?.languages || []),
                        ...(roleSkillsCatalog[activeSkillCategoryTab]?.frameworks || []),
                        ...(roleSkillsCatalog[activeSkillCategoryTab]?.databases || []),
                        ...(roleSkillsCatalog[activeSkillCategoryTab]?.tools || [])
                      ]}
                      badgeVariant="slate"
                    />
                  </div>

                  {/* Smart Bullet Suggestions for Project */}
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                      💡 Suggested Google X-Y-Z Metric Bullets (Click to append):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => addProjectBulletSuggestion(idx, 'metric')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white transition-colors"
                      >
                        + ⚡ Performance Metric (-38% latency)
                      </button>
                      <button
                        type="button"
                        onClick={() => addProjectBulletSuggestion(idx, 'scale')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white transition-colors"
                      >
                        + 📈 Scalability (15k+ daily requests)
                      </button>
                      <button
                        type="button"
                        onClick={() => addProjectBulletSuggestion(idx, 'security')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white transition-colors"
                      >
                        + 🔒 Security & RBAC Auth
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Bullet Point Responsibilities & Impact (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Architected modular REST backend with WebSockets handling 20k+ concurrent connections.&#10;Integrated Redis caching layer, decreasing database query latency by 35%.&#10;Automated CI/CD build pipelines with GitHub Actions and AWS ECS."
                      value={proj.responsibilities.join('\n')}
                      onChange={e => {
                        const updated = [...resumeData.projects];
                        updated[idx].responsibilities = e.target.value.split('\n').filter(Boolean);
                        setResumeData(p => ({ ...p, projects: updated }));
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 6: Work Experience & Suggestions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                Work Experience
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setResumeData(p => ({
                  ...p,
                  experience: [
                    ...p.experience,
                    {
                      company: 'Innovative Tech Corp',
                      role: 'Software Engineer',
                      location: 'San Francisco, CA',
                      startDate: 'Jan 2024',
                      endDate: 'Present',
                      current: true,
                      responsibilities: [
                        'Spearheaded full-stack feature development using React and Node.js microservices.',
                        'Enhanced CI/CD pipeline automation, reducing release turnaround times by 25%.'
                      ]
                    }
                  ]
                }))}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-5">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-5/6">
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Engineer"
                        value={exp.role}
                        onChange={e => {
                          const updated = [...resumeData.experience];
                          updated[idx].role = e.target.value;
                          setResumeData(p => ({ ...p, experience: updated }));
                        }}
                        className="font-bold text-sm bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                      <input
                        type="text"
                        placeholder="e.g. Google / Microsoft / TechNova Solutions"
                        value={exp.company}
                        onChange={e => {
                          const updated = [...resumeData.experience];
                          updated[idx].company = e.target.value;
                          setResumeData(p => ({ ...p, experience: updated }));
                        }}
                        className="text-sm bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeData(p => ({ ...p, experience: p.experience.filter((_, i) => i !== idx) }))}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. New York, NY (Hybrid)"
                        value={exp.location}
                        onChange={e => {
                          const updated = [...resumeData.experience];
                          updated[idx].location = e.target.value;
                          setResumeData(p => ({ ...p, experience: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Jun 2023"
                        value={exp.startDate}
                        onChange={e => {
                          const updated = [...resumeData.experience];
                          updated[idx].startDate = e.target.value;
                          setResumeData(p => ({ ...p, experience: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Present (or Aug 2024)"
                        value={exp.endDate}
                        onChange={e => {
                          const updated = [...resumeData.experience];
                          updated[idx].endDate = e.target.value;
                          setResumeData(p => ({ ...p, experience: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                  </div>

                  {/* Smart Bullet Suggestions for Work Experience */}
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                      💡 Suggested Achievement Bullets (Click to append):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => addExpBulletSuggestion(idx, 'kpi')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white transition-colors"
                      >
                        + 🚀 Performance & Caching (+40% speed)
                      </button>
                      <button
                        type="button"
                        onClick={() => addExpBulletSuggestion(idx, 'refactor')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white transition-colors"
                      >
                        + 🧪 Test Coverage & Refactor (94% coverage)
                      </button>
                      <button
                        type="button"
                        onClick={() => addExpBulletSuggestion(idx, 'collab')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white transition-colors"
                      >
                        + 👥 Agile Sprints & Bi-Weekly Releases
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Key Accomplishments & Responsibilities (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Led design of customer-facing dashboard features used by 50k+ daily users.&#10;Refactored core services into TypeScript, increasing code maintainability and test coverage.&#10;Partnered with DevOps to reduce AWS cloud infrastructure expenses by 22%."
                      value={exp.responsibilities.join('\n')}
                      onChange={e => {
                        const updated = [...resumeData.experience];
                        updated[idx].responsibilities = e.target.value.split('\n').filter(Boolean);
                        setResumeData(p => ({ ...p, experience: updated }));
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 7: Education */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                Education Details
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setResumeData(p => ({
                  ...p,
                  education: [
                    ...p.education,
                    {
                      degree: 'B.S. in Computer Science',
                      institution: 'University Name',
                      university: 'University',
                      startYear: '2020',
                      endYear: '2024',
                      cgpaOrPercentage: '3.8 GPA'
                    }
                  ]
                }))}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </Button>
            </div>

            <div className="space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-5/6">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">Degree / Major *</label>
                        <input
                          type="text"
                          placeholder="e.g. B.S. in Computer Science"
                          value={edu.degree}
                          onChange={e => {
                            const updated = [...resumeData.education];
                            updated[idx].degree = e.target.value;
                            setResumeData(p => ({ ...p, education: updated }));
                          }}
                          className="w-full font-semibold text-xs bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">College / University *</label>
                        <input
                          type="text"
                          placeholder="e.g. University of California, Berkeley"
                          value={edu.institution}
                          onChange={e => {
                            const updated = [...resumeData.education];
                            updated[idx].institution = e.target.value;
                            setResumeData(p => ({ ...p, education: updated }));
                          }}
                          className="w-full text-xs bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeData(p => ({ ...p, education: p.education.filter((_, i) => i !== idx) }))}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove Education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Start Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2020"
                        value={edu.startYear}
                        onChange={e => {
                          const updated = [...resumeData.education];
                          updated[idx].startYear = e.target.value;
                          setResumeData(p => ({ ...p, education: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">End / Graduation Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2024"
                        value={edu.endYear}
                        onChange={e => {
                          const updated = [...resumeData.education];
                          updated[idx].endYear = e.target.value;
                          setResumeData(p => ({ ...p, education: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">CGPA or Percentage</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.8 / 4.0 GPA or 85%"
                        value={edu.cgpaOrPercentage}
                        onChange={e => {
                          const updated = [...resumeData.education];
                          updated[idx].cgpaOrPercentage = e.target.value;
                          setResumeData(p => ({ ...p, education: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 8: Certifications & Achievements */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              Certifications & Honors
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-300">Certifications</label>
                  <button
                    type="button"
                    onClick={() => setResumeData(p => ({
                      ...p,
                      certifications: [
                        ...p.certifications,
                        { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', issueDate: '2025' }
                      ]
                    }))}
                    className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Certificate
                  </button>
                </div>
                {resumeData.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. AWS Certified Solutions Architect"
                      value={cert.name}
                      onChange={e => {
                        const updated = [...resumeData.certifications];
                        updated[idx].name = e.target.value;
                        setResumeData(p => ({ ...p, certifications: updated }));
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Amazon Web Services"
                      value={cert.issuer}
                      onChange={e => {
                        const updated = [...resumeData.certifications];
                        updated[idx].issuer = e.target.value;
                        setResumeData(p => ({ ...p, certifications: updated }));
                      }}
                      className="w-1/3 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={cert.issueDate}
                      onChange={e => {
                        const updated = [...resumeData.certifications];
                        updated[idx].issueDate = e.target.value;
                        setResumeData(p => ({ ...p, certifications: updated }));
                      }}
                      className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                    <button
                      type="button"
                      onClick={() => setResumeData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }))}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-300">Key Achievements / Honors</label>
                  <button
                    type="button"
                    onClick={() => setResumeData(p => ({
                      ...p,
                      achievements: [
                        ...p.achievements,
                        { title: '1st Place Hackathon Winner', description: 'Built an open-source real-time developer tool.' }
                      ]
                    }))}
                    className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Achievement
                  </button>
                </div>
                {resumeData.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. 1st Place Winner — Global AI Hackathon 2024"
                      value={ach.title}
                      onChange={e => {
                        const updated = [...resumeData.achievements];
                        updated[idx].title = e.target.value;
                        setResumeData(p => ({ ...p, achievements: updated }));
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Architected an offline-first disaster coordination app in 36 hrs"
                      value={ach.description}
                      onChange={e => {
                        const updated = [...resumeData.achievements];
                        updated[idx].description = e.target.value;
                        setResumeData(p => ({ ...p, achievements: updated }));
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                    <button
                      type="button"
                      onClick={() => setResumeData(p => ({ ...p, achievements: p.achievements.filter((_, i) => i !== idx) }))}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column: Live ATS Compatibility & Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ATS Compatibility Meter */}
          {atsScoreData && (
            <Card className="p-6 border-brand-500/30 bg-slate-900/90 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  ATS Compatibility Meter
                </h3>
                <span className="text-2xl font-black text-brand-400 font-mono">
                  {atsScoreData.overallScore}<span className="text-sm text-slate-500">/100</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mb-4 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 via-sky-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${atsScoreData.overallScore}%` }}
                />
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Section Completeness</span>
                  <span className="font-semibold text-white">{atsScoreData.scoreBreakdown.sectionCompleteness}/25</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Keyword Relevance</span>
                  <span className="font-semibold text-white">{atsScoreData.scoreBreakdown.keywordRelevance}/25</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Skills Depth</span>
                  <span className="font-semibold text-white">{atsScoreData.scoreBreakdown.skillsMatch}/25</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Structure & Format</span>
                  <span className="font-semibold text-white">{atsScoreData.scoreBreakdown.structureAndHeadings + atsScoreData.scoreBreakdown.formattingAndImpact}/25</span>
                </div>
              </div>

              {/* Matched / Missing Keywords */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-semibold text-slate-300">Detected High-Impact Keywords:</div>
                <div className="flex flex-wrap gap-1.5">
                  {atsScoreData.matchedKeywords.slice(0, 8).map((kw, i) => (
                    <Badge key={i} variant="success" size="sm">✓ {kw}</Badge>
                  ))}
                  {atsScoreData.missingKeywords.slice(0, 4).map((kw, i) => (
                    <Badge key={i} variant="danger" size="sm">+ {kw}</Badge>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic border-t border-slate-800/80 pt-3">
                {atsScoreData.disclaimer}
              </p>
            </Card>
          )}

          {/* Live Single-Column ATS Resume Preview Container */}
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-400" />
                Live Single-Column ATS Preview ({resumeData.templateId})
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Parsable Layout</span>
            </div>

            <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl border border-slate-300 font-sans text-xs leading-relaxed max-h-[700px] overflow-y-auto">
              
              {/* Header */}
              <div className="text-center pb-4 border-b border-slate-300">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                  {resumeData.personalInfo.fullName || 'Candidate Name'}
                </h2>
                <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap justify-center gap-2">
                  <span>{resumeData.personalInfo.email}</span>
                  <span>•</span>
                  <span>{resumeData.personalInfo.phone}</span>
                  <span>•</span>
                  <span>{resumeData.personalInfo.location}</span>
                </div>
                {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
                  <div className="text-[10px] text-slate-500 mt-0.5 flex justify-center gap-2">
                    {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                    {resumeData.personalInfo.github && <span>• {resumeData.personalInfo.github}</span>}
                  </div>
                )}
              </div>

              {/* Summary */}
              {resumeData.professionalSummary && (
                <div className="mt-4">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                    Professional Summary
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-normal">
                    {resumeData.professionalSummary}
                  </p>
                </div>
              )}

              {/* Technical Skills */}
              <div className="mt-4">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Technical Skills
                </h4>
                <div className="space-y-1 text-[11px] text-slate-700">
                  {resumeData.skills.programmingLanguages.length > 0 && (
                    <p><strong className="text-slate-900">Languages:</strong> {resumeData.skills.programmingLanguages.join(', ')}</p>
                  )}
                  {resumeData.skills.frameworks.concat(resumeData.skills.libraries || []).length > 0 && (
                    <p><strong className="text-slate-900">Frameworks & Libraries:</strong> {resumeData.skills.frameworks.concat(resumeData.skills.libraries || []).join(', ')}</p>
                  )}
                  {resumeData.skills.databases.concat(resumeData.skills.cloud || []).length > 0 && (
                    <p><strong className="text-slate-900">Databases & Cloud:</strong> {resumeData.skills.databases.concat(resumeData.skills.cloud || []).join(', ')}</p>
                  )}
                  {resumeData.skills.tools.concat(resumeData.skills.otherTechnologies || []).length > 0 && (
                    <p><strong className="text-slate-900">Tools & Methodologies:</strong> {resumeData.skills.tools.concat(resumeData.skills.otherTechnologies || []).join(', ')}</p>
                  )}
                  {resumeData.softSkills && resumeData.softSkills.length > 0 && (
                    <p><strong className="text-slate-900">Soft Skills & Competencies:</strong> {resumeData.softSkills.join(', ')}</p>
                  )}
                </div>
              </div>

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                    Technical Projects
                  </h4>
                  <div className="space-y-2.5">
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="text-[11px]">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{proj.title}</span>
                          <span className="font-normal italic text-slate-600">{proj.technologies.join(', ')}</span>
                        </div>
                        {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}
                        <ul className="list-disc list-inside text-slate-700 mt-0.5 space-y-0.5">
                          {proj.responsibilities.map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                    Work Experience
                  </h4>
                  <div className="space-y-2">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="text-[11px]">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.role} — {exp.company}</span>
                          <span className="font-normal text-slate-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <ul className="list-disc list-inside text-slate-700 mt-0.5 space-y-0.5">
                          {exp.responsibilities.map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                    Education
                  </h4>
                  <div className="space-y-1 text-[11px]">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between">
                        <div>
                          <strong className="text-slate-900">{edu.degree}</strong>, {edu.institution}
                          {edu.cgpaOrPercentage && <span className="text-slate-600"> (CGPA: {edu.cgpaOrPercentage})</span>}
                        </div>
                        <span className="text-slate-600">{edu.endYear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
