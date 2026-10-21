import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, getErrorMessage } from '../../services/api';
import { IResumeData, ITailoredResume } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  Sparkles, 
  Upload, 
  Save, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  FileSpreadsheet,
  RefreshCw,
  Lightbulb,
  Check
} from 'lucide-react';

const sampleJDOptions = [
  {
    role: 'Senior Full Stack Engineer',
    skills: 'React, TypeScript, Node.js, Express, MongoDB Atlas, Redis, AWS',
    jd: `We are looking for a Senior Full Stack Engineer proficient in React, TypeScript, and Node.js microservices. You will architect high-performance distributed web applications, collaborate with cross-functional product teams, implement robust REST and WebSocket APIs, optimize database queries on MongoDB/PostgreSQL, and lead CI/CD automation on AWS cloud infrastructure. Experience with state management, unit testing, and sub-second web performance optimization is essential.`
  },
  {
    role: 'Lead Frontend Developer',
    skills: 'React, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, Webpack/Vite',
    jd: `Seeking a Lead Frontend Engineer to spearhead our modern client-side architecture. Responsibilities include building scalable design systems in React and TypeScript, optimizing Core Web Vitals, collaborating with UX designers, and integrating secure RESTful APIs. Must have demonstrated expertise in state management, responsive accessibility, and automated frontend testing.`
  }
];

