import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalReason, login, register } = useAuth();
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (tab === 'register') {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }
      const res = await register(fullName, email, password, targetRole);
      if (!res.success) {
        setError(res.error || 'Registration failed.');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        setIsLoading(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Login failed.');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-brand-500/10 overflow-hidden">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-400 via-sky-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Badge & Contextual Reason */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Progressive Account Sync</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1.5">
            {tab === 'register' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {authModalReason}
          </p>

          {/* Tab Switcher */}
          <div className="flex p-1 mb-6 rounded-lg bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === 'register' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === 'login' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-brand-400"
                >
                  <option value="Full Stack Developer">Full Stack Developer (MERN)</option>
                  <option value="Frontend Developer">Frontend Developer (React/TS)</option>
                  <option value="Backend Developer">Backend Developer (Node/Python/Java)</option>
                  <option value="Software Engineer">Software Engineer (General)</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="Data & AI Engineer">Data & AI Engineer</option>
                </select>
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              {tab === 'register' ? 'Create Account & Continue' : 'Sign In & Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Demonstration Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Preserves entered draft work
            </span>
            <span>MongoDB Atlas Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
