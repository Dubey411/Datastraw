import React, { useState } from 'react';
import { useTickets } from '../../../context/TicketContext';
import { Tabs } from '../../common/Tabs';
import { Dropdown } from '../../common/Dropdown';
import { Button } from '../../common/Button';
import { TicketRow } from './TicketRow';
import { TicketRowSkeleton } from '../../common/Skeleton';
import { EmptyState } from '../../common/EmptyState';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  Inbox,
  Clock,
  CircleDot,
  CheckCircle2,
  Tag,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export function TicketInbox({ onOpenCreateModal }) {
  const {
    filteredTickets,
    selectedTicketId,
    openTicketDetail,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    tabCounts,
    isFiltered,
    resetFilters,
    isLoading,
  } = useTickets();

  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  const tabs = [
    { id: 'All', label: 'All Tickets', count: tabCounts.All, icon: Layers },
    { id: 'Open', label: 'Open', count: tabCounts.Open, icon: CircleDot },
    { id: 'In Progress', label: 'In Progress', count: tabCounts['In Progress'], icon: Clock },
    { id: 'Closed', label: 'Closed', count: tabCounts.Closed, icon: CheckCircle2 },
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'Urgent', label: 'Urgent', iconColor: 'text-rose-600 dark:text-rose-400' },
    { value: 'High', label: 'High', iconColor: 'text-orange-600 dark:text-orange-400' },
    { value: 'Medium', label: 'Medium', iconColor: 'text-amber-600 dark:text-amber-400' },
    { value: 'Low', label: 'Low', iconColor: 'text-slate-500 dark:text-slate-400' },
  ];

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'Account', label: 'Account' },
    { value: 'General', label: 'General' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Highest Priority' },
    { value: 'recently_updated', label: 'Recently Updated' },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark overflow-hidden flex flex-col transition-colors duration-200">
      {/* Top Status Tabs */}
      <div className="px-4 sm:px-5 pt-3 bg-white dark:bg-dark-surface">
        <Tabs
          tabs={tabs}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-dark-border bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Search tickets input */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer, keyword..."
              className="w-full bg-white dark:bg-slate-900/90 text-xs text-slate-900 dark:text-dark-text rounded-xl border border-slate-200 dark:border-dark-border pl-8 pr-8 py-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Filter */}
            <Dropdown
              items={priorityOptions}
              value={priorityFilter}
              onChange={setPriorityFilter}
              placeholder="Priority"
            />

            {/* Category Filter */}
            <Dropdown
              items={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Category"
            />

            {/* Sort Dropdown */}
            <Dropdown
              items={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              align="right"
            />

            {/* Reset filters button */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                title="Clear all active filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {isFiltered && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs animate-in fade-in duration-150">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-200/60 dark:border-indigo-800/60">
                Search: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-indigo-900 dark:hover:text-white"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[11px] font-medium border border-amber-200/60 dark:border-amber-800/60">
                Priority: {priorityFilter}
                <button
                  type="button"
                  onClick={() => setPriorityFilter('All')}
                  className="hover:text-amber-900 dark:hover:text-white"
                  aria-label="Remove priority filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                Category: {categoryFilter}
                <button
                  type="button"
                  onClick={() => setCategoryFilter('All')}
                  className="hover:text-slate-900 dark:hover:text-white"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className="hover:text-slate-900 dark:hover:text-white"
                  aria-label="Reset sort"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Ticket List Body */}
      <div className="divide-y divide-slate-100 dark:divide-dark-border min-h-[360px]">
        {hasSimulatedError ? (
          <EmptyState
            type="error"
            title="Synchronization interrupted"
            description="Failed to pull real-time ticket stream. Please check your network and retry."
            actionLabel="Retry Stream"
            onAction={() => setHasSimulatedError(false)}
          />
        ) : isLoading ? (
          <>
            <TicketRowSkeleton />
            <TicketRowSkeleton />
            <TicketRowSkeleton />
            <TicketRowSkeleton />
          </>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, idx) => (
            <TicketRow
              key={ticket.id}
              index={idx}
              ticket={ticket}
              isSelected={ticket.id === selectedTicketId}
              onSelect={openTicketDetail}
            />
          ))
        ) : isFiltered ? (
          <EmptyState
            type="no_results"
            title="No tickets match your filters"
            description={
              searchQuery
                ? `We couldn't find any tickets matching "${searchQuery}" with the current filters.`
                : 'No tickets matched the specified priority and category filters.'
            }
            actionLabel="Clear Filters"
            onAction={resetFilters}
          />
        ) : (
          <EmptyState
            type="empty"
            title={`No ${statusFilter === 'All' ? '' : statusFilter.toLowerCase()} tickets`}
            description="You have cleared all items in this queue. Great job!"
            actionLabel="+ New Ticket"
            onAction={onOpenCreateModal}
          />
        )}
      </div>

      {/* Footer info bar */}
      <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-700 dark:text-slate-200 font-semibold">{filteredTickets.length}</strong> of{' '}
          <strong className="text-slate-700 dark:text-slate-200 font-semibold">{tabCounts[statusFilter] ?? tabCounts.All}</strong> tickets
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Live sync</span>
        </div>
      </div>
    </div>
  );
}
