import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useTickets } from '../../context/TicketContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Home,
  Ticket,
  Users,
  BarChart2,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronDown,
  Crown,
  PanelLeftOpen,
  ArrowRight,
  X,
} from 'lucide-react';

function SoapBubble({ className, size = 40, style }) {
  return (
    <div
      className={cn(
        'rounded-full pointer-events-none select-none relative overflow-hidden',
        className
      )}
      style={{
        width: size,
        height: size,
        background: `
          radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.4) 18%, rgba(255, 255, 255, 0) 35%),
          radial-gradient(circle at 75% 75%, rgba(192, 132, 252, 0.45) 0%, rgba(129, 140, 248, 0.35) 30%, rgba(56, 189, 248, 0.25) 60%, transparent 80%),
          radial-gradient(circle at 25% 75%, rgba(244, 114, 182, 0.35) 0%, transparent 60%)
        `,
        boxShadow: `
          inset 0 0 10px rgba(255, 255, 255, 0.9),
          inset -3px -3px 8px rgba(168, 85, 247, 0.4),
          inset 3px 3px 8px rgba(56, 189, 248, 0.35),
          0 4px 15px rgba(168, 85, 247, 0.15)
        `,
        border: '1px solid rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(1px)',
        ...style,
      }}
    >
      <div
        className="absolute top-1 left-1.5 rounded-full border-t border-l border-white/90 pointer-events-none"
        style={{
          width: size * 0.45,
          height: size * 0.35,
          transform: 'rotate(-25deg)',
        }}
      />
    </div>
  );
}

