import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-panel rounded-xl p-6 transition-all',
          hoverEffect && 'glass-panel-hover',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
