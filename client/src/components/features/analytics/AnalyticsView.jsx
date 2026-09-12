import React from 'react';
import { useTickets } from '../../../context/TicketContext';
import { StatCard } from '../../common/StatCard';
import {
  Clock,
  CheckCircle2,
  ThumbsUp,
  Flame,
  BarChart,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';

export function AnalyticsView() {
  const { tickets, stats } = useTickets();

  // Category counts
  const categories = ['Technical', 'Billing', 'Feature Request', 'Account', 'General'];
  const catCounts = categories.map((cat) => ({
    name: cat,
    count: tickets.filter((t) => t.category === cat).length,
  }));

  const totalCategorized = tickets.length || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-colors duration-200">
        <div className="type-eyebrow mb-1">PERFORMANCE INTELLIGENCE</div>
        <h1 className="type-h2 !text-2xl sm:!text-3xl text-slate-900 dark:text-dark-text tracking-tight">
          Support Analytics & <em>SLA Velocity</em>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics covering turnaround velocity, customer satisfaction, and queue distribution.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Median Response Time"
          value="14 mins"
          trend="3m faster than SLA"
          icon={Clock}
          iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
        />
        <StatCard
          index={1}
          title="Resolution Rate"
          value="98.4%"
          trend="+1.2% this month"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        />
        <StatCard
          index={2}
          title="Customer CSAT"
          value="4.9 / 5.0"
          trend="Based on 142 ratings"
          icon={ThumbsUp}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
        />
        <StatCard
          index={3}
          title="Urgent Queue SLA"
          value="99.2%"
          trend="0 breached tickets"
          icon={Flame}
          iconBg="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
        />
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume by Category */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text">Tickets by Category</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Volume distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {catCounts.map((cat, i) => {
              const percentage = Math.round((cat.count / totalCategorized) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{cat.count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percentage}%`,
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown & SLA */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h3 className="type-h3 !text-sm">SLA Compliance Targets</h3>
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              All Targets Met
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-dark-border flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Urgent Priority (P1)</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">Target response: &lt; 30 mins</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">99.2%</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-dark-border flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">High Priority (P2)</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">Target response: &lt; 2 hours</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">98.8%</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-dark-border flex items-center justify-between transition-colors">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Normal / Low Priority</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">Target response: &lt; 8 hours</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">99.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
