import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/80', className)}
      {...props}
    />
  );
}

export function TicketRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-dark-border bg-white dark:bg-dark-surface gap-4">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-14 h-4 rounded-md" />
            <Skeleton className="w-28 h-4 rounded-md" />
            <Skeleton className="w-48 h-4 rounded-md" />
          </div>
          <Skeleton className="w-3/4 h-3 rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-md" />
        <Skeleton className="w-14 h-3 rounded-md" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-slate-200/80 dark:border-dark-border p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <Skeleton className="w-12 h-7 rounded-md" />
        <Skeleton className="w-16 h-4 rounded-full" />
      </div>
    </div>
  );
}

export function DetailPanelSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-dark-surface h-full">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-5 rounded-md" />
          <Skeleton className="w-24 h-5 rounded-full" />
        </div>
        <Skeleton className="w-3/4 h-7 rounded-md" />
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-44 h-3 rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-dark-border">
        <Skeleton className="w-full h-20 rounded-xl" />
        <Skeleton className="w-5/6 h-20 rounded-xl" />
      </div>
    </div>
  );
}
