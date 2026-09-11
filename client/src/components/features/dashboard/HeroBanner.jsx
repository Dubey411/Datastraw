import React from 'react';
import { Plus, BarChart2, Sparkles, LayoutDashboard, Link2 } from 'lucide-react';

export function HeroBanner({ onOpenCreateModal, onOpenAnalytics }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 shadow-xl min-h-[220px] sm:min-h-[240px] flex flex-col justify-between p-6 text-white select-none animate-fade-in-up">
      {/* High-res background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-[1.02]"
        style={{
          backgroundImage: `url('/hero_mountain.jpg')`,
        }}
      />

      {/* Atmospheric gradient vignettes */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

      {/* Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Greeting, Headline & CTAs */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-1.5">
            <span>Good evening, <strong className="text-white font-semibold">Shubham!</strong></span>
            <span>👋</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Great support builds<br className="hidden sm:inline" /> greater products.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300/90 max-w-lg leading-relaxed">
            Manage tickets, help customers, and make an impact — all in one place.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </button>

            <button
              type="button"
              onClick={onOpenAnalytics}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-900/80 active:scale-[0.98] backdrop-blur-md border border-white/15 text-slate-200 hover:text-white text-xs font-medium rounded-xl transition-all duration-200"
            >
              <BarChart2 className="w-3.5 h-3.5 text-slate-300" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Right Col: Quote & 3 Feature Chips */}
        <div className="lg:col-span-5 flex flex-col justify-center lg:items-end space-y-3 pt-2 lg:pt-0">
          <div className="text-left lg:text-right">
            <p className="text-xs text-slate-300 italic font-normal">
              "Support is not a cost center, it's a growth engine."
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">— Datastraw</p>
          </div>

          {/* 3 Translucent Feature Chips */}
          <div className="space-y-2 w-full sm:w-auto min-w-[200px]">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-white leading-tight">Faster resolutions</p>
                <p className="text-[10px] text-slate-400 leading-tight">Happier customers</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 flex-shrink-0">
                <LayoutDashboard className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-white leading-tight">Smarter insights</p>
                <p className="text-[10px] text-slate-400 leading-tight">Data-driven decisions</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-white leading-tight">Stronger products</p>
                <p className="text-[10px] text-slate-400 leading-tight">Built with feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