export function Sidebar({ activeView, onViewChange, isOpen, onClose, onNavigate }) {
  const { tabCounts, currentAgent } = useTickets();
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      badge: tabCounts?.All ?? 12,
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
        'flex flex-col h-full transition-all duration-300 ease-out select-none relative overflow-hidden',
        isDark
          ? 'bg-[#0B0E1B] text-slate-300 border-r border-slate-800/80'
          : 'bg-white text-slate-700 border-r border-slate-200/90 shadow-xs',
        sidebarWidth
      )}
    >
      {/* Background Subtle Starfield / Light Atmosphere Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isDark ? (
          <>
            {/* Cosmic Faint Stars */}
            <div className="absolute top-12 left-10 w-1 h-1 bg-white/40 rounded-full" />
            <div className="absolute top-36 right-8 w-1 h-1 bg-indigo-300/50 rounded-full" />
            <div className="absolute top-52 left-6 w-1.5 h-1.5 bg-blue-200/30 rounded-full" />
            <div className="absolute bottom-64 right-12 w-1 h-1 bg-purple-200/40 rounded-full" />
            <div className="absolute bottom-40 left-8 w-1 h-1 bg-white/30 rounded-full" />

            {/* Dark Mode Cosmic Planet */}
            <div
              className={cn(
                'absolute -left-10 top-[52%] -translate-y-1/2 w-28 h-28 rounded-full pointer-events-none transition-all duration-300 overflow-hidden bg-gradient-to-tr from-slate-950 via-[#1E1645] to-[#4338CA] shadow-[0_0_50px_rgba(99,102,241,0.25)] border border-indigo-500/20 opacity-80',
                isCollapsed && 'opacity-60 scale-90 -left-8'
              )}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
              <div className="absolute top-3 right-4 w-6 h-6 rounded-full bg-indigo-400/20 blur-sm" />
            </div>
          </>
        ) : (
          <>
            {/* Light Mode Soft Ambient Pastel Bubbles Backdrop */}
            <img
              src="/sidebar_bubbles_light.jpg"
              alt="Pastel bubbles atmosphere"
              className="w-full h-full object-cover object-left opacity-25 mix-blend-multiply select-none pointer-events-none filter saturate-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/70 pointer-events-none" />

            {/* Strategically Placed Photorealistic Floating Soap Bubbles */}
            {!isCollapsed && (
              <>
                <SoapBubble size={84} className="absolute -top-6 -left-8 z-0 opacity-80" />
                <SoapBubble size={14} className="absolute top-[118px] left-[184px] z-0 opacity-75" />
                <SoapBubble size={38} className="absolute top-[110px] -right-3 z-0 opacity-80" />
                <SoapBubble size={42} className="absolute top-[335px] -right-3 z-0 opacity-85" />
                <SoapBubble size={16} className="absolute top-[385px] -right-1 z-0 opacity-70" />
                <SoapBubble size={34} className="absolute top-[510px] -left-4 z-0 opacity-80" />
                <SoapBubble size={14} className="absolute top-[580px] -left-2 z-0 opacity-75" />
              </>
            )}
          </>
        )}
      </div>

      {/* Brand Header */}
      {isCollapsed ? (
        <div
          className={cn(
            'h-16 flex items-center justify-center border-b flex-shrink-0 relative z-10 w-full px-2 transition-colors duration-200',
            isDark ? 'border-slate-800/60' : 'border-slate-100'
          )}
        >
          {/* Logo converted into Drawer Opening Bar Button when collapsed */}
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="group relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-300 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 hover:shadow-cyan-400/40 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
            title="Open Sidebar Drawer"
            aria-label="Open Sidebar Drawer"
          >
            <PanelLeftOpen className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
            <span
              className={cn(
                'absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 shadow-sm shadow-cyan-400/80 animate-pulse',
                isDark ? 'border-[#0B0E1B]' : 'border-white'
              )}
            />
            <div
              className={cn(
                'absolute left-full ml-3 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-2xl border whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-2',
                isDark
                  ? 'bg-[#0B0E1B] text-white border-slate-700/90'
                  : 'bg-white text-slate-800 border-slate-200 shadow-lg'
              )}
            >
              <PanelLeftOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Open Sidebar Drawer</span>
            </div>
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'h-16 px-4 flex items-center justify-between border-b flex-shrink-0 relative z-10 transition-colors duration-200',
            isDark ? 'border-slate-800/60' : 'border-slate-100'
          )}
        >
          <div
            onClick={() => onNavigate?.('landing')}
            className={cn(
              'flex items-center gap-2.5 min-w-0',
              onNavigate && 'cursor-pointer group'
            )}
            title="Go to Datastraw Landing Page"
          >
            {/* Datastraw 3D Isometric Cube Logo */}
            <svg
              className="w-8 h-8 flex-shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path d="M16 2.5L28 9L16 15.5L4 9L16 2.5Z" fill="#38BDF8" />
              <path d="M4 9L16 15.5V29.5L4 23V9Z" fill="#2563EB" />
              <path d="M16 15.5L28 9V23L16 29.5V15.5Z" fill="#6366F1" />
              <path d="M16 5.5L24 10L16 14.5L8 10L16 5.5Z" fill="#7DD3FC" fillOpacity="0.4" />
              <path d="M7 11.5L16 16.5V26.5L7 21.5V11.5Z" fill="#1D4ED8" fillOpacity="0.3" />
            </svg>

            <div className="min-w-0 animate-in fade-in duration-150">
              <span
                className={cn(
                  'font-bold text-[15px] tracking-tight block leading-tight truncate',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                Datastraw
              </span>
              <span
                className={cn(
                  'text-[11px] font-medium tracking-wide block truncate',
                  isDark ? 'text-cyan-400' : 'text-slate-400'
                )}
              >
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
                className={cn(
                  'md:hidden p-1.5 rounded-lg transition-colors',
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                )}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Desktop Collapse Toggle < */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className={cn(
                'hidden md:flex w-8 h-8 items-center justify-center rounded-xl border transition-colors shadow-2xs',
                isDark
                  ? 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-400 hover:text-slate-600'
              )}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-3.5 space-y-1 overflow-y-auto relative z-10">
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
                  'w-full flex items-center px-3.5 py-2.5 text-[13px] font-medium rounded-2xl transition-all duration-200 select-none relative group',
                  isCollapsed ? 'justify-center px-2' : 'justify-between',
                  isActive
                    ? isDark
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/25'
                      : 'bg-[#EEF2FF] text-[#4F46E5] font-semibold shadow-xs'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                )}
              >
                {/* Active Accent Bar on Left in Light Mode */}
                {isActive && !isDark && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4F46E5] rounded-r-full" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
                      isActive
                        ? isDark
                          ? 'text-white'
                          : 'text-[#4F46E5] fill-current'
                        : isDark
                          ? 'text-slate-400 group-hover:text-slate-200'
                          : 'text-slate-500 group-hover:text-slate-900'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'text-xs font-semibold px-2.5 py-0.5 rounded-full transition-transform',
                      isActive
                        ? isDark
                          ? 'bg-white/20 text-white'
                          : 'bg-[#EDE9FE] text-[#6366F1]'
                        : isDark
                          ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-800/60'
                          : 'bg-[#EDE9FE] text-[#6366F1]'
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Dot Badge */}
                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2',
                      isDark ? 'ring-[#0B0E1B]' : 'ring-white'
                    )}
                  />
                )}
              </button>

              {/* Tooltip for collapsed mode */}
              {isCollapsed && hoveredItem === item.id && (
                <div
                  className={cn(
                    'absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none border',
                    isDark
                      ? 'bg-slate-900 text-white border-slate-700'
                      : 'bg-white text-slate-800 border-slate-200 shadow-md'
                  )}
                >
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
          <div
            className={cn(
              'p-4 rounded-3xl shadow-lg space-y-3 relative overflow-hidden group transition-all duration-300',
              isDark
                ? 'bg-gradient-to-b from-[#141829] to-[#0E1222] border border-indigo-500/20 text-white shadow-black/40'
                : 'bg-white/80 backdrop-blur-md border border-white/90 shadow-xl shadow-indigo-100/50 text-slate-900'
            )}
          >
            {/* Light Mode Full Card Background Image */}
            {!isDark && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none opacity-50"
                  style={{
                    backgroundImage: "url('/sidebar_orb_light.png')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-white/20 pointer-events-none" />

                {/* Translucent soap bubbles floating inside card */}
                <SoapBubble size={30} className="absolute top-2 right-3 z-0 opacity-70" />
                <SoapBubble size={16} className="absolute top-12 right-6 z-0 opacity-60" />
                <SoapBubble size={24} className="absolute bottom-5 right-3 z-0 opacity-65" />
              </>
            )}

            {/* Sparkle Glow Backdrop (Dark Mode) */}
            {isDark && (
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl pointer-events-none bg-indigo-500/20" />
            )}

            <div className="relative z-10 space-y-2.5">
              {/* Crown Icon inside rounded box */}
              <div
                className={cn(
                  'w-9 h-9 rounded-2xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-105',
                  isDark
                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                    : 'bg-white/90 border-indigo-100 text-[#4F46E5] shadow-xs'
                )}
              >
                <Crown className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div>
                <h4
                  className={cn(
                    'text-[15px] font-bold tracking-tight leading-tight',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}
                >
                  Upgrade to Pro
                </h4>
                <p
                  className={cn(
                    'text-xs mt-1 leading-snug',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  )}
                >
                  Unlock advanced analytics & AI insights.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onViewChange('settings')}
                className="w-full mt-1.5 py-2.5 px-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Upgrade Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Pill & Bottom Artwork */}
      <div
        className={cn(
          'p-3 border-t flex-shrink-0 relative z-10 transition-colors duration-200',
          isDark
            ? 'border-slate-800/80 bg-[#0B0E1B]'
            : 'border-slate-100 bg-transparent'
        )}
      >
        {(() => {
          const agentName = currentAgent?.name || 'Shubham Dubey';
          const agentRole = currentAgent?.role || 'Support Agent';
          const initials = agentName
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'SD';

          return (
            <>
              <div
                onClick={() => onViewChange?.('settings')}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-2xl transition-colors cursor-pointer group',
                  isDark ? 'hover:bg-slate-800/60' : 'hover:bg-white/80 shadow-2xs hover:shadow-xs',
                  isCollapsed && 'justify-center p-1.5'
                )}
                title={`${agentName} (${agentRole})`}
              >
                {/* Dynamic Avatar with Active Status Dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shadow-xs transition-transform group-hover:scale-105',
                      isDark
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-[#E0E7FF] text-[#4F46E5]'
                    )}
                  >
                    {initials}
                  </div>
                  {/* Active Green Dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B0E1B]" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-semibold truncate leading-tight',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      {agentName}
                    </p>
                    <p
                      className={cn(
                        'text-xs truncate leading-tight mt-0.5',
                        isDark ? 'text-slate-400' : 'text-slate-400'
                      )}
                    >
                      {agentRole}
                    </p>
                  </div>
                )}

                {!isCollapsed && (
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                )}
              </div>

              {/* Light Mode Bottom Section: Iridescent Soap Bubble + Hand-drawn Marker Quote */}
              {!isDark && !isCollapsed && (
                <div className="relative mt-2 px-1 py-1 flex items-center justify-between select-none pointer-events-none overflow-hidden">
                  {/* Bottom-left Big Iridescent Soap Bubble */}
                  <div className="relative w-20 h-20 -ml-1 flex-shrink-0">
                    <div
                      className="w-full h-full rounded-full overflow-hidden shadow-lg shadow-indigo-200/40 border border-white/80 relative"
                      style={{
                        background: `
                          radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.35) 20%, transparent 40%),
                          radial-gradient(circle at 70% 75%, rgba(192, 132, 252, 0.5) 0%, rgba(129, 140, 248, 0.4) 35%, rgba(56, 189, 248, 0.3) 65%, transparent 85%),
                          radial-gradient(circle at 25% 75%, rgba(244, 114, 182, 0.4) 0%, transparent 60%)
                        `,
                        boxShadow:
                          'inset 0 0 16px rgba(255, 255, 255, 0.95), inset -4px -4px 12px rgba(168, 85, 247, 0.45), inset 4px 4px 12px rgba(56, 189, 248, 0.4), 0 6px 20px rgba(168, 85, 247, 0.18)',
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
                        style={{ backgroundImage: "url('/sidebar_orb_light.png')" }}
                      />
                      <div className="absolute top-2 left-3 w-8 h-5 rounded-full border-t-2 border-l border-white/90 transform -rotate-30" />
                    </div>
                  </div>

                  {/* Hand-drawn Marker Quote matching reference */}
                  <div className="flex-1 text-right pl-2 transform -rotate-10 select-none">
                    <div className="inline-block text-left font-['Caveat',cursive] leading-[1.05] text-[#818CF8] font-bold">
                      <span className="text-[18px] block tracking-wide">Support</span>
                      <span className="text-[18px] block tracking-wide ml-2">Builds</span>
                      <span className="text-[18px] block tracking-wide ml-1">Better People</span>
                      <svg
                        className="w-24 h-2 mt-0.5 -ml-1 text-[#818CF8]/80"
                        viewBox="0 0 100 8"
                        fill="none"
                      >
                        <path
                          d="M2 3C25 7 60 7 98 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </>
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