export const ResumeTailorPage: React.FC = () => {
  const { isAuthenticated, openAuthModal, getGuestDraft, saveGuestDraft } = useAuth();
  const navigate = useNavigate();

  // Check if a draft was imported from Resume Builder
  const importedResume = getGuestDraft('tailor_imported_resume', null);
  const activeResumeDraft = getGuestDraft('resume_draft', null);

  const [sourceResume, setSourceResume] = useState<IResumeData>(
    importedResume || activeResumeDraft || {
      title: 'My Base Resume',
      templateId: 'ats-modern',
      personalInfo: { fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+1 555 234 5678', location: 'San Francisco, CA' },
      careerTarget: { targetRole: 'Full Stack Developer', specialization: 'React / Node.js' },
      education: [],
      skills: { programmingLanguages: ['JavaScript', 'TypeScript', 'Python'], frameworks: ['React', 'Node.js', 'Express'], libraries: ['Tailwind CSS'], databases: ['MongoDB', 'PostgreSQL'], tools: ['Git', 'Docker'], cloud: ['AWS'], otherTechnologies: ['REST APIs'] },
      projects: [{ title: 'Full Stack Web Platform', description: 'Engineered web services with React and Node.js.', technologies: ['React', 'Node.js'], responsibilities: ['Built core features and APIs.'] }],
      experience: [{ company: 'Tech Corp', role: 'Software Engineer', location: 'San Francisco, CA', startDate: '2024', endDate: 'Present', current: true, responsibilities: ['Developed REST APIs and web interfaces.'] }],
      certifications: [],
      achievements: [],
      softSkills: [],
      languages: [],
      professionalSummary: 'Full Stack Software Engineer with expertise in building web applications with React and Node.js.'
    }
  );

  const [targetRole, setTargetRole] = useState('Senior Full Stack Developer');
  const [jobRequirements, setJobRequirements] = useState('React, TypeScript, Node.js, Express, MongoDB Atlas, Redis, AWS');
  const [jobDescription, setJobDescription] = useState(sampleJDOptions[0].jd);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<ITailoredResume | null>(() => getGuestDraft('tailor_result', null));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Progressive Registration: Keep draft in localStorage
  useEffect(() => {
    saveGuestDraft('tailor_state', { targetRole, jobRequirements, jobDescription });
  }, [targetRole, jobRequirements, jobDescription]);

  // Quick Action: Apply Sample JD
  const handleApplySampleJD = (sample: typeof sampleJDOptions[0]) => {
    setTargetRole(sample.role);
    setJobRequirements(sample.skills);
    setJobDescription(sample.jd);
  };

  // Upload existing PDF / DOCX
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setIsUploading(true);
    setSaveStatus('Parsing uploaded resume in-memory...');

    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      const res = await api.post('/tailor-resume/upload-parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data?.data) {
        setSourceResume(res.data.data);
        setSaveStatus(`✅ Successfully parsed ${file.name} (${res.data.data.personalInfo?.fullName || 'Candidate Profile'})`);
        setTimeout(() => setSaveStatus(null), 3500);
      }
    } catch (error: any) {
      setSaveStatus(`❌ Failed to parse file: ${getErrorMessage(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Run AI Tailoring
  const handleRunTailoring = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a Job Description first.');
      return;
    }

    setIsTailoring(true);
    setSaveStatus('Aligning resume with Job Description (Zero Fake Skills Enforcement)...');

    try {
      const payload = {
        sourceResumeData: sourceResume,
        originalResume: sourceResume,
        targetRole,
        jobDescription,
        jobRequirements: jobRequirements.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await api.post('/tailor-resume/analyze', payload);
      if (res.data?.success && res.data?.data) {
        const tailoredRes = res.data.data;
        if (!tailoredRes.tailoredResumeData && tailoredRes.tailoredData) {
          tailoredRes.tailoredResumeData = tailoredRes.tailoredData;
        }
        setTailorResult(tailoredRes);
        saveGuestDraft('tailor_result', tailoredRes);
        setSaveStatus('✅ Resume tailored successfully! Review score increase, keywords, and skill gaps below.');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (error: any) {
      setSaveStatus(`❌ Tailoring error: ${getErrorMessage(error)}`);
    } finally {
      setIsTailoring(false);
    }
  };

  // Action: Save Tailored Resume to Cloud
  const handleSaveToCloud = async () => {
    if (!isAuthenticated) {
      openAuthModal('Create an account to save your tailored resume and track job applications.', handleSaveToCloud);
      return;
    }

    if (!tailorResult) {
      alert('Please tailor your resume first before saving.');
      return;
    }

    try {
      setSaveStatus('Saving tailored resume to cloud...');
      const recordPayload = {
        targetRole,
        jobDescription,
        jobRequirements,
        originalResumeText: sourceResume.professionalSummary,
        tailoredData: tailorResult.tailoredResumeData || (tailorResult as any).tailoredData,
        matchScoreBefore: tailorResult.matchScoreBefore,
        matchScoreAfter: tailorResult.matchScoreAfter,
        matchedKeywords: tailorResult.matchedKeywords,
        missingKeywords: tailorResult.missingKeywords,
        skillGaps: tailorResult.skillGaps,
        changesSummary: tailorResult.changesSummary
      };
      const res = await api.post('/tailor-resume', recordPayload);
      if (res.data?.success) {
        setSaveStatus('✅ Tailored resume saved to your account!');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (error: any) {
      setSaveStatus(`❌ Error: ${getErrorMessage(error)}`);
    }
  };

  // Action: Download Tailored PDF
  const handleDownloadPDF = async () => {
    if (!isAuthenticated) {
      openAuthModal('Create a free account to download your tailored ATS resume.', handleDownloadPDF);
      return;
    }

    if (!tailorResult) {
      alert('Please tailor your resume first before downloading.');
      return;
    }

    try {
      setSaveStatus('Generating tailored ATS PDF...');
      const resumeToExport = tailorResult.tailoredResumeData || (tailorResult as any).tailoredData || sourceResume;
      const res = await api.post('/tailor-resume/export-pdf', resumeToExport, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tailored_Resume_${targetRole.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSaveStatus(null);
    } catch (error: any) {
      setSaveStatus('Failed to download PDF.');
    }
  };

  // Action: Download Tailored DOCX
  const handleDownloadDOCX = async () => {
    if (!isAuthenticated) {
      openAuthModal('Create a free account to download your tailored DOCX resume.', handleDownloadDOCX);
      return;
    }

    if (!tailorResult) {
      alert('Please tailor your resume first before downloading.');
      return;
    }

    try {
      setSaveStatus('Generating tailored ATS DOCX...');
      const resumeToExport = tailorResult.tailoredResumeData || (tailorResult as any).tailoredData || sourceResume;
      const res = await api.post('/tailor-resume/export-docx', resumeToExport, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tailored_Resume_${targetRole.replace(/\s+/g, '_')}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSaveStatus(null);
    } catch (error: any) {
      setSaveStatus('Failed to download DOCX.');
    }
  };

  // Action: Send tailored data to resume builder
  const handleEditInBuilder = () => {
    const tailoredData = tailorResult?.tailoredResumeData || (tailorResult as any)?.tailoredData;
    if (tailoredData) {
      saveGuestDraft('resume_draft', tailoredData);
      saveGuestDraft('tailor_imported_resume', tailoredData);
      navigate('/builder');
    }
  };

  // Shortcut to Career Options
  const handleFindMatchingJobs = () => {
    saveGuestDraft('tailor_target_role', targetRole);
    navigate('/jobs');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">Tailoring Engine</Badge>
            <Badge variant="success" size="sm">Zero Fake Skills Guaranteed</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume tailoring
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Align your authentic experience with target Job Descriptions without hallucinating fake skills or invalid experience.
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

          <Button variant="ghost" size="sm" onClick={handleFindMatchingJobs} className="text-brand-400 border border-brand-500/30 hover:bg-brand-500/10">
            Find Matching Jobs
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {saveStatus && (
        <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-brand-500/30 text-xs text-brand-300 flex items-center justify-between animate-fadeIn">
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Grid: Inputs (Left 6 cols) vs Tailored Output & Gaps (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Target JD & Source Resume Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Target Role & JD Input */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                Target Job Criteria
              </h3>
              <span className="text-[11px] text-brand-400 font-medium">Auto-Keyword Alignment</span>
            </div>

            {/* Quick Sample JD Suggestions */}
            <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Try a Sample Job Description:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleJDOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplySampleJD(opt)}
                    className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-brand-400 text-slate-300 hover:text-white transition-colors"
                  >
                    + {opt.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Role *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Engineer / React Lead"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Required Skills / Keywords (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js, Express, MongoDB Atlas, Redis, AWS, Docker"
                  value={jobRequirements}
                  onChange={e => setJobRequirements(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Paste Job Description *</label>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting description here (roles, responsibilities, qualifications, tech stack)..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 leading-relaxed font-sans"
                />
              </div>
            </div>
          </Card>

          {/* Source Resume Input: File Upload or Builder Resume */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              Source Candidate Profile
            </h3>

            {/* File Upload Dropzone */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-700/80 bg-slate-950/60 hover:border-brand-500/50 transition-colors text-center">
              <Upload className="w-8 h-8 text-brand-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium mb-1">
                Upload Existing Resume (PDF / DOCX)
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                Max 5MB • Safely parsed in-memory without storing temporary disk files
              </p>
              <label className="inline-flex">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer border border-slate-700 shadow-sm">
                  {isUploading ? 'Parsing Resume...' : uploadFile ? uploadFile.name : 'Choose File to Upload'}
                </span>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Active candidate profile:</span>
              <Badge variant="primary" size="sm">{sourceResume.personalInfo?.fullName || 'Candidate'} ({sourceResume.title || 'Resume Profile'})</Badge>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleRunTailoring}
              isLoading={isTailoring}
              className="w-full mt-6 text-sm font-bold shadow-xl shadow-brand-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Analyze & Generate Tailored Resume
            </Button>
          </Card>

        </div>

        {/* Right Column: Tailoring Diff, Skill Gaps & Output Preview */}
        <div className="lg:col-span-6 space-y-6">
          
          {tailorResult ? (
            (() => {
              const activeTailored = tailorResult.tailoredResumeData || (tailorResult as any).tailoredData || sourceResume;
              return (
                <>
                  {/* Before vs After ATS Score Comparison */}
                  <Card className="p-6 bg-slate-900/90 border-brand-500/40 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        ATS Compatibility Comparison
                      </h3>
                      <Badge variant="success" size="sm">
                        +{tailorResult.matchScoreAfter - tailorResult.matchScoreBefore}% Match Lift
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">Original Match</span>
                        <span className="text-2xl font-extrabold text-slate-300 font-mono">
                          {tailorResult.matchScoreBefore}%
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
                        <span className="text-xs text-emerald-400 block mb-1">Tailored Match</span>
                        <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                          {tailorResult.matchScoreAfter}%
                        </span>
                      </div>
                    </div>

                    {/* Matched Keywords */}
                    {tailorResult.matchedKeywords && tailorResult.matchedKeywords.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <span className="text-xs font-semibold text-emerald-400 block mb-2">
                          ✓ Aligned Target Keywords ({tailorResult.matchedKeywords.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tailorResult.matchedKeywords.map((kw, i) => (
                            <Badge key={i} variant="success" size="sm">✓ {kw}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Major Changes Made */}
                    {tailorResult.changesSummary && tailorResult.changesSummary.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                        <span className="text-xs font-semibold text-slate-300 block">Key Optimizations Applied:</span>
                        <ul className="text-xs text-slate-400 space-y-1">
                          {tailorResult.changesSummary.map((change: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>

                  {/* Zero Fake Skills: Dedicated Skill Gaps Panel */}
                  <Card className="p-6 border-amber-500/30 bg-slate-900/90">
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        Zero Fake Skills — Identified Skill Gaps
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">
                      The following requirements from the JD were not found in your authentic profile. To preserve strict candidate integrity, Skill2Hire does <strong>not</strong> fabricate false credentials:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tailorResult.skillGaps && tailorResult.skillGaps.length > 0 ? (
                        tailorResult.skillGaps.map((gap: string, i: number) => (
                          <Badge key={i} variant="warning" size="md">
                            ⚠️ Missing: {gap}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-400 font-medium">✓ Excellent match — No critical skill gaps detected.</span>
                      )}
                    </div>
                  </Card>

                  {/* Tailored Professional Summary Preview */}
                  <Card className="p-6 bg-slate-900/90 border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Tailored Professional Summary
                      </h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activeTailored.professionalSummary || '');
                          alert('Summary copied to clipboard!');
                        }}
                        className="text-xs text-brand-400 hover:text-white"
                      >
                        Copy text
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800 leading-relaxed font-sans">
                      {activeTailored.professionalSummary}
                    </p>
                  </Card>

                  {/* Tailored Projects / Experience Highlights */}
                  {activeTailored.projects && activeTailored.projects.length > 0 && (
                    <Card className="p-6 bg-slate-900/90 border-slate-800">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                        Aligned Project Responsibilities
                      </h4>
                      <div className="space-y-3">
                        {activeTailored.projects.slice(0, 2).map((proj, pIdx) => (
                          <div key={pIdx} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-white">{proj.title}</span>
                              <div className="flex flex-wrap gap-1">
                                {proj.technologies?.slice(0, 3).map((t, ti) => (
                                  <Badge key={ti} variant="neutral" size="sm">{t}</Badge>
                                ))}
                              </div>
                            </div>
                            <ul className="text-[11px] text-slate-300 space-y-1">
                              {proj.responsibilities?.map((r, ri) => (
                                <li key={ri} className="flex items-start gap-1">
                                  <span className="text-brand-400">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Quick Action to open in Builder */}
                  <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Import to Resume Builder?</h5>
                      <p className="text-[11px] text-slate-400">Continue editing formatting, fonts, or sections in full builder mode.</p>
                    </div>
                    <Button variant="primary" size="sm" onClick={handleEditInBuilder} className="gap-1 text-xs">
                      Open in Builder <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
              <h4 className="font-bold text-white text-base">Awaiting Tailoring Input</h4>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Paste a target Job Description and click "Analyze & Generate Tailored Resume" to view side-by-side ATS match metrics, skill gaps, and optimized bullet points.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
