import React from 'react';
import { cn } from '../../../utils/cn';
import {
  Layers,
  CircleDot,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  ArrowRight,
  Zap,
} from 'lucide-react';

export function DashboardPreviewMockup({ isDark = false, className }) {
  const tickets = [
    {
      id: 'TKT-001',
      initials: 'AS',
      avatarBg: 'bg-indigo-600',
      name: 'Amit Sharma',
      subject: 'Cannot reset my password',
      status: 'Open',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
      priority: '+ High',
      priorityColor: 'text-rose-600 dark:text-rose-400',
      time: '2 min ago',
    },
    {
      id: 'TKT-002',
      initials: 'RJ',
      avatarBg: 'bg-emerald-600',
      name: 'Rahul Jain',
      subject: 'Feature request: Dark mode',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
      priority: '→ Medium',
      priorityColor: 'text-amber-600 dark:text-amber-400',
      time: '15 min ago',
    },
    {
      id: 'TKT-003',
      initials: 'KT',
      avatarBg: 'bg-pink-600',
      name: 'Karan Thakur',
      subject: 'Error while uploading file',
      status: 'Open',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
      priority: '+ High',
      priorityColor: 'text-rose-600 dark:text-rose-400',
      time: '1 hour ago',
    },
    {
      id: 'TKT-004',
      initials: 'NP',
      avatarBg: 'bg-purple-600',
      name: 'Neha Patel',
      subject: 'Billing issue',
      status: 'Closed',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
      priority: '→ Medium',
      priorityColor: 'text-amber-600 dark:text-amber-400',
      time: '2 hours ago',
    },
  ];

  return (
    <div
      className={cn(
        'relative rounded-2xl md:rounded-3xl border shadow-2xl transition-all duration-500 select-none overflow-hidden',
        isDark
          ? 'bg-[#0E1424] border-indigo-500/20 shadow-indigo-950/60 text-slate-200'
          : 'bg-white border-slate-200/90 shadow-2xl shadow-indigo-950/10 text-slate-800',
        className
      )}
    >
      {/* Window Controls / Mini Topbar */}
      <div
        className={cn(
          'px-4 py-3 flex items-center justify-between border-b text-xs',
          isDark ? 'border-slate-800/80 bg-[#0A0F1D]' : 'border-slate-100 bg-slate-50/70'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-semibold text-[11px] text-slate-400 dark:text-slate-500">
            datastraw.io/workspace
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px]',
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 border border-slate-200/60'
            )}
          >
            <Search className="w-3 h-3 text-slate-400" />
            <span>Search tickets...</span>
            <kbd className="text-[9px] px-1 bg-slate-100 dark:bg-slate-700 rounded">⌘K</kbd>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
              SD
            </div>
            <span className="text-[11px] font-medium hidden sm:inline">Shubham Dubey</span>
          </div>
        </div>
      </div>

      {/* Main Inner Body: Mini Sidebar + Content */}
      <div className="grid grid-cols-12 min-h-[320px]">
        {/* Left Mini Sidebar */}
        <div
          className={cn(
            'col-span-3 border-r p-3 space-y-3 hidden sm:flex sm:flex-col justify-between text-xs',
            isDark ? 'border-slate-800/80 bg-[#0B101E]' : 'border-slate-100 bg-slate-50/50'
          )}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-2 py-1 mb-2 font-bold text-xs tracking-tight">
              <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white">
                <Layers className="w-3 h-3" />
              </div>
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Datastraw</span>
            </div>

            <div
              className={cn(
                'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold',
                isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
              )}
            >
              <span>Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-600">
              <span>Tickets</span>
              <span className="text-[10px] px-1.5 rounded-full bg-slate-200 dark:bg-slate-800 font-bold">
                12
              </span>
            </div>

            <div className="px-2.5 py-1.5 text-xs text-slate-400">Customers</div>
            <div className="px-2.5 py-1.5 text-xs text-slate-400">Analytics</div>
            <div className="px-2.5 py-1.5 text-xs text-slate-400">Knowledge Base</div>
            <div className="px-2.5 py-1.5 text-xs text-slate-400">Settings</div>
          </div>

          {/* Mini Pro Card */}
          <div
            className={cn(
              'p-2.5 rounded-xl border space-y-1.5',
              isDark
                ? 'bg-gradient-to-b from-[#141A2E] to-[#0D1222] border-indigo-500/30'
                : 'bg-indigo-50/70 border-indigo-100'
            )}
          >
            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
              Upgrade to Pro
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              Unlock advanced analytics & AI insights
            </p>
            <div className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 pt-0.5">
              <span>Upgrade Now</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="col-span-12 sm:col-span-9 p-4 space-y-3.5">
          {/* Greeting Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Good morning, Shubham! 👋
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                Here's what's happening with your support system today.
              </p>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Ticket</span>
            </button>
          </div>

          {/* 4 Mini Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Total Tickets */}
            <div
              className={cn(
                'p-2.5 rounded-xl border flex flex-col justify-between',
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
              )}
            >
              <span className="text-[10px] font-medium text-slate-400">Total Tickets</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-base font-bold text-slate-900 dark:text-white">124</span>
                <span className="text-[9px] font-semibold text-emerald-500">↑ 12%</span>
              </div>
            </div>

            {/* Open */}
            <div
              className={cn(
                'p-2.5 rounded-xl border flex flex-col justify-between',
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
              )}
            >
              <span className="text-[10px] font-medium text-slate-400">Open</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-base font-bold text-slate-900 dark:text-white">32</span>
                <span className="text-[9px] font-semibold text-emerald-500">↑ 8%</span>
              </div>
            </div>

            {/* In Progress */}
            <div
              className={cn(
                'p-2.5 rounded-xl border flex flex-col justify-between',
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
              )}
            >
              <span className="text-[10px] font-medium text-slate-400">In Progress</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-base font-bold text-slate-900 dark:text-white">18</span>
                <span className="text-[9px] font-semibold text-rose-500">↓ 4%</span>
              </div>
            </div>

            {/* Closed */}
            <div
              className={cn(
                'p-2.5 rounded-xl border flex flex-col justify-between',
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
              )}
            >
              <span className="text-[10px] font-medium text-slate-400">Closed</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-base font-bold text-slate-900 dark:text-white">74</span>
                <span className="text-[9px] font-semibold text-emerald-500">↑ 20%</span>
              </div>
            </div>
          </div>

          {/* Mini Recent Tickets Table */}
          <div
            className={cn(
              'rounded-xl border overflow-hidden text-xs',
              isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200/80 bg-white'
            )}
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold text-[11px]">
              <span>Recent Tickets</span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                View all →
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {tickets.map((t) => (
                <div key={t.id} className="px-3 py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-[10px] text-slate-400">
                      {t.id}
                    </span>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0',
                        t.avatarBg
                      )}
                    >
                      {t.initials}
                    </div>
                    <span className="font-semibold text-xs truncate text-slate-800 dark:text-slate-200 max-w-[90px] sm:max-w-[130px]">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate hidden md:inline max-w-[150px]">
                      {t.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={cn(
                        'text-[9px] font-semibold px-2 py-0.5 rounded-full border',
                        t.statusColor
                      )}
                    >
                      {t.status}
                    </span>
                    <span className={cn('text-[10px] font-bold hidden sm:inline', t.priorityColor)}>
                      {t.priority}
                    </span>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap">
                      {t.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
