import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { 
  FileText, 
  Sparkles, 
  Briefcase, 
  Video, 
  Newspaper, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Zap, 
  Target, 
  BarChart3, 
  Search, 
  Check 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const modules = [
    {
      title: 'Resume builder (ATS friendly)',
      path: '/builder',
      icon: FileText,
      description: 'Craft industry-standard single-column resumes specifically engineered to achieve 95%+ pass rates on enterprise Applicant Tracking Systems (ATS) like Workday, Greenhouse, and Lever.',
      functionalities: [
        'Real-time keyword density scoring & ATS compliance meter',
        'Google X-Y-Z formula bullet point generator (Accomplished [X], measured by [Y], by doing [Z])',
        'One-click export to high-fidelity PDF and editable DOCX formats'
      ],
      actionText: 'Launch Resume Builder',
      color: 'from-blue-500 via-sky-400 to-cyan-400',
      badge: 'ATS Engine'
    },
    {
      title: 'Resume tailoring',
      path: '/tailor',
      icon: Sparkles,
      description: 'Intelligently align your authentic experience with specific Job Descriptions (JDs) to dramatically increase relevance and recruiter callback rates while upholding the Zero Fake Skills standard.',
      functionalities: [
        'Side-by-side skill gap analysis and missing keyword identification',
        'Ethical bullet rephrasing tailored to job criteria without hallucinating fake experience',
        'Instant match score improvement comparison before & after tailoring'
      ],
      actionText: 'Launch Resume Tailor',
      color: 'from-indigo-500 via-purple-500 to-pink-500',
      badge: 'Zero Fake Skills'
    },
    {
      title: 'Career Options',
      path: '/jobs',
      icon: Briefcase,
      description: 'Discover curated engineering and technology opportunities aggregated from live market feeds, algorithmically ranked by your personalized compatibility profile.',
      functionalities: [
        'Personalized Compatibility Score ranking based on your candidate profile',
        'Granular filters for Remote, Hybrid, On-site, experience tier, and salary brackets',
        'Direct employer application links with no middleman barriers or paywalls'
      ],
      actionText: 'Explore Career Options',
      color: 'from-emerald-500 via-teal-400 to-cyan-500',
      badge: 'Live Radar'
    },
    {
      title: 'AI interactive Mock Interview',
      path: '/interview',
      icon: Video,
      description: 'Master full-cycle tech placements through a structured 4-round adaptive simulation with real-time AI evaluation, speech recognition, and comprehensive candidate performance analytics.',
      functionalities: [
        '4 progressive rounds: Eligibility Check, Timed Aptitude MCQs, Dynamic Tech Round & HR Assessment',
        'Interactive speech recognition (STT/TTS) and optional camera preview',
        'Detailed diagnostic report with domain-by-domain scoring and improvement roadmap'
      ],
      actionText: 'Start Mock Interview',
      color: 'from-amber-500 via-orange-500 to-rose-500',
      badge: '4-Round Simulation'
    },
    {
      title: 'Tech News',
      path: '/news',
      icon: Newspaper,
      description: 'Stay informed with verified software engineering trends, architectural breakthroughs, and developer hiring shifts curated daily with executive AI takeaways.',
      functionalities: [
        'AI-generated 3-bullet concise executive summaries for rapid scanning',
        'Categorized feeds spanning AI & ML, Cloud Systems, Frontend, Backend, and Career Trends',
        'Direct access to authoritative source articles with 100% open public access'
      ],
      actionText: 'Read Tech News',
      color: 'from-pink-500 via-rose-400 to-purple-500',
      badge: 'Open Access',
      isPublic: true
    }
  ];

  const platformPillars = [
    {
      icon: ShieldCheck,
      title: 'Enterprise ATS Compliance',
      description: 'Single-column structured layouts that parse flawlessly through modern recruiter parsing engines without graphical distortion.'
    },
    {
      icon: Target,
      title: 'Zero-Hallucination Integrity',
      description: 'AI optimization strictly enhances your authentic accomplishments and never fabricates dishonest experiences or credentials.'
    },
    {
      icon: Zap,
      title: 'Full-Cycle Placement Flow',
      description: 'End-to-end preparation from initial CV drafting and job description alignment to 4-stage realistic interview evaluations.'
    },
    {
      icon: BarChart3,
      title: 'Granular Performance Diagnostics',
      description: 'Measurable keyword density metrics, gap breakdowns, and detailed interview diagnostic scorecards to guide your growth.'
    }
  ];

  return (
    <div className="space-y-32 py-8 aurora-canvas">
      
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 relative z-10">
        
        {/* Glossy Top Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/15 text-xs text-brand-300 font-semibold mb-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_25px_-5px_rgba(14,165,233,0.15)] backdrop-blur-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
          </span>
          <span className="tracking-wide">AI Career Intelligence Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Skill<span className="text-brand-400">2</span>Hire
          <span className="block text-2xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-brand-300 to-indigo-300 mt-4 leading-tight">
            Intelligent AI Career Companion & Placement Suite
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
          Comprehensive, AI-powered career acceleration tools designed to help you craft ATS-optimized resumes, tailor applications, discover matching roles, and excel in technical interviews.
        </p>

        {/* Quick Launch Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link to="/builder">
            <Button variant="primary" size="lg" className="font-bold px-7">
              Resume builder (ATS friendly)
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/interview">
            <Button variant="secondary" size="lg" className="font-bold px-7">
              AI interactive Mock Interview
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="lg" className="font-semibold px-6">
              Career Options
            </Button>
          </Link>
        </div>

        {/* Value Prop Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-xs text-slate-300 border-y border-white/[0.08] py-5 max-w-4xl mx-auto backdrop-blur-md bg-slate-950/30 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Single-Column ATS Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="font-medium">Zero Fake Skills Integrity</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-medium">Adaptive 4-Stage Interview AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="font-medium">Live Opportunity Radar</span>
          </div>
        </div>
      </section>

      {/* MODULE CARDS PRESENTATION (GLOSSY CARDS WITH RICH EXPLANATIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="sm">Career Acceleration Suite</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            Specialized Career Intelligence Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Access dedicated, independent tools designed for every phase of your job search and technical interview preparation.
          </p>
        </div>

        {/* Rich Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.title}
                hoverEffect
                className="flex flex-col justify-between p-7 relative group"
              >
                <div>
                  {/* Top Bar: Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_-4px_rgba(0,0,0,0.5)] text-white font-bold group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="primary" size="sm">
                      {m.badge}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-white tracking-tight mb-2.5 group-hover:text-brand-300 transition-colors">
                    {m.title}
                  </h3>

                  {/* Core Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {m.description}
                  </p>

                  {/* Key Functionalities & Features */}
                  <div className="space-y-2.5 pt-4 border-t border-white/[0.08] mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Key Functionalities:
                    </div>
                    {m.functionalities.map((func, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{func}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <Link to={m.path}>
                    <Button variant="ghost" size="sm" className="w-full text-xs text-brand-300 hover:text-white hover:bg-brand-500/15 justify-between py-2.5 font-bold rounded-xl border border-transparent hover:border-brand-500/30">
                      <span>{m.actionText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* PLATFORM PILLARS / WHY CHOOSE SKILL2HIRE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Placement Excellence
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every feature is built around real hiring metrics, objective ATS criteria, and verified interview methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950/70 border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/30 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.2)] flex items-center justify-center text-brand-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">{pillar.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GLOSSY CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className="p-8 sm:p-14 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/50 border border-brand-500/40 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(14,165,233,0.15)]">
          {/* Ambient Flare */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Accelerate Your Tech Career
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Optimize Your Career Trajectory?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Join ambitious engineers and professionals leveraging AI to build ATS-compliant resumes, master interview rounds, and secure top offers.
              </p>
            </div>
            <Link to="/builder">
              <Button variant="primary" size="lg" className="whitespace-nowrap font-bold px-8">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

    </div>
  );
};
