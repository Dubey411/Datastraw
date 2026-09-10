import React from 'react';
import { useTickets } from '../../../context/TicketContext';
import { StatCard } from '../../common/StatCard';
import { Button } from '../../common/Button';
import { TicketInbox } from '../tickets/TicketInbox';
import {
  Layers,
  CircleDot,
  Clock,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react';

export function DashboardView({ onOpenCreateModal }) {
  const { stats, statusFilter, setStatusFilter } = useTickets();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner with ambient glow */}
      <div className="relative overflow-hidden bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-all duration-300 animate-fade-in-up">
        {/* Ambient subtle glow blob in background */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-500/10 dark:bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2 border border-indigo-100 dark:border-indigo-800/60 shadow-2xs">
              <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Support Command Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-dark-text">
              Welcome back, Shubham!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening with your support system today.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={onOpenCreateModal}
              className="shadow-sm shadow-indigo-600/20 dark:shadow-glow-indigo"
            >
              + New Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row with sequential stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <StatCard
          index={0}
          title="Total Tickets"
          value={stats.total}
          trend="+12% this week"
          icon={Layers}
          iconBg="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          isActive={statusFilter === 'All'}
          onClick={() => setStatusFilter('All')}
        />

        {/* Open */}
        <StatCard
          index={1}
          title="Open"
          value={stats.open}
          trend={stats.openTrend}
          icon={CircleDot}
          iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          isActive={statusFilter === 'Open'}
          onClick={() => setStatusFilter('Open')}
        />

        {/* In Progress */}
        <StatCard
          index={2}
          title="In Progress"
          value={stats.inProgress}
          trend={stats.inProgressTrend}
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          isActive={statusFilter === 'In Progress'}
          onClick={() => setStatusFilter('In Progress')}
        />

        {/* Closed */}
        <StatCard
          index={3}
          title="Closed"
          value={stats.closed}
          trend={stats.closedTrend}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          isActive={statusFilter === 'Closed'}
          onClick={() => setStatusFilter('Closed')}
        />
      </div>

      {/* Ticket Inbox Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-dark-text uppercase tracking-wider">
              Ticket Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage, triage, and reply to client inquiries
            </p>
          </div>
        </div>

        <TicketInbox onOpenCreateModal={onOpenCreateModal} />
      </div>
    </div>
  );
}
