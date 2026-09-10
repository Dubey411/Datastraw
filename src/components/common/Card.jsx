import React from 'react';
import { cn } from '../../utils/cn';
import { useCountUp } from '../../hooks/useCountUp';

export function Card({ children, className, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-dark-surface rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconBg = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  className,
  onClick,
  isActive = false,
  index = 0,
}) {
  // Numeric count up animation
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
  const animatedNumber = !isNaN(numericValue) ? useCountUp(numericValue, 700, index * 80) : value;

  // Stagger entrance delay
  const animationDelay = `${index * 70}ms`;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay }}
      className={cn(
        'bg-white dark:bg-dark-surface rounded-xl border border-slate-200/80 dark:border-dark-border p-4 shadow-xs dark:shadow-card-dark transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden group animate-fade-in-up',
        'hover:-translate-y-0.5 hover:shadow-card-hover dark:hover:shadow-card-dark-hover',
        onClick && 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/40',
        isActive && 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/10 dark:ring-indigo-500/20 shadow-sm',
        className
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-dark-text-secondary tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
              iconBg
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main KPI number & trend */}
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-dark-text tabular-nums">
          {!isNaN(numericValue) ? animatedNumber : value}
        </span>
        {trend && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 px-2 py-0.5 rounded-full whitespace-nowrap">
            {trend}
          </span>
        )}
      </div>

      {/* Subtle micro progress bar animating left to right */}
      <div className="mt-2.5 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
          style={{
            width: !isNaN(numericValue) && numericValue > 0 ? `${Math.min(numericValue * 15 + 20, 100)}%` : '20%',
            transitionDelay: `${index * 90 + 100}ms`,
          }}
        />
      </div>
    </div>
  );
}
