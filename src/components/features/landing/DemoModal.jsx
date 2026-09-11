import React, { useState } from 'react';
import { X, Play, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { DashboardPreviewMockup } from './DashboardPreviewMockup';

export function DemoModal({ isOpen, onClose, onLaunchApp, isDark = false }) {
  const [activeTab, setActiveTab] = useState('triage');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full max-w-4xl rounded-3xl border shadow-2xl z-10 overflow-hidden transition-all my-auto',
          isDark
            ? 'bg-[#0E1424] border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Datastraw Interactive Product Tour</h3>
              <p className="text-xs text-slate-400">See how modern support teams resolve tickets 2x faster</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'triage', label: 'Ticket Triaging', icon: Zap },
            { id: 'ai', label: 'AI Support Assistant', icon: Sparkles },
            { id: 'collab', label: 'Team Collaboration', icon: CheckCircle2 },
            { id: 'analytics', label: 'Analytics & SLA Tracking', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Showcase */}
        <div className="p-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800">
            <DashboardPreviewMockup isDark={isDark} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Experience real-time ticket synchronization, high-priority SLAs, customer profiles, and AI-assisted drafts.
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchApp();
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
