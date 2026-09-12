import React from 'react';
import { cn } from '../../utils/cn';
import { useCountUp } from '../../hooks/useCountUp';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function Card({ children, className, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Sparkline SVG paths for each stat card type
const SPARKLINE_CONFIGS = {
  total: {
    color: '#818CF8', // Indigo / Purple
    path: 'M 2 24 Q 18 30 32 14 T 62 20 T 92 8',
    gradientId: 'sparkline-total',
  },
  open: {
    color: '#38BDF8', // Sky Blue
    path: 'M 2 26 Q 22 28 40 12 T 70 18 T 92 8',
    gradientId: 'sparkline-open',
  },
  inProgress: {
    color: '#FBBF24', // Amber
    path: 'M 2 18 Q 20 28 42 10 T 68 22 T 92 12',
    gradientId: 'sparkline-progress',
  },
  closed: {
    color: '#34D399', // Emerald
    path: 'M 2 26 Q 25 28 45 22 T 75 14 T 92 4',
    gradientId: 'sparkline-closed',
  },
};

export function StatCard({
  title,
  value,
  trend,
  trendDirection = 'up', // 'up' | 'down'
  trendLabel = 'vs last week',
  sparklineType = 'total',
  icon: Icon,
  iconShape = 'rounded-xl', // 'rounded-xl' or 'rounded-full'
  iconBg = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  className,
  onClick,
  isActive = false,
  index = 0,
}) {
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
  const countUpVal = useCountUp(!isNaN(numericValue) ? numericValue : 0, 700, index * 80);
  const animatedNumber = !isNaN(numericValue) ? countUpVal : value;

  // Determine sparkline based on title or type
  let sparklineKey = sparklineType;
  const titleLower = (title || '').toLowerCase();
  if (titleLower.includes('total')) sparklineKey = 'total';
  else if (titleLower.includes('open')) sparklineKey = 'open';
  else if (titleLower.includes('progress')) sparklineKey = 'inProgress';
  else if (titleLower.includes('closed')) sparklineKey = 'closed';

  const sparkline = SPARKLINE_CONFIGS[sparklineKey] || SPARKLINE_CONFIGS.total;
  const isDownTrend = trendDirection === 'down' || (trend && trend.startsWith('-')) || (trend && trend.includes('↓'));

  // Clean trend text
  let trendText = trend || '';
  if (trendText.includes('vs last week')) {
    trendText = trendText.replace('vs last week', '').trim();
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/80 dark:border-dark-border p-4 shadow-xs dark:shadow-card-dark transition-all duration-200 select-none relative overflow-hidden group',
        'hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-card-dark-hover',
        onClick && 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/40',
        isActive && 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/10 dark:ring-indigo-500/20 shadow-sm',
        className
      )}
    >
      {/* Top row: Icon & Three Dots */}
      <div className="flex items-center justify-between mb-3">
        {Icon && (
          <div
            className={cn(
              'w-8 h-8 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs',
              iconShape,
              iconBg
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Middle row: Title */}
      <div className="text-xs font-semibold text-slate-500 dark:text-dark-text-secondary">
        {title}
      </div>

      {/* Bottom Content: Number + Trend on left, Sparkline on right */}
      <div className="mt-1 flex items-end justify-between gap-2">
        <div>
          <div className="text-2xl sm:text-3xl font-display font-[540] tracking-tight text-slate-900 dark:text-dark-text tabular-nums">
            {!isNaN(numericValue) ? animatedNumber : value}
          </div>

          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium whitespace-nowrap">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold',
                isDownTrend ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              )}
            >
              {isDownTrend ? '↓' : '↑'} {trendText || (isDownTrend ? '25%' : '12%')}
            </span>
            <span className="text-slate-400 dark:text-slate-500">{trendLabel}</span>
          </div>
        </div>

        {/* Custom SVG Sparkline */}
        <div className="w-20 h-10 flex-shrink-0 pb-1">
          <svg viewBox="0 0 94 32" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={sparkline.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkline.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={sparkline.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={sparkline.path}
              fill="none"
              stroke={sparkline.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 group-hover:stroke-[3]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

