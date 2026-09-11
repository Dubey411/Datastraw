import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Edit3,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  User,
  ChevronDown,
  MessageSquare,
  Bot,
  X,
} from 'lucide-react';
import { useTickets } from '../../../context/TicketContext';

export function RightSidebarPanel() {
  const { tickets, openTicketDetail } = useTickets();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');

  // Interactive AI prompt triggers
  const handlePromptClick = (promptText) => {
    setAiPrompt(promptText);
    simulateAiResponse(promptText);
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    simulateAiResponse(aiPrompt);
  };

  const simulateAiResponse = (query) => {
    setIsAiResponding(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsAiResponding(false);
      const q = query.toLowerCase();

      if (q.includes('summarize') || q.includes('open')) {
        setAiResponse({
          title: 'Open Tickets Summary',
          content:
            'You currently have 3 Open tickets requiring attention: TKT-005 (Dark mode request from Rahul Jain), TKT-003 (500 Error uploading file from Karan Thakur), and TKT-001 (SSO certificate expiration from Vikram Malhotra). Karan Thakur’s bug has the highest priority score.',
          actionLabel: 'View TKT-003',
          ticketId: 'TKT-003',
        });
      } else if (q.includes('draft') || q.includes('response')) {
        setAiResponse({
          title: 'Drafted Response for TKT-003',
          content:
            '"Hi Karan, thank you for reporting the 500 error during file upload. Our gateway team identified an attachment size threshold limit. We are provisioning an updated direct-to-S3 signed URL handler to resolve this for files over 15MB today."',
          actionLabel: 'Apply to TKT-003',
          ticketId: 'TKT-003',
        });
      } else if (q.includes('similar') || q.includes('find')) {
        setAiResponse({
          title: 'Similar Ticket Clusters',
          content:
            'Found 2 tickets related to Authentication/SSO: TKT-006 (SAML 401 password reset) and TKT-001 (SSO certificate rotation). Root cause pattern: IdP metadata expiration.',
          actionLabel: 'View TKT-006',
          ticketId: 'TKT-006',
        });
      } else {
        setAiResponse({
          title: 'AI Assistant Insight',
          content: `Analyzing queue for: "${query}". Overall response SLA is at 98.4% compliance. 2 tickets are currently in In Progress state.`,
          actionLabel: 'Browse All Tickets',
        });
      }
    }, 600);
  };

  // Support performance bar chart heights (normalized 0-100)
  const performanceBars = [
    { height: 50, label: 'Mon' },
    { height: 75, label: 'Tue' },
    { height: 35, label: 'Wed' },
    { height: 90, label: 'Thu' },
    { height: 60, label: 'Fri' },
    { height: 85, label: 'Sat' },
    { height: 100, label: 'Sun' },
    { height: 70, label: 'Mon' },
    { height: 40, label: 'Tue' },
    { height: 80, label: 'Wed' },
    { height: 55, label: 'Thu' },
    { height: 92, label: 'Fri' },
    { height: 65, label: 'Sat' },
    { height: 78, label: 'Sun' },
  ];

  return (
    <div className="space-y-5 select-none animate-fade-in-up">
      {/* 1. AI Support Assistant Card */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/80 dark:border-dark-border p-5 shadow-xs dark:shadow-card-dark transition-all">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text tracking-tight">
              AI Support Assistant
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            Beta
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Get instant help with ticket analysis, draft responses, and more.
        </p>

        {/* Input box with send button */}
        <form onSubmit={handleAiSubmit} className="mt-3.5 relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask anything about your tickets..."
            className="w-full bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-dark-text rounded-xl border border-slate-200/80 dark:border-dark-border pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!aiPrompt.trim() || isAiResponding}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white flex items-center justify-center shadow-sm transition-all"
            aria-label="Send query"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Dynamic AI Response Box */}
        {isAiResponding && (
          <div className="mt-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 animate-pulse">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span>Analyzing support tickets...</span>
          </div>
        )}

        {aiResponse && (
          <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-semibold text-indigo-950 dark:text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                {aiResponse.title}
              </span>
              <button
                type="button"
                onClick={() => setAiResponse(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {aiResponse.content}
            </p>
            {aiResponse.ticketId && (
              <button
                type="button"
                onClick={() => openTicketDetail(aiResponse.ticketId)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>{aiResponse.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* 3 Quick Prompt Buttons */}
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => handlePromptClick('Summarize open tickets')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-dark-border text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors group"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">Summarize open tickets</span>
          </button>

          <button
            type="button"
            onClick={() => handlePromptClick('Draft a response')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-dark-border text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors group"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">Draft a response</span>
          </button>

          <button
            type="button"
            onClick={() => handlePromptClick('Find similar tickets')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-dark-border text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors group"
          >
            <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">Find similar tickets</span>
          </button>
        </div>
      </div>

      {/* 2. Recent Activity Card */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/80 dark:border-dark-border p-5 shadow-xs dark:shadow-card-dark transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text tracking-tight">
            Recent Activity
          </h3>
          <a
            href="#view-all"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <span>→</span>
          </a>
        </div>

        {/* Timeline Items */}
        <div className="mt-3.5 space-y-3.5">
          {/* Item 1: Ticket Closed */}
          <div
            onClick={() => openTicketDetail('TKT-007')}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900 dark:text-dark-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Ticket closed
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                TKT-007 marked as closed
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                2 hours ago
              </span>
            </div>
          </div>

          {/* Item 2: Status updated */}
          <div
            onClick={() => openTicketDetail('TKT-006')}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900 dark:text-dark-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Status updated
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                TKT-006 moved to In Progress
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                4 hours ago
              </span>
            </div>
          </div>

          {/* Item 3: New ticket */}
          <div
            onClick={() => openTicketDetail('TKT-005')}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900 dark:text-dark-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  New ticket
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                TKT-005 created by Rahul Jain
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                5 hours ago
              </span>
            </div>
          </div>

          {/* Item 4: Customer replied */}
          <div
            onClick={() => openTicketDetail('TKT-004')}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900 dark:text-dark-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Customer replied
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                New reply on TKT-004
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                6 hours ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Support Performance Card */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/80 dark:border-dark-border p-5 shadow-xs dark:shadow-card-dark transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text tracking-tight">
            Support Performance
          </h3>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-dark-border px-2 py-0.5 rounded-lg cursor-pointer">
            <span>{selectedTimeframe}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* 14 Vertical Bars Chart */}
        <div className="h-16 flex items-end justify-between gap-1.5 px-1 py-1">
          {performanceBars.map((bar, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
            >
              <div
                className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-500/80 dark:hover:bg-indigo-400 rounded-full transition-all duration-300 ease-out cursor-pointer"
                style={{
                  height: `${bar.height}%`,
                }}
              />
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                {bar.height}%
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-dark-text tracking-tight block">
              98.4%
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Resolution rate
            </span>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-slate-900 dark:text-dark-text tracking-tight block">
              18m
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Avg. response
            </span>
          </div>
        </div>
      </div>

      {/* 4. Inspirational Quote Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F0EEFC] dark:bg-[#1C1A2E] border border-[#E4E0F8] dark:border-purple-900/40 p-5 text-slate-800 dark:text-purple-100 shadow-xs transition-all">
        {/* Decorative Mountain Curve SVG in bottom right */}
        <svg
          viewBox="0 0 160 80"
          className="absolute -bottom-2 -right-2 w-32 h-16 pointer-events-none text-purple-300/40 dark:text-purple-600/20"
          fill="currentColor"
        >
          <path d="M0,80 Q40,30 80,50 T160,20 L160,80 Z" />
        </svg>

        <div className="relative z-10 space-y-2">
          <span className="text-2xl font-serif text-indigo-600 dark:text-indigo-400 leading-none block">
            “
          </span>
          <p className="text-xs font-semibold leading-relaxed text-slate-800 dark:text-purple-100 italic">
            Happy customers are your best growth channel.
          </p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-purple-300/70">
            — Datastraw
          </p>
        </div>
      </div>
    </div>
  );
}
