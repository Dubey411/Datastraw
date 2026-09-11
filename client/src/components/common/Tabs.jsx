import React from 'react';
import { cn } from '../../utils/cn';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('relative flex items-center border-b border-slate-200/80 dark:border-dark-border gap-1 overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'group relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none -mb-px',
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  'w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />
            )}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'text-[11px] font-medium px-1.5 py-0.2 rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-semibold scale-105'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                )}
              >
                {tab.count}
              </span>
            )}

            {/* Sliding Underline Indicator */}
            {isActive && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-in fade-in zoom-in-90 duration-200"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
