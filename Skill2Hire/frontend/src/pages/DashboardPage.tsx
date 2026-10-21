import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Briefcase, 
  Video, 
  Newspaper, 
  User, 
  Calendar, 
  Download, 
  ExternalLink, 
  Award,
  ArrowRight,
  RefreshCw,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'resumes' | 'tailored' | 'jobs' | 'interviews'>('resumes');
  const [resumes, setResumes] = useState<any[]>([]);
  const [tailoredResumes, setTailoredResumes] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [interviewReports, setInterviewReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // If not logged in, prompt user
  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('Sign in to access your Skill2Hire user dashboard.');
    } else {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const [resRes, tailRes, jobRes, intRes] = await Promise.allSettled([
        api.get('/resumes'),
        api.get('/tailor-resume'),
        api.get('/jobs/saved'),
        api.get('/interviews/reports')
      ]);

      if (resRes.status === 'fulfilled' && resRes.value.data?.success) {
        setResumes(resRes.value.data.data || []);
      }
      if (tailRes.status === 'fulfilled' && tailRes.value.data?.success) {
        setTailoredResumes(tailRes.value.data.data || []);
      }
      if (jobRes.status === 'fulfilled' && jobRes.value.data?.success) {
        setSavedJobs(jobRes.value.data.data || []);
      }
      if (intRes.status === 'fulfilled' && intRes.value.data?.success) {
        setInterviewReports(intRes.value.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navModules = [
    { name: 'Resume builder (ATS friendly)', path: '/builder', icon: FileText, desc: 'Build Single-Column ATS CV' },
    { name: 'Resume tailoring', path: '/tailor', icon: Sparkles, desc: 'Align CV with Target JD' },
    { name: 'Career Options', path: '/jobs', icon: Briefcase, desc: 'Personalized Role Matches' },
    { name: 'AI interactive Mock Interview', path: '/interview', icon: Video, desc: '4-Stage Placement Practice' },
    { name: 'Tech News', path: '/news', icon: Newspaper, desc: 'Curated Developer Digest' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/50 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/20">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.fullName || 'Candidate'}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.email} • Target Role: <span className="text-brand-400 font-medium">{user?.targetRole || 'Software Engineer'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cloud Workspace Active
          </span>
        </div>
      </div>

      {/* Career Modules Shortcuts (No numbers) */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Access Career Tools
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {navModules.map(m => {
            const Icon = m.icon;
            return (
              <Link key={m.path} to={m.path}>
                <Card hoverEffect className="p-4 bg-slate-900/90 border-slate-800 flex items-center gap-3 hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">
                      {m.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{m.desc}</div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Saved Database Collections & Records */}
      <div className="space-y-4">
        
        {/* Tab Controls */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 max-w-xl">
          <button
            onClick={() => setActiveTab('resumes')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'resumes' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resumes ({resumes.length})
          </button>
          <button
            onClick={() => setActiveTab('tailored')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tailored' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tailored ({tailoredResumes.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'jobs' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Saved Roles ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'interviews' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reports ({interviewReports.length})
          </button>
        </div>

        {/* Tab Content: Resumes */}
        {activeTab === 'resumes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map(r => (
              <Card key={r._id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary" size="sm">{r.templateId}</Badge>
                    <span className="text-xs font-bold font-mono text-emerald-400">ATS {r.atsScore || 85}%</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{r.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{r.careerTarget?.targetRole}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500">{new Date(r.updatedAt || Date.now()).toLocaleDateString()}</span>
                  <Link to="/builder" className="text-brand-400 hover:underline">Edit in Builder ➔</Link>
                </div>
              </Card>
            ))}
            {resumes.length === 0 && (
              <div className="col-span-full p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No saved resumes yet. Create your first ATS-friendly resume in <Link to="/builder" className="text-brand-400 underline font-semibold">Resume builder (ATS friendly)</Link>.
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Tailored Resumes */}
        {activeTab === 'tailored' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tailoredResumes.map(t => (
              <Card key={t._id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="purple" size="sm">Tailored</Badge>
                    <span className="text-xs font-bold font-mono text-emerald-400">{t.matchScoreBefore}% ➔ {t.matchScoreAfter}%</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{t.targetRole}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t.jobDescription}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500">{new Date(t.createdAt || Date.now()).toLocaleDateString()}</span>
                  <Link to="/tailor" className="text-brand-400 hover:underline">Open in Tailor ➔</Link>
                </div>
              </Card>
            ))}
            {tailoredResumes.length === 0 && (
              <div className="col-span-full p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No tailored resumes yet. Tailor an application in <Link to="/tailor" className="text-brand-400 underline font-semibold">Resume tailoring</Link>.
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Saved Jobs */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map(j => (
              <Card key={j._id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary" size="sm">{j.workMode}</Badge>
                    <span className="text-xs font-bold font-mono text-brand-400">{j.matchPercentage}% Match</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{j.title}</h3>
                  <p className="text-xs text-slate-400">{j.company} • {j.location}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500">{j.salary}</span>
                  <a href={j.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
            {savedJobs.length === 0 && (
              <div className="col-span-full p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No saved roles yet. Discover matching positions in <Link to="/jobs" className="text-brand-400 underline font-semibold">Career Options</Link>.
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Mock Interview Reports */}
        {activeTab === 'interviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewReports.map(rep => (
              <Card key={rep._id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={rep.overallResult === 'Passed' ? 'success' : 'warning'} size="sm">
                      {rep.overallResult}
                    </Badge>
                    <span className="text-lg font-black font-mono text-brand-400">{rep.overallScore}%</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{rep.targetRole}</h3>
                  <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                    <div>Aptitude: {rep.aptitudeScore?.overall || 80}%</div>
                    <div>Technical: {rep.technicalScore}% • HR: {rep.hrScore}%</div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500">{new Date(rep.createdAt || Date.now()).toLocaleDateString()}</span>
                  <Link to="/interview" className="text-brand-400 hover:underline">Practice Again ➔</Link>
                </div>
              </Card>
            ))}
            {interviewReports.length === 0 && (
              <div className="col-span-full p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No interview reports saved yet. Practice a session in <Link to="/interview" className="text-brand-400 underline font-semibold">AI interactive Mock Interview</Link>.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
