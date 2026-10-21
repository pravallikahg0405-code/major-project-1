import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Logo } from './Logo';
import { 
  FileText, 
  Sparkles, 
  Briefcase, 
  Video, 
  Newspaper, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 5 modules without numbers or taglines
  const navModules = [
    { name: 'Resume builder (ATS friendly)', path: '/builder', icon: FileText },
    { name: 'Resume tailoring', path: '/tailor', icon: Sparkles },
    { name: 'Career Options', path: '/jobs', icon: Briefcase },
    { name: 'AI interactive Mock Interview', path: '/interview', icon: Video },
    { name: 'Tech News', path: '/news', icon: Newspaper, badge: 'Public' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/75 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Slogan */}
          <Link to="/" className="flex items-center">
            <Logo size="md" sloganText="AI Career Intelligence" />
          </Link>

          {/* Desktop Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md">
            {navModules.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-b from-brand-500/25 to-brand-500/10 text-white border border-brand-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_10px_rgba(14,165,233,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth State Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-brand-300 hover:bg-brand-500/15 hover:border-brand-500/30 border border-transparent">
                    <LayoutDashboard className="w-3.5 h-3.5 text-brand-400" />
                    Dashboard
                  </Button>
                </Link>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  <span className="max-w-[120px] truncate font-semibold">{user.fullName}</span>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('Sign in to access your saved profile and documents')}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal('Create an account to save your work across all career tools')}
                  className="text-xs"
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 space-y-1.5 shadow-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
            Platform Modules
          </div>
          {navModules.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-500/20 text-white border border-brand-400/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-brand-400 font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard ({user.fullName})
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-slate-900 rounded-xl text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
