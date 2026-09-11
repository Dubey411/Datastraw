import React from 'react';
import { cn } from '../../utils/cn';

export function Avatar({ name = '', size = 'md', className, showStatus = false, isOnline = true }) {
  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Deterministic color palette for customer initials
  const getColor = (str) => {
    const colors = [
      'bg-indigo-600 text-white',
      'bg-blue-600 text-white',
      'bg-emerald-600 text-white',
      'bg-amber-600 text-white',
      'bg-purple-600 text-white',
      'bg-rose-600 text-white',
      'bg-teal-600 text-white',
      'bg-slate-700 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs font-semibold',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-12 h-12 text-base font-bold',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  const colorClass = getColor(name || 'Customer');

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-medium ring-2 ring-white select-none shadow-2xs',
          sizes[size],
          colorClass,
          className
        )}
        title={name}
      >
        {getInitials(name)}
      </div>
      {showStatus && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-white',
            statusDotSizes[size],
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          )}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
}
