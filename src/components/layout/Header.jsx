import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useTickets } from '../../context/TicketContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../common/Avatar';
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  RotateCcw,
  Command,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';

export function Header({ onOpenMobileMenu }) {
  const {
    searchQuery,
    setSearchQuery,
    currentAgent,
    restoreSampleData,
  } = useTickets();

  const { theme, toggleTheme, isDark } = useTheme();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Online');

  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Global keyboard shortcut: Ctrl+K or / to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listeners
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New response on TKT-001',
      description: 'Amit Sharma replied regarding corporate SSO verification',
      time: '12m ago',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 dark:text-indigo-400',
      unread: true,
    },
    {
      id: 2,
      title: 'Urgent Ticket Logged',
      description: 'FinPulse Labs reported 504 timeout on CSV sync (TKT-003)',
      time: '1h ago',
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/70 dark:text-rose-400',
      unread: true,
    },
    {
      id: 3,
      title: 'Refund Approved',
      description: 'Stripe webhook verified duplicate refund of $499 on TKT-004',
      time: '3h ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 dark:text-emerald-400',
      unread: false,
    },
  ];

  return (
    <header className="h-14 bg-white dark:bg-[#0E1420] border-b border-slate-200/80 dark:border-dark-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
      {/* Left: Mobile hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search with expansion on focus */}
        <div
          className={cn(
            'relative transition-all duration-300 ease-out w-full',
            isSearchFocused ? 'max-w-lg sm:max-w-xl' : 'max-w-sm sm:max-w-md'
          )}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search tickets, customers, or anything..."
            className={cn(
              'w-full bg-slate-50 dark:bg-[#151C2C] text-xs sm:text-sm text-slate-900 dark:text-dark-text rounded-xl border border-slate-200/90 dark:border-dark-border pl-9 pr-16 py-1.5 transition-all duration-200',
              'focus:bg-white dark:focus:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400',
              isSearchFocused && 'shadow-glow-indigo border-indigo-400 dark:border-indigo-500'
            )}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="hidden sm:flex absolute inset-y-0 right-0 pr-2.5 items-center pointer-events-none">
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 ml-3 flex-shrink-0">
        {/* Theme Sun/Moon Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Sun
              className={cn(
                'w-4 h-4 text-amber-500 transition-all duration-300 absolute',
                isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              )}
            />
            <Moon
              className={cn(
                'w-4 h-4 text-indigo-400 transition-all duration-300 absolute',
                isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              )}
            />
          </div>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {/* Pulsing indicator dot */}
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400 ring-2 ring-white dark:ring-dark-surface" />
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-dropdown dark:shadow-dropdown-dark p-0 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-dark-text">Notifications</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                    2 unread
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-dark-border max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        'p-3.5 flex items-start gap-3 hover:bg-slate-50/80 dark:hover:bg-dark-surface-hover transition-colors cursor-pointer',
                        n.unread && 'bg-indigo-50/30 dark:bg-indigo-950/20'
                      )}
                    >
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', n.color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-dark-text truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                          {n.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 text-center border-t border-slate-100 dark:border-dark-border bg-slate-50/40 dark:bg-slate-900/30">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Real-time synchronization active
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-dark-border hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            aria-label="User profile menu"
          >
            <Avatar
              name={currentAgent.name}
              size="sm"
              showStatus
              isOnline={agentStatus === 'Online'}
            />
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-dark-text leading-tight">
                {currentAgent.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {currentAgent.role}
              </div>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 hidden sm:block', isProfileOpen && 'rotate-180')} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-dropdown dark:shadow-dropdown-dark p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-slate-100 dark:border-dark-border mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-dark-text">{currentAgent.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentAgent.email}</p>
                <div className="mt-2 flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Availability:</span>
                  <button
                    type="button"
                    onClick={() => setAgentStatus(agentStatus === 'Online' ? 'Away' : 'Online')}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all',
                      agentStatus === 'Online'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    )}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', agentStatus === 'Online' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {agentStatus}
                  </button>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    restoreSampleData();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-surface-hover hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Reset Demo Tickets</span>
                </button>
                <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span>Fast SLA Mode</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
