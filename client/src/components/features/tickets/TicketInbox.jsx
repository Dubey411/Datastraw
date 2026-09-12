import React, { useState } from 'react';
import { useTickets } from '../../../context/TicketContext';
import { Dropdown } from '../../common/Dropdown';
import { TicketRow } from './TicketRow';
import { TicketRowSkeleton } from '../../common/Skeleton';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import {
  Search,
  X,
  RotateCcw,
  List,
  Columns,
  BarChart2,
  MoreHorizontal,
  Clock,
  Layers,
  CircleDot,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export function TicketInbox({ onOpenCreateModal, onOpenAnalytics }) {
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
    isFreshWorkspace,
    loadDemoDataForCurrentUser,
    bulkTrashTickets,
    bulkRestoreTickets,
    bulkPermanentDeleteTickets,
  } = useTickets();

  const [activeViewMode, setActiveViewMode] = useState('list'); // 'list' | 'kanban' | 'analytics'
  const [selectedTicketIds, setSelectedTicketIds] = useState(new Set());
  const [isBulkPurgeDialogOpen, setIsBulkPurgeDialogOpen] = useState(false);
  const [isBulkPurging, setIsBulkPurging] = useState(false);

  // Toggle individual ticket checkbox
  const handleToggleCheck = (ticketId) => {
    setSelectedTicketIds((prev) => {
      const next = new Set(prev);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      return next;
    });
  };

  // Toggle select all
  const handleSelectAll = () => {
    if (selectedTicketIds.size === filteredTickets.length && filteredTickets.length > 0) {
      setSelectedTicketIds(new Set());
    } else {
      setSelectedTicketIds(new Set(filteredTickets.map((t) => t.id)));
    }
  };

  const isAllSelected =
    filteredTickets.length > 0 && selectedTicketIds.size === filteredTickets.length;

  const handleBulkMoveToTrash = async () => {
    if (selectedTicketIds.size === 0) return;
    await bulkTrashTickets(Array.from(selectedTicketIds));
    setSelectedTicketIds(new Set());
  };

  const handleBulkRestore = async () => {
    if (selectedTicketIds.size === 0) return;
    await bulkRestoreTickets(Array.from(selectedTicketIds));
    setSelectedTicketIds(new Set());
  };

  const handleBulkPermanentDelete = () => {
    if (selectedTicketIds.size === 0) return;
    setIsBulkPurgeDialogOpen(true);
  };

  const handleConfirmBulkPurge = async () => {
    if (selectedTicketIds.size === 0) return;
    setIsBulkPurging(true);
    try {
      await bulkPermanentDeleteTickets(Array.from(selectedTicketIds));
      setSelectedTicketIds(new Set());
      setIsBulkPurgeDialogOpen(false);
    } finally {
      setIsBulkPurging(false);
    }
  };

  const tabs = [
    { id: 'All', label: 'All Tickets', count: tabCounts.All },
    { id: 'Open', label: 'Open', count: tabCounts.Open, icon: Clock },
    { id: 'In Progress', label: 'In Progress', count: tabCounts['In Progress'] },
    { id: 'Closed', label: 'Closed', count: tabCounts.Closed },
    { id: 'Trash', label: 'Trash', count: tabCounts.Trash || 0, icon: Trash2 },
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Feature', label: 'Feature' },
    { value: 'Account', label: 'Account' },
    { value: 'Bug', label: 'Bug' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Highest Priority' },
    { value: 'recently_updated', label: 'Recently Updated' },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark overflow-hidden flex flex-col transition-all select-none">
      {/* 1. Header Row: Workspace Title + View Switchers */}
      <div className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-dark-border">
        <div>
          <div className="type-eyebrow mb-1">QUEUE MANAGEMENT</div>
          <h2 className="type-h2 !text-xl sm:!text-2xl text-slate-900 dark:text-dark-text tracking-tight">
            Ticket <em>Workspace</em>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, triage, and reply to client inquiries
          </p>
        </div>

        {/* View Switchers: List, Kanban, Analytics, ... */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/70 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/60 dark:border-dark-border">
          <button
            type="button"
            onClick={() => setActiveViewMode('list')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              activeViewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('kanban')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              activeViewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenAnalytics) onOpenAnalytics();
              else setActiveViewMode('analytics');
            }}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              activeViewMode === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Status Underlined Tabs with Count Badges */}
      <div className="px-5 pt-1 border-b border-slate-200/80 dark:border-dark-border flex items-center gap-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                'py-3 text-xs font-semibold flex items-center gap-2 relative transition-all whitespace-nowrap',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              <span
                className={cn(
                  'text-[11px] font-bold px-1.5 py-0.5 rounded-full transition-colors',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                )}
              >
                {tab.count}
              </span>

              {/* Active Underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Filter Bar: Search + Priorities + Categories + Sort + Reset */}
      <div className="p-3.5 sm:px-5 border-b border-slate-100 dark:border-dark-border bg-white dark:bg-dark-surface flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, customer, keyword..."
            className="w-full bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-dark-text rounded-xl border border-slate-200/80 dark:border-dark-border pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <Dropdown
            items={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="All Priorities"
          />

          <Dropdown
            items={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="All Categories"
          />

          <Dropdown
            items={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Newest First"
            align="right"
          />

          {/* Reset button */}
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-dark-border transition-all"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Informative banner when viewing Trash */}
      {statusFilter === 'Trash' && (
        <div className="px-5 py-2.5 bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">
              You are viewing <strong>Trash</strong>. Tickets here are soft-deleted and hidden from active views.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline"
          >
            Back to Active Tickets →
          </button>
        </div>
      )}

      {/* 4. Table View / Kanban View */}
      {activeViewMode === 'list' ? (
        <div className="overflow-x-auto min-h-[360px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-dark-border font-mono text-[11px] font-medium text-slate-500 dark:text-dark-text-secondary uppercase tracking-[0.14em] bg-slate-50/50 dark:bg-slate-900/30">
                {/* Checkbox Header */}
                <th className="py-3 pl-4 pr-2 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Updated</th>
                <th className="py-3 pl-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-slate-500">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, idx) => (
                  <TicketRow
                    key={ticket.id}
                    index={idx}
                    ticket={ticket}
                    isSelected={ticket.id === selectedTicketId}
                    isChecked={selectedTicketIds.has(ticket.id)}
                    onToggleCheck={handleToggleCheck}
                    onSelect={openTicketDetail}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    {statusFilter === 'Trash' ? (
                      <EmptyState
                        type="trash_empty"
                        title="Trash is empty"
                        description="No soft-deleted tickets found. Any tickets you move to trash will appear here and can be restored anytime."
                        actionLabel="← View All Tickets"
                        onAction={() => setStatusFilter('All')}
                      />
                    ) : isFreshWorkspace && !isFiltered ? (
                      <EmptyState
                        type="fresh_workspace"
                        title="Welcome to your fresh workspace!"
                        description="You are logged in with your real account. Start clean by creating your first ticket, or load sample demo data anytime to explore the full CRM workflow."
                        actionLabel="+ Create First Ticket"
                        onAction={onOpenCreateModal}
                        secondaryActionLabel="Load Demo Data"
                        onSecondaryAction={loadDemoDataForCurrentUser}
                      />
                    ) : (
                      <EmptyState
                        type={isFiltered ? 'no_results' : 'empty'}
                        title={isFiltered ? 'No matching tickets' : 'No tickets in this queue'}
                        description={
                          isFiltered
                            ? 'Try resetting the filters or modifying your search keyword.'
                            : 'All tickets here have been resolved or moved.'
                        }
                        actionLabel={isFiltered ? 'Reset Filters' : '+ New Ticket'}
                        onAction={isFiltered ? resetFilters : onOpenCreateModal}
                      />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : activeViewMode === 'kanban' ? (
        /* Inline Kanban View */
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[380px] bg-slate-50/50 dark:bg-slate-900/30">
          {['Open', 'In Progress', 'Closed'].map((colStatus) => {
            const colTickets = filteredTickets.filter((t) => t.status === colStatus);
            return (
              <div
                key={colStatus}
                className="bg-white dark:bg-dark-surface rounded-xl border border-slate-200/80 dark:border-dark-border p-3.5 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-dark-text">
                      {colStatus}
                    </span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {colTickets.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[420px]">
                  {colTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => openTicketDetail(t.id)}
                      className="p-3 rounded-xl border border-slate-200/70 dark:border-dark-border hover:border-indigo-400 dark:hover:border-indigo-500/50 bg-white dark:bg-slate-900/60 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {t.id}
                        </span>
                        <span className="text-[10px] text-slate-400">{t.category}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-dark-text line-clamp-1">
                        {t.subject}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{t.customer?.name}</span>
                        <span className="font-semibold text-amber-600">{t.priority}</span>
                      </div>
                    </div>
                  ))}
                  {colTickets.length === 0 && (
                    <p className="text-center py-6 text-xs text-slate-400">
                      No tickets in {colStatus}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Inline Analytics summary */
        <div className="p-8 text-center space-y-3">
          <BarChart2 className="w-10 h-10 text-indigo-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text">
            Analytics Overview
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Overall response SLA is at 98.4% compliance with an average resolution speed of 18 minutes.
          </p>
          <button
            type="button"
            onClick={() => setActiveViewMode('list')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            ← Return to Table List
          </button>
        </div>
      )}

      {/* 5. Footer info bar */}
      <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-700 dark:text-slate-200 font-semibold">{filteredTickets.length}</strong> of{' '}
          <strong className="text-slate-700 dark:text-slate-200 font-semibold">{tabCounts[statusFilter] ?? tabCounts.All}</strong> tickets
        </span>
        {selectedTicketIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {selectedTicketIds.size} selected
            </span>
            {statusFilter === 'Trash' ? (
              <>
                <button
                  type="button"
                  onClick={handleBulkRestore}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Selected</span>
                </button>
                <button
                  type="button"
                  onClick={handleBulkPermanentDelete}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Permanently Purge</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleBulkMoveToTrash}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Move to Trash</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Permanent Purge Card Alert Dialog */}
      <ConfirmDialog
        isOpen={isBulkPurgeDialogOpen}
        onClose={() => setIsBulkPurgeDialogOpen(false)}
        onConfirm={handleConfirmBulkPurge}
        isLoading={isBulkPurging}
        title={`Permanently purge ${selectedTicketIds.size} selected ticket${selectedTicketIds.size > 1 ? 's' : ''}?`}
        description={
          <div className="space-y-2">
            <p>
              Are you sure you want to permanently purge these <strong className="font-semibold text-slate-800 dark:text-slate-200">{selectedTicketIds.size} tickets</strong> from Trash?
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-medium">
              All associated customer conversation replies and timeline audit records will be removed permanently. This action cannot be undone.
            </p>
          </div>
        }
        confirmLabel={`Purge ${selectedTicketIds.size} Ticket${selectedTicketIds.size > 1 ? 's' : ''}`}
        cancelLabel="Keep in Trash"
        variant="danger"
        icon={Trash2}
      />
    </div>
  );
}
