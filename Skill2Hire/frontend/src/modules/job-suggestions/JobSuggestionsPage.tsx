import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, getErrorMessage } from '../../services/api';
import { IJob } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  Briefcase, 
  Search, 
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2, 
  ArrowRight,
  Filter,
  Lightbulb,
  Check
} from 'lucide-react';

const popularRoleSuggestions = [
  { role: 'Full Stack Developer', skills: 'React, TypeScript, Node.js, Express, MongoDB Atlas, AWS' },
  { role: 'Frontend React Engineer', skills: 'React, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, Jest' },
  { role: 'Backend Cloud Engineer', skills: 'Node.js, Python, PostgreSQL, Redis, Docker, AWS, Microservices' },
  { role: 'DevOps / SRE', skills: 'Kubernetes, Docker, AWS, Terraform, CI/CD, Linux, Prometheus' }
];

const popularLocationPresets = [
  'Pune, India',
  'Hyderabad, India',
  'Bengaluru, India',
  'Mumbai, India',
  'Delhi NCR, India',
  'Chennai, India',
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Remote'
];

export const JobSuggestionsPage: React.FC = () => {
  const { isAuthenticated, openAuthModal, getGuestDraft, saveGuestDraft } = useAuth();
  const navigate = useNavigate();

  // Search filter state
  const [role, setRole] = useState('Full Stack Developer');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('Any');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Express, MongoDB, Git');

  const [isLoading, setIsLoading] = useState(false);
  const [bestFitJob, setBestFitJob] = useState<IJob | null>(null);
  const [goodMatches, setGoodMatches] = useState<IJob[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  // Quick Action: Apply role suggestion
  const handleApplyRoleSuggestion = (item: typeof popularRoleSuggestions[0]) => {
    setRole(item.role);
    setSkills(item.skills);
  };

  // Progressive Registration Trigger: Search Jobs
  const handleSearchJobs = async () => {
    if (!isAuthenticated) {
      saveGuestDraft('job_search_filters', { role, location, workMode, experienceLevel, skills });
      openAuthModal('Sign up to search live jobs and view personalized match scores.', handleSearchJobs);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/jobs/search', {
        role,
        location,
        workMode,
        experienceLevel,
        skills: parsedSkills
      });

      if (res.data?.success && res.data?.data) {
        setBestFitJob(res.data.data.bestFit);
        setGoodMatches(res.data.data.goodMatches || []);
        setMessage(`Found personalized career opportunities ranked by Skill2Hire Compatibility.`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Bookmark Job
  const handleBookmarkJob = async (job: IJob) => {
    if (!isAuthenticated) {
      openAuthModal('Log in to bookmark career options to your dashboard.', () => handleBookmarkJob(job));
      return;
    }

    try {
      const res = await api.post('/jobs/save', {
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        workMode: job.workMode,
        salary: job.salary,
        description: job.description,
        source: job.source,
        applicationUrl: job.applicationUrl,
        skills: job.skills,
        matchPercentage: job.matchPercentage,
        matchingSkills: job.matchingSkills,
        missingSkills: job.missingSkills,
        matchReason: job.matchReason
      });

      if (res.data?.success) {
        setSavedJobIds(prev => new Set(prev).add(job.id));
        setMessage(`✅ Bookmarked "${job.title}" to your dashboard.`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage(`❌ Failed to bookmark: ${getErrorMessage(error)}`);
    }
  };

  // Shortcut to Mock Interview
  const handlePracticeInterview = (targetRoleName: string) => {
    saveGuestDraft('interview_target_role', targetRoleName);
    navigate('/interview');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">Opportunity Radar</Badge>
            <Badge variant="success" size="sm">Live Curated Feeds</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Career Options
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Normalized live tech job feeds ranked with Skill2Hire Compatibility Score and direct application links.
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-brand-500/30 text-xs text-brand-300 flex items-center justify-between animate-fadeIn">
          <span>{message}</span>
        </div>
      )}

      {/* Filter Configuration Card */}
      <Card className="mt-8 p-6 bg-slate-900/90 border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            Configure Career Preferences & Candidate Skills
          </h3>
          <span className="text-[11px] text-brand-400 font-medium">Algorithmic Match Scoring</span>
        </div>

        {/* Quick Role & Location Suggestion Chips */}
        <div className="mb-4 space-y-2">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Role Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularRoleSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyRoleSuggestion(item)}
                  className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-brand-400 text-slate-300 hover:text-white transition-colors"
                >
                  + {item.role}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Location Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularLocationPresets.map((locPreset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLocation(locPreset)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    location === locPreset
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                      : 'bg-slate-900 border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white'
                  }`}
                >
                  📍 {locPreset}
                </button>
              ))}
              {location && (
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300"
                >
                  Clear location
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Role *</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer / React Lead"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA / Remote / Bengaluru"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Work Mode</label>
            <select
              value={workMode}
              onChange={e => setWorkMode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-400"
            >
              <option value="Any">Any Work Mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={e => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-400"
            >
              <option value="Fresher">Entry Level / Fresher (0 Years)</option>
              <option value="1-3 Years">Mid-Level (1 - 3 Years)</option>
              <option value="3-5 Years">Senior Level (3 - 5+ Years)</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-300 mb-1">Candidate Skills (Comma Separated) *</label>
          <input
            type="text"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="e.g. TypeScript, React, Node.js, Express, MongoDB Atlas, Redis, AWS, Docker"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleSearchJobs}
            isLoading={isLoading}
            className="gap-2 font-bold shadow-lg shadow-brand-500/25 px-6"
          >
            <Search className="w-4 h-4" />
            Discover Matching Opportunities
          </Button>
        </div>
      </Card>

      {/* Results Display */}
      {(bestFitJob || goodMatches.length > 0) && (
        <div className="mt-10 space-y-8">
          
          {/* Best Fit Job Highlight Card */}
          {bestFitJob && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Top Algorithmic Match
                </span>
                <span className="text-xs text-slate-500">• Highest Skill2Hire Compatibility</span>
              </div>

              <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/40 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="success" size="md" className="font-bold font-mono">
                        {bestFitJob.matchPercentage}% Compatibility Match
                      </Badge>
                      <Badge variant="primary" size="sm">{bestFitJob.workMode}</Badge>
                      <Badge variant="neutral" size="sm">{bestFitJob.source}</Badge>
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight">
                      {bestFitJob.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <strong className="text-white">{bestFitJob.company}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {bestFitJob.location}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {bestFitJob.salary}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl pt-2">
                      {bestFitJob.description}
                    </p>

                    {/* Matching / Missing Skills */}
                    <div className="pt-3 flex flex-wrap gap-4">
                      {bestFitJob.matchingSkills && bestFitJob.matchingSkills.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Matched Profile Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bestFitJob.matchingSkills.map((s, i) => (
                              <Badge key={i} variant="success" size="sm">✓ {s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {bestFitJob.missingSkills && bestFitJob.missingSkills.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Skill Recommendations:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bestFitJob.missingSkills.map((s, i) => (
                              <Badge key={i} variant="warning" size="sm">+ {s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Best Fit */}
                  <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-48">
                    <a
                      href={bestFitJob.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="primary" size="md" className="w-full justify-center gap-1.5 font-bold shadow-lg shadow-brand-500/20">
                        Apply on Employer Site
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleBookmarkJob(bestFitJob)}
                      className={`w-full justify-center gap-1.5 ${
                        savedJobIds.has(bestFitJob.id) ? 'border-emerald-500 text-emerald-400' : ''
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {savedJobIds.has(bestFitJob.id) ? 'Saved to Dashboard' : 'Save Opportunity'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePracticeInterview(bestFitJob.title)}
                      className="w-full justify-center text-xs text-brand-400 hover:bg-brand-500/10 border border-brand-500/30"
                    >
                      Practice AI Interview ➔
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 5 Good Matching Opportunities */}
          {goodMatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Additional Verified Opportunities ({goodMatches.length})
                </h3>
                <span className="text-xs text-slate-500">Ranked by Compatibility</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {goodMatches.map((job) => (
                  <Card key={job.id} hoverEffect className="p-6 bg-slate-900/90 border-slate-800 flex flex-col justify-between shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="primary" size="sm">
                          {job.matchPercentage}% Match
                        </Badge>
                        <span className="text-[11px] text-slate-400">{job.workMode}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-white tracking-tight line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-xs text-slate-300 font-medium">{job.company}</p>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {job.location}
                        </span>
                        <span className="text-emerald-400 font-medium">{job.salary}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {job.matchingSkills && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.matchingSkills.slice(0, 4).map((s, idx) => (
                            <Badge key={idx} variant="neutral" size="sm">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleBookmarkJob(job)}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          savedJobIds.has(job.id)
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        title="Bookmark Job"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="primary" size="sm" className="w-full text-xs justify-center gap-1 font-semibold">
                          Apply Now <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
