import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useTickets } from '../../context/TicketContext';
import {
  LayoutDashboard,
  Inbox,
  Users,
  BarChart2,
  BookOpen,
  Settings,
  ChevronsLeft,
  PanelLeftOpen,
  MoreVertical,
  Sparkles,
  ArrowRight,
  X,
  Hexagon,
} from 'lucide-react';

export function Sidebar({ activeView, onViewChange, isOpen, onClose, onNavigate }) {
  const { tabCounts, currentAgent } = useTickets();
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
      badge: tabCounts?.All ?? 0,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
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

  const sidebarWidth = isCollapsed ? 'w-[72px]' : 'w-[250px]';

  const sidebarContent = (
    <div
      className={cn(
        'flex flex-col h-full bg-[#0B0E1B] text-slate-300 border-r border-slate-800/80 transition-all duration-300 ease-out select-none relative overflow-hidden',
        sidebarWidth
      )}
    >
      {/* Background Subtle Starfield & Cosmic Planet Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Faint Stars */}
        <div className="absolute top-12 left-10 w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute top-36 right-8 w-1 h-1 bg-indigo-300/50 rounded-full" />
        <div className="absolute top-52 left-6 w-1.5 h-1.5 bg-blue-200/30 rounded-full" />
        <div className="absolute bottom-64 right-12 w-1 h-1 bg-purple-200/40 rounded-full" />
        <div className="absolute bottom-40 left-8 w-1 h-1 bg-white/30 rounded-full" />

        {/* Planet with soft glowing purple aura */}
        <div
          className={cn(
            'absolute -left-10 top-[52%] -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-tr from-slate-950 via-[#1E1645] to-[#4338CA] shadow-[0_0_50px_rgba(99,102,241,0.25)] border border-indigo-500/20 opacity-80 pointer-events-none transition-all duration-300',
            isCollapsed && 'opacity-60 scale-90 -left-8'
          )}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
          <div className="absolute top-3 right-4 w-6 h-6 rounded-full bg-indigo-400/20 blur-sm" />
        </div>
      </div>

      {/* Brand Header */}
      {isCollapsed ? (
        <div className="h-16 flex items-center justify-center border-b border-slate-800/60 flex-shrink-0 relative z-10 w-full px-2">
          {/* Logo converted into Drawer Opening Bar Button when collapsed */}
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="group relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-300 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 hover:shadow-cyan-400/40 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
            title="Open Sidebar Drawer"
            aria-label="Open Sidebar Drawer"
          >
            {/* Drawer Opening Bar Icon */}
            <PanelLeftOpen className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />

            {/* Glowing cyan indicator dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#0B0E1B] shadow-sm shadow-cyan-400/80 animate-pulse" />

            {/* Floating Tooltip matching other collapsed icons */}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0B0E1B] text-white text-xs font-semibold rounded-lg shadow-2xl border border-slate-700/90 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-2">
              <PanelLeftOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Sidebar Drawer</span>
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                Click
              </kbd>
            </div>
          </button>
        </div>
      ) : (
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 flex-shrink-0 relative z-10">
          <div
            onClick={() => onNavigate?.('landing')}
            className={cn(
              'flex items-center gap-3 min-w-0',
              onNavigate && 'cursor-pointer group'
            )}
            title="Go to Datastraw Landing Page"
          >
            {/* Hexagonal Blue/Cyan Logo */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Hexagon className="w-4 h-4 fill-white/20 stroke-white stroke-[2.5]" />
            </div>

            <div className="min-w-0 animate-in fade-in duration-150">
              <span className="font-bold text-sm tracking-tight text-white block leading-tight truncate">
                Datastraw
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block truncate">
                Support CRM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile close button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Desktop Collapse Toggle << */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative z-10">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                type="button"
                onClick={() => {
                  onViewChange(item.id);
                  onClose?.();
                }}
                className={cn(
                  'w-full flex items-center px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-200 select-none relative group',
                  isCollapsed ? 'justify-center px-2' : 'justify-between',
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2 py-0.5 rounded-full transition-transform',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-950/90 text-indigo-300 border border-indigo-800/60'
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Dot Badge */}
                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0B0E1B]" />
                )}
              </button>

              {/* Tooltip for collapsed mode */}
              {isCollapsed && hoveredItem === item.id && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none border border-slate-700">
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade to Pro Card */}
      {!isCollapsed && (
        <div className="p-3.5 flex-shrink-0 relative z-10 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141829] to-[#0E1222] border border-indigo-500/20 shadow-xl space-y-2.5 relative overflow-hidden group">
            {/* Sparkle Glow Backdrop */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-white leading-tight">
                Better Support
              </h4>
              <h4 className="text-xs font-bold text-white leading-tight">
                Happier Customers
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Turn conversations into loyal customers with Datastraw.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onViewChange('settings')}
              className="w-full mt-1.5 py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* User Profile Pill at Bottom */}
      <div className="p-3 border-t border-slate-800/80 flex-shrink-0 relative z-10 bg-[#0B0E1B]">
        {(() => {
          const agentName = currentAgent?.name || 'Support Agent';
          const agentEmail = currentAgent?.email || 'shubham.dubey@datastraw.io';
          const initials = agentName
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'SD';

          return (
            <div
              onClick={() => onViewChange?.('settings')}
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer group',
                isCollapsed && 'justify-center p-1.5'
              )}
              title={`${agentName} (${agentEmail})`}
            >
              {/* Dynamic Avatar Initials */}
              <div className="w-8 h-8 rounded-full bg-indigo-700/80 border border-indigo-500/40 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {initials}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate leading-tight">
                    {agentName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                    {agentEmail}
                  </p>
                </div>
              )}

              {!isCollapsed && (
                <button
                  type="button"
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                  aria-label="User settings"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })()}
      </div>
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
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
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
