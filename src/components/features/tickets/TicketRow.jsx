import React from 'react';
import { cn } from '../../../utils/cn';
import { Avatar } from '../../common/Avatar';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../common/Badge';
import { Clock, ChevronRight } from 'lucide-react';

export function TicketRow({ ticket, isSelected, onSelect, index = 0 }) {
  // Format relative timestamp
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const animationDelay = `${Math.min(index * 35, 350)}ms`;

  return (
    <div
      onClick={() => onSelect(ticket.id)}
      role="button"
      tabIndex={0}
      style={{ animationDelay }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ticket.id);
        }
      }}
      className={cn(
        'group relative w-full text-left transition-all duration-200 cursor-pointer border-b border-slate-100 dark:border-dark-border select-none outline-none animate-in fade-in slide-in-from-bottom-1.5 duration-250',
        'hover:bg-slate-50/80 dark:hover:bg-dark-surface-hover focus-visible:bg-slate-50 dark:focus-visible:bg-dark-surface-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500',
        isSelected
          ? 'bg-indigo-50/40 dark:bg-indigo-950/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/50'
          : 'bg-white dark:bg-dark-surface'
      )}
    >
      {/* Active Left Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-400" />
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between px-5 py-3.5 gap-4">
        {/* Left: ID & Customer & Subject */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Customer Avatar with subtle scale on row hover */}
          <div className="transition-transform duration-200 group-hover:scale-105">
            <Avatar
              name={ticket.customer?.name}
              size="md"
              className="flex-shrink-0"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-dark-text bg-slate-100/90 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 flex-shrink-0">
                {ticket.id}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                {ticket.customer?.name}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <h4 className="text-xs font-medium text-slate-900 dark:text-dark-text truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {ticket.subject}
              </h4>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-2xl">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Right: Badges + Timestamp */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <CategoryBadge category={ticket.category} />
          <PriorityBadge priority={ticket.priority} size="sm" />
          <StatusBadge status={ticket.status} size="sm" />
          <span className="text-xs text-slate-400 dark:text-slate-500 min-w-[65px] text-right font-medium">
            {formatTime(ticket.updatedAt || ticket.createdAt)}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>

      {/* Mobile & Tablet Layout (Stacked Card) */}
      <div className="lg:hidden p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name={ticket.customer?.name}
              size="sm"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-dark-text bg-slate-100 dark:bg-slate-800 px-1 rounded">
                  {ticket.id}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {ticket.customer?.name}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            {formatTime(ticket.updatedAt || ticket.createdAt)}
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-dark-text line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {ticket.subject}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {ticket.description}
          </p>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-50 dark:border-dark-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={ticket.status} size="sm" />
            <PriorityBadge priority={ticket.priority} size="sm" />
          </div>
          <CategoryBadge category={ticket.category} />
        </div>
      </div>
    </div>
  );
}
