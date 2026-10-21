import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-glossy-primary text-white font-bold',
    secondary: 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-100 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:border-slate-600 focus:ring-slate-400',
    outline: 'bg-slate-950/60 backdrop-blur-md border border-brand-500/40 hover:border-brand-400 text-brand-300 hover:text-white hover:bg-brand-500/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] focus:ring-brand-400',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_14px_rgba(225,29,72,0.4)] focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white border border-transparent hover:border-white/10 focus:ring-slate-400'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2.5 shadow-lg'
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
};
