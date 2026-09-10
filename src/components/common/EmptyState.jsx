import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { Inbox, SearchX, AlertCircle } from 'lucide-react';

export function EmptyState({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  const configs = {
    empty: {
      icon: Inbox,
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400',
      defaultTitle: 'No tickets in this view',
      defaultDescription: 'All caught up! There are no tickets matching this tab right now.',
      defaultAction: '+ New Ticket',
    },
    no_results: {
      icon: SearchX,
      iconBg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      defaultTitle: 'No matching tickets found',
      defaultDescription: 'We could not find any tickets matching your search or active filters. Try adjusting your query or resetting filters.',
      defaultAction: 'Reset Filters',
    },
    error: {
      icon: AlertCircle,
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400',
      defaultTitle: 'Unable to load tickets',
      defaultDescription: 'Something went wrong while synchronizing support ticket stream. Please try again.',
      defaultAction: 'Retry',
    },
  };

  const config = configs[type] || configs.empty;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-10 text-center rounded-xl bg-white dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark max-w-md mx-auto my-8 animate-in fade-in zoom-in-[0.98] duration-200',
        className
      )}
    >
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 hover:scale-105', config.iconBg)}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text tracking-tight">
        {title || config.defaultTitle}
      </h3>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        {description || config.defaultDescription}
      </p>
      {(actionLabel || config.defaultAction) && onAction && (
        <div className="mt-5">
          <Button
            size="sm"
            variant={type === 'no_results' ? 'outline' : 'primary'}
            onClick={onAction}
          >
            {actionLabel || config.defaultAction}
          </Button>
        </div>
      )}
    </div>
  );
}
