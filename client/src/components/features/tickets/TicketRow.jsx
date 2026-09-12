import React from 'react';
import { cn } from '../../../utils/cn';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../common/Badge';
import { MoreHorizontal, Trash2 } from 'lucide-react';

export function TicketRow({
  ticket,
  isSelected,
  isChecked = false,
  onToggleCheck,
  onSelect,
  index = 0,
}) {
  // Format relative timestamp to match reference screenshot style
  const formatTime = (isoString) => {
    if (!isoString) return 'Yesterday';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1) return `${diffDays} days ago`;
    return 'Yesterday';
  };

  // Customer initials
  const getInitials = (name) => {
    if (!name) return 'CU';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Avatar background colors matching reference screenshot
  const getAvatarBg = (name) => {
    const initials = getInitials(name);
    switch (initials) {
      case 'PR':
        return 'bg-rose-500 text-white';
      case 'AK':
        return 'bg-teal-600 text-white';
      case 'RJ':
        return 'bg-emerald-600 text-white';
      case 'NP':
        return 'bg-purple-600 text-white';
      case 'KT':
        return 'bg-pink-600 text-white';
      case 'SC':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  return (
    <tr
      onClick={() => onSelect(ticket.id)}
      className={cn(
        'group transition-colors duration-150 cursor-pointer border-b border-slate-100 dark:border-dark-border text-xs select-none',
        'hover:bg-slate-50/80 dark:hover:bg-slate-800/50',
        isSelected && 'bg-indigo-50/50 dark:bg-indigo-950/40',
        isChecked && 'bg-indigo-50/30 dark:bg-indigo-950/30'
      )}
    >
      {/* Checkbox */}
      <td
        className="py-3.5 pl-4 pr-2 w-10 text-center"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCheck?.(ticket.id);
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {}}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
        />
      </td>

      {/* Ticket ID # */}
      <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
        <span className="font-mono text-xs tracking-tight font-medium text-slate-900 dark:text-slate-100">{ticket.id}</span>
      </td>

      {/* Customer Avatar & Name & Email */}
      <td className="py-3.5 px-3 min-w-[180px]">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0 shadow-2xs',
              getAvatarBg(ticket.customer?.name)
            )}
          >
            {getInitials(ticket.customer?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-dark-text truncate leading-tight">
              {ticket.customer?.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
              {ticket.customer?.email}
            </p>
          </div>
        </div>
      </td>

      {/* Subject & snippet */}
      <td className="py-3.5 px-3 max-w-[280px]">
        <p className="text-xs font-semibold text-slate-900 dark:text-dark-text truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {ticket.subject}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
          {ticket.description}
        </p>
      </td>

      {/* Status */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        {ticket.isDeleted ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 shadow-2xs">
            <Trash2 className="w-3 h-3" />
            <span>In Trash</span>
          </span>
        ) : (
          <StatusBadge status={ticket.status} size="sm" />
        )}
      </td>

      {/* Priority */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <PriorityBadge priority={ticket.priority} size="sm" />
      </td>

      {/* Category */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <CategoryBadge category={ticket.category} />
      </td>

      {/* Updated */}
      <td className="py-3.5 px-3 whitespace-nowrap text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        {ticket.displayUpdated || formatTime(ticket.updatedAt || ticket.createdAt)}
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-2 pr-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(ticket.id);
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="More ticket actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

