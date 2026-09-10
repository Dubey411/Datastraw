import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useTickets } from '../../context/TicketContext';
import {
  LayoutDashboard,
  Inbox,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  HelpCircle,
  ExternalLink,
  X,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function Sidebar({ activeView, onViewChange, isOpen, onClose }) {
  const { tabCounts } = useTickets();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Inbox,
      badge: tabCounts?.Open || 0,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: BookOpen,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const sidebarWidth = isCollapsed ? 'w-[68px]' : 'w-[240px]';

  const sidebarContent = (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-[#0E1420] border-r border-slate-200/80 dark:border-dark-border transition-all duration-300 ease-out select-none relative overflow-hidden',
        sidebarWidth
      )}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100 dark:border-dark-border flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xs flex-shrink-0 transition-transform duration-200 hover:scale-105">
            <Layers className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200 animate-in fade-in">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-dark-text block leading-tight truncate">
                Datastraw
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase block truncate">
                Support CRM
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2.5 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider animate-in fade-in duration-200">
            Workspace
          </div>
        )}
        {navItems.map((item, index) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                animation: `fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms forwards`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onViewChange(item.id);
                  onClose?.();
                }}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 group text-left select-none relative',
                  isCollapsed ? 'justify-center px-2' : 'justify-between',
                  isActive
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-dark-surface-hover'
                )}
              >
                {/* Active Left Indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-full animate-in fade-in slide-in-from-left duration-200"
                  />
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate transition-opacity duration-150">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-105',
                      item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Dot Badge */}
                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-dark-surface" />
                )}
              </button>

              {/* Tooltip for collapsed mode */}
              {isCollapsed && hoveredItem === item.id && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 pointer-events-none">
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Promo / Support Card */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-dark-border flex-shrink-0 animate-in fade-in duration-200">
          <div className="p-3 bg-slate-50 dark:bg-dark-surface rounded-xl border border-slate-200/70 dark:border-dark-border space-y-2 relative overflow-hidden group">
            {/* Subtle slow ambient glow effect */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-xl animate-pulse-subtle pointer-events-none" />

            <div className="flex items-center gap-2 text-slate-800 dark:text-dark-text relative z-10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-xs font-semibold">Pro SLA Enabled</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug relative z-10">
              Compliance is at 99.2% for high-priority queues.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] relative z-10">
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  onViewChange('knowledge');
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>Quick Guides</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">v2.5.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop collapsible sidebar */}
      <aside className="hidden md:flex flex-shrink-0 h-screen sticky top-0 z-30 animate-in slide-in-from-left duration-400 ease-out">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex animate-in slide-in-from-left duration-300 ease-out shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
