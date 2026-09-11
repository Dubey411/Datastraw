import React from 'react';
import { useTickets } from '../../../context/TicketContext';
import { StatCard } from '../../common/StatCard';
import { HeroBanner } from './HeroBanner';
import { RightSidebarPanel } from './RightSidebarPanel';
import { TicketInbox } from '../tickets/TicketInbox';
import {
  Layers,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function DashboardView({ onOpenCreateModal, onOpenAnalytics }) {
  const { stats, statusFilter, setStatusFilter } = useTickets();

  return (
    <div className="w-full max-w-[1720px] mx-auto">
      {/* 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left / Center Primary Column (approx 72% width on desktop) */}
        <div className="xl:col-span-8 2xl:col-span-9 space-y-6 min-w-0">
          {/* 1. Panoramic Scenic Hero Banner */}
          <HeroBanner
            onOpenCreateModal={onOpenCreateModal}
            onOpenAnalytics={onOpenAnalytics}
          />

          {/* 2. Four KPI Stat Cards Row with Custom Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Tickets */}
            <StatCard
              index={0}
              title="Total Tickets"
              value={stats.total}
              trend="12%"
              trendDirection="up"
              trendLabel="vs last week"
              icon={Layers}
              iconShape="rounded-xl"
              iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400"
              sparklineType="total"
              isActive={statusFilter === 'All'}
              onClick={() => setStatusFilter('All')}
            />

            {/* Open */}
            <StatCard
              index={1}
              title="Open"
              value={stats.open}
              trend="0%"
              trendDirection="up"
              trendLabel="vs last week"
              icon={ArrowDownCircle}
              iconShape="rounded-full"
              iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400"
              sparklineType="open"
              isActive={statusFilter === 'Open'}
              onClick={() => setStatusFilter('Open')}
            />

            {/* In Progress */}
            <StatCard
              index={2}
              title="In Progress"
              value={stats.inProgress}
              trend="25%"
              trendDirection="down"
              trendLabel="vs last week"
              icon={Clock}
              iconShape="rounded-full"
              iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400"
              sparklineType="inProgress"
              isActive={statusFilter === 'In Progress'}
              onClick={() => setStatusFilter('In Progress')}
            />

            {/* Closed */}
            <StatCard
              index={3}
              title="Closed"
              value={stats.closed}
              trend="50%"
              trendDirection="up"
              trendLabel="vs last week"
              icon={CheckCircle2}
              iconShape="rounded-full"
              iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400"
              sparklineType="closed"
              isActive={statusFilter === 'Closed'}
              onClick={() => setStatusFilter('Closed')}
            />
          </div>

          {/* 3. Ticket Workspace (Structured Data Table) */}
          <div className="w-full">
            <TicketInbox
              onOpenCreateModal={onOpenCreateModal}
              onOpenAnalytics={onOpenAnalytics}
            />
          </div>
        </div>

        {/* Right Secondary Column (AI Assistant, Recent Activity, Performance Chart, Quote) */}
        <div className="xl:col-span-4 2xl:col-span-3 space-y-6 min-w-0">
          <RightSidebarPanel />
        </div>
      </div>
    </div>
  );
}

