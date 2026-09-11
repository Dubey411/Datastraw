import React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { cn } from '../../../utils/cn';

export function InteractiveGlobe({ isDark = false, className }) {
  // Pinned representative avatar nodes
  const nodes = [
    { top: '24%', left: '26%', initials: 'SD', name: 'Shubham', bg: 'bg-indigo-600' },
    { top: '38%', left: '72%', initials: 'AK', name: 'Amit', bg: 'bg-blue-600' },
    { top: '56%', left: '34%', initials: 'PR', name: 'Pooja', bg: 'bg-rose-500' },
    { top: '65%', left: '80%', initials: 'RJ', name: 'Rahul', bg: 'bg-emerald-600' },
  ];

  return (
    <div className={cn('relative w-full aspect-square max-w-[440px] mx-auto select-none', className)}>
      {/* Outer Glow / Atmospheric aura */}
      <div
        className={cn(
          'absolute inset-4 rounded-full blur-3xl pointer-events-none transition-all duration-700',
          isDark ? 'bg-indigo-600/15' : 'bg-indigo-400/20'
        )}
      />

      {/* SVG Geometric Wireframe Globe */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10 transition-transform duration-700 hover:rotate-3"
      >
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDark ? '#4338CA' : '#818CF8'} stopOpacity={isDark ? 0.25 : 0.15} />
            <stop offset="70%" stopColor={isDark ? '#1E1B4B' : '#E0E7FF'} stopOpacity={isDark ? 0.1 : 0.05} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="orbitStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={isDark ? '#6366F1' : '#4F46E5'} stopOpacity="0.6" />
            <stop offset="100%" stopColor={isDark ? '#818CF8' : '#38BDF8'} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient Filled Globe Backing */}
        <circle cx="200" cy="200" r="160" fill="url(#globeGlow)" />

        {/* Outer Circular Boundary */}
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke={isDark ? '#312E81' : '#C7D2FE'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Longitudinal Ellipses */}
        <ellipse
          cx="200"
          cy="200"
          rx="120"
          ry="160"
          fill="none"
          stroke={isDark ? '#3730A3' : '#E0E7FF'}
          strokeWidth="1"
          opacity="0.7"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="70"
          ry="160"
          fill="none"
          stroke={isDark ? '#4338CA' : '#E0E7FF'}
          strokeWidth="1"
          opacity="0.8"
        />
        <line
          x1="200"
          y1="40"
          x2="200"
          y2="360"
          stroke={isDark ? '#4F46E5' : '#C7D2FE'}
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Latitudinal Ellipses */}
        <ellipse
          cx="200"
          cy="200"
          rx="160"
          ry="110"
          fill="none"
          stroke={isDark ? '#3730A3' : '#E0E7FF'}
          strokeWidth="1"
          opacity="0.7"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="160"
          ry="55"
          fill="none"
          stroke={isDark ? '#4338CA' : '#E0E7FF'}
          strokeWidth="1"
          opacity="0.8"
        />
        <line
          x1="40"
          y1="200"
          x2="360"
          y2="200"
          stroke={isDark ? '#4F46E5' : '#C7D2FE'}
          strokeWidth="1.2"
          opacity="0.9"
        />

        {/* Orbit Ring Angle */}
        <ellipse
          cx="200"
          cy="200"
          rx="185"
          ry="75"
          transform="rotate(-25 200 200)"
          fill="none"
          stroke="url(#orbitStroke)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* Dot Matrix Mesh on Coordinates */}
        {[
          [150, 110], [250, 110], [130, 170], [180, 160], [220, 160], [270, 170],
          [140, 230], [190, 240], [240, 240], [280, 220], [170, 290], [230, 290]
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="2"
            fill={isDark ? '#818CF8' : '#6366F1'}
            opacity="0.6"
          />
        ))}
      </svg>

      {/* Floating Node Avatars */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ top: node.top, left: node.left }}
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-indigo-500/40 animate-ping opacity-75" />

          {/* Avatar circle */}
          <div
            className={cn(
              'relative w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-lg ring-2 transition-transform duration-300 group-hover:scale-110',
              node.bg,
              isDark ? 'ring-slate-900 shadow-indigo-950' : 'ring-white shadow-indigo-200'
            )}
          >
            {node.initials}
          </div>

          {/* Tooltip on hover */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-30 animate-in fade-in zoom-in-95',
              isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-800 border border-slate-200'
            )}
          >
            {node.name}
          </div>
        </div>
      ))}

      {/* Floating Badge: "Global Support / For a better tomorrow" */}
      <div
        className={cn(
          'absolute bottom-4 left-4 z-20 p-3 rounded-2xl border backdrop-blur-md shadow-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 animate-bounce-subtle',
          isDark
            ? 'bg-slate-900/80 border-slate-700/80 text-white shadow-black/40'
            : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-indigo-950/10'
        )}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold leading-tight">Global Support</div>
          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
            For a better tomorrow
          </div>
        </div>
      </div>
    </div>
  );
}
