import React from 'react';
import { cn } from '../../utils/cn';
import { 
  CircleDot, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUp, 
  Minus, 
  ArrowDown,
  Tag
} from 'lucide-react';

export function StatusBadge({ status, size = 'md', className }) {
  const configs = {
    Open: {
      label: 'Open',
      icon: CircleDot,
      styles: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    'In Progress': {
      label: 'In Progress',
      icon: Clock,
      styles: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    Closed: {
      label: 'Closed',
      icon: CheckCircle2,
      styles: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  };

  const config = configs[status] || configs.Open;
  const Icon = config.icon;

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-2xs select-none tracking-tight transition-all duration-200',
        config.styles,
        sizes[size],
        className
      )}
    >
      <Icon className={cn('w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:rotate-6', config.iconColor)} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md', className }) {
  const configs = {
    Urgent: {
      label: 'Urgent',
      icon: AlertTriangle,
      styles: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    High: {
      label: 'High',
      icon: ArrowUp,
      styles: 'bg-orange-50 text-orange-800 border-orange-200/80 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    Medium: {
      label: 'Medium',
      icon: Minus,
      styles: 'bg-amber-50/80 text-amber-800 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    Low: {
      label: 'Low',
      icon: ArrowDown,
      styles: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      iconColor: 'text-slate-500 dark:text-slate-400',
    },
  };

  const config = configs[priority] || configs.Medium;
  const Icon = config.icon;

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border select-none transition-all duration-200',
        config.styles,
        sizes[size],
        className
      )}
    >
      <Icon className={cn('w-3 h-3 flex-shrink-0 transition-transform duration-200', config.iconColor)} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}

export function CategoryBadge({ category, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60 transition-colors',
        className
      )}
    >
      <Tag className="w-2.5 h-2.5 mr-1 text-slate-400 dark:text-slate-500" />
      {category}
    </span>
  );
}
