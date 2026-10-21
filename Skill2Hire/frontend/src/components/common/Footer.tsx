import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950/90 border-t border-white/[0.08] mt-28 relative">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Platform Mission */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" sloganText="AI Career Intelligence Platform" />
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed pt-2">
              Next-generation career acceleration platform powered by specialized AI engines. Engineered with industry-standard ATS single-column formatting, zero-hallucination resume tailoring, and adaptive 4-round placement simulations.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ATS Standard Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Zero Fake Skills Guaranteed
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                AI Interview Studio
              </span>
            </div>
          </div>

          {/* Career Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform Modules</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/builder" className="text-slate-400 hover:text-brand-300 transition-colors">
                  Resume builder (ATS friendly)
                </Link>
              </li>
              <li>
                <Link to="/tailor" className="text-slate-400 hover:text-brand-300 transition-colors">
                  Resume tailoring
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-brand-300 transition-colors">
                  Career Options
                </Link>
              </li>
              <li>
                <Link to="/interview" className="text-slate-400 hover:text-brand-300 transition-colors">
                  AI interactive Mock Interview
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-slate-400 hover:text-brand-300 transition-colors">
                  Tech News
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Architecture & Ethics</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Built with ethical AI guardrails, progressive non-intrusive registration, and cloud-synchronized profile storage.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Single-Column Parsing Rule
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Truthful Resume Enhancement
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Interactive Speech STT/TTS
              </div>
            </div>
          </div>

        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} Skill2Hire Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Empowering tech professionals with intelligent career acceleration.</p>
        </div>
      </div>
    </footer>
  );
};
