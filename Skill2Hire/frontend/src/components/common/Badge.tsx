import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className
}) => {
  const variants = {
    primary: 'bg-brand-500/10 text-brand-300 border border-brand-500/30 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.2)]',
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.2)]',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]',
    danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/30 shadow-[inset_0_1px_0_0_rgba(251,113,133,0.2)]',
    neutral: 'bg-slate-900/80 text-slate-300 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
    purple: 'bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-[inset_0_1px_0_0_rgba(192,132,252,0.2)]'
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 font-semibold rounded-full tracking-wide',
    md: 'text-xs px-3 py-1 font-semibold rounded-full tracking-wide'
  };

  return (
    <span className={twMerge(clsx('inline-flex items-center gap-1.5 backdrop-blur-md', variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
};
