import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../context/ThemeContext';
import { DashboardPreviewMockup } from './DashboardPreviewMockup';
import { InteractiveGlobe } from './InteractiveGlobe';
import { DemoModal } from './DemoModal';
import {
  Hexagon,
  ArrowRight,
  Play,
  Check,
  Inbox,
  Users,
  BarChart3,
  Shield,
  ChevronDown,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';

export function LandingPage({ onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How fast can our team get started with Datastraw?',
      a: 'You can deploy Datastraw in less than 5 minutes. No complex backend configurations or lengthy sales cycles required.',
    },
    {
      q: 'Does Datastraw integrate with our existing stack?',
      a: 'Yes, Datastraw connects seamlessly with Okta, Slack, Google Workspace, GitHub, and custom webhooks with HMAC-SHA256 signature verification.',
    },
    {
      q: 'Can we try Datastraw before upgrading?',
      a: 'Absolutely! Our starter plan is free forever with up to 10 active tickets and core triaging workflows.',
    },
    {
      q: 'How does the AI Support Assistant work?',
      a: 'The built-in AI assistant automatically analyzes incoming ticket descriptions, detects sentiment and urgency, suggests canned replies, and surfaces duplicate issues.',
    },
  ];

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-300 select-none overflow-x-hidden relative',
        isDark ? 'bg-[#080B14] text-slate-100' : 'bg-[#FAFBFD] text-slate-900'
      )}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div
          className={cn(
            'absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30',
            isDark ? 'bg-indigo-600' : 'bg-indigo-400'
          )}
        />
        <div
          className={cn(
            'absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20',
            isDark ? 'bg-purple-600' : 'bg-purple-300'
          )}
        />
      </div>

      {/* 1. Top Navigation Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200',
          isDark
            ? 'bg-[#080B14]/80 border-slate-800/80'
            : 'bg-white/80 border-slate-200/70'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Hexagon className="w-4 h-4 fill-white/20 stroke-white stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight leading-none block">
                Datastraw
              </span>
              <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-semibold tracking-wider uppercase leading-none block mt-0.5">
                Support CRM
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-300 font-sans">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              How it works
            </a>
            <a href="#customers" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              Customers
            </a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              Security
            </a>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </nav>

          {/* Right Controls: Theme Toggle, Sign In, Get Started */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-xl border transition-all duration-200',
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              )}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Start free Primary Button */}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all duration-200 active:scale-95 font-sans"
            >
              <span>Start free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Column: Headline, Copy, CTAs */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Eyebrow: Section Label with 7px circle dot */}
              <div>
                <div className="type-eyebrow">
                  SUPPORT CRM &middot; MADE IN INDIA
                </div>
              </div>

              {/* Headline: Fraunces 520, clamp(38px, 5vw, 58px), single italic solid brand color emphasis */}
              <h1 className="type-h1">
                Every conversation. One inbox.{' '}
                <em>Resolved faster.</em>
              </h1>

              {/* Subtitle / Lede: Plus Jakarta Sans 18px, slate-500, max-width 56ch */}
              <p className="type-lede">
                Datastraw brings email, WhatsApp, live chat and calls into a single shared inbox so your support team resolves tickets with superhuman speed.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3.5 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all font-sans"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className={cn(
                    'px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all font-sans',
                    isDark
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800'
                      : 'bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50 shadow-xs'
                  )}
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600 dark:text-indigo-400" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Checkmarks */}
              <div className="pt-2 flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Deploy in minutes</span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: 3D Perspective Floating Dashboard Mockup */}
            <div className="lg:col-span-7 relative">
              {/* Hand-drawn Curly Arrow Annotation */}
              <div className="absolute -top-10 left-12 hidden md:flex items-center gap-2 z-20 pointer-events-none">
                <span className="font-handwriting text-sm text-indigo-600 dark:text-indigo-400 italic">
                  {isDark ? 'A better way to support' : 'All your support in one place'}
                </span>
                <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="text-indigo-500">
                  <path
                    d="M 5 10 Q 20 2 30 18 Q 33 22 36 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path d="M 32 24 L 37 24 L 35 18" stroke="currentColor" strokeWidth="1.8" fill="none" />
                </svg>
              </div>

              {/* Tilted Floating Mockup */}
              <div className="relative transform lg:rotate-1 hover:rotate-0 transition-transform duration-700">
                <DashboardPreviewMockup isDark={isDark} />

                {/* Floating Badge on bottom right */}
                <div
                  className={cn(
                    'absolute -bottom-4 -right-2 sm:-right-4 z-30 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105',
                    isDark
                      ? 'bg-slate-900/90 border-slate-700 text-white shadow-black/50'
                      : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-indigo-950/10'
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold leading-tight block">
                      {isDark ? 'Fast. Simple. Powerful.' : 'Faster support.'}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight block">
                      {isDark ? 'Built for high-velocity teams.' : 'Happier customers.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Logo Strip */}
      <section
        className={cn(
          'py-10 border-y transition-colors duration-200',
          isDark ? 'bg-[#0B101E]/60 border-slate-800/80' : 'bg-slate-50/70 border-slate-200/60'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
            TRUSTED BY BUILDERS, TEAMS AND MODERN COMPANIES
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Microsoft */}
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <span className="bg-[#F25022]" />
                <span className="bg-[#7FBA00]" />
                <span className="bg-[#00A4EF]" />
                <span className="bg-[#FFB900]" />
              </div>
              <span>Microsoft</span>
            </div>

            {/* Google */}
            <div className="font-bold text-sm sm:text-base tracking-tight">
              <span>Google</span>
            </div>

            {/* Slack */}
            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base">
              <span className="text-amber-500 font-black">#</span>
              <span>Slack</span>
            </div>

            {/* Stripe */}
            <div className="font-extrabold text-sm sm:text-base tracking-tight italic text-indigo-600 dark:text-indigo-400">
              stripe
            </div>

            {/* Vercel */}
            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="12 2 22 20 2 20" />
              </svg>
              <span>Vercel</span>
            </div>

            {/* Notion */}
            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base">
              <div className="w-4 h-4 rounded bg-current text-white dark:text-black flex items-center justify-center text-[10px] font-black">
                N
              </div>
              <span>Notion</span>
            </div>

            {/* Linear */}
            <div className="font-bold text-sm sm:text-base tracking-tight">
              Linear
            </div>

            {/* Spotify */}
            <div className="font-bold text-sm sm:text-base tracking-tight">
              Spotify
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4 Feature Cards Row */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-left max-w-2xl space-y-3">
          <div className="type-eyebrow">
            POWERFUL CAPABILITIES
          </div>
          <h2 className="type-h2">
            Everything you need to deliver <em>exceptional support.</em>
          </h2>
          <p className="type-lede">
            Engineered for high-velocity teams who refuse to compromise on customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Ticket Management */}
          <div
            className={cn(
              'p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg space-y-4',
              isDark
                ? 'bg-[#0E1424] border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 shadow-xs'
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="type-h3">Effortless Ticket Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Create, track, and resolve tickets with complete visibility across all channels.
            </p>
          </div>

          {/* Card 2: Collaboration */}
          <div
            className={cn(
              'p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg space-y-4',
              isDark
                ? 'bg-[#0E1424] border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 shadow-xs'
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="type-h3">Collaborate Seamlessly</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Work together with your team and never miss a critical customer message.
            </p>
          </div>

          {/* Card 3: Insights */}
          <div
            className={cn(
              'p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg space-y-4',
              isDark
                ? 'bg-[#0E1424] border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 shadow-xs'
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="type-h3">Insights that Matter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Turn support data into actionable insights, SLA tracking, and better decisions.
            </p>
          </div>

          {/* Card 4: Happier Customers */}
          <div
            className={cn(
              'p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg space-y-4',
              isDark
                ? 'bg-[#0E1424] border-slate-800 hover:border-indigo-500/40'
                : 'bg-white border-slate-200/80 hover:border-indigo-300 shadow-xs'
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="type-h3">Happier Customers</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Deliver faster, more personalized support that builds lasting loyalty.
            </p>
          </div>
        </div>
      </section>

      {/* 5. "Built for teams that care" Section */}
      <section className="py-20 border-t border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: 3D Animated Globe with Customer Avatars */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveGlobe isDark={isDark} />
            </div>

            {/* Right: Copy & 4 Big Metrics */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="type-eyebrow">
                  MORE THAN A TOOL
                </div>

                <h2 className="type-h2">
                  Built for teams that <em>care.</em>
                </h2>

                <p className="type-lede">
                  Whether you're a startup or an enterprise, Datastraw gives you the tools to provide world-class support, strengthen customer relationships, and grow faster.
                </p>
              </div>

              {/* 4 Metric Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-display font-semibold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                    10K+
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-sans">
                    Tickets resolved
                  </div>
                </div>

                <div>
                  <div className="font-display font-semibold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                    98.4%
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-sans">
                    Customer satisfaction
                  </div>
                </div>

                <div>
                  <div className="font-display font-semibold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                    2x
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-sans">
                    Faster response time
                  </div>
                </div>

                <div>
                  <div className="font-display font-semibold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                    100%
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-sans">
                    Focus on your customers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-20 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="type-eyebrow justify-center">
              TRANSPARENT PRICING
            </div>
            <h2 className="type-h2">
              Simple, transparent <em>pricing.</em>
            </h2>
            <p className="type-lede mx-auto">
              Start with our free plan and scale as your support operations grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div
              className={cn(
                'p-6 rounded-3xl border space-y-5 flex flex-col justify-between',
                isDark ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="type-h3">Starter</h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">Perfect for early teams</p>
                </div>
                <div className="text-3xl font-display font-bold">$0</div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-sans">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Up to 3 team members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Standard ticket inbox
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Basic search & filtering
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('app')}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-sans"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro - Featured */}
            <div
              className={cn(
                'p-6 rounded-3xl border-2 border-indigo-600 relative space-y-5 flex flex-col justify-between shadow-xl',
                isDark ? 'bg-[#10172D]' : 'bg-white'
              )}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                Most Popular
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="type-h3">Pro</h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">For growing customer success teams</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-bold">$29</span>
                  <span className="text-xs text-slate-400 font-sans">/ agent / mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-sans">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500" /> Unlimited tickets & queues
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500" /> AI Support Assistant Beta
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500" /> Advanced SLAs & sparklines
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500" /> Kanban & Table views
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all font-sans"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div
              className={cn(
                'p-6 rounded-3xl border space-y-5 flex flex-col justify-between',
                isDark ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="type-h3">Enterprise</h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">Tailored for large organizations</p>
                </div>
                <div className="text-3xl font-display font-bold">Custom</div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-sans">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Dedicated SLA guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Custom SAML / SSO integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 24/7 dedicated account manager
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('app')}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-sans"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion Section */}
      <section className="py-20 border-t border-slate-100 dark:border-slate-800/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="type-eyebrow justify-center">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="type-h2">
              Everything you need to <em>know.</em>
            </h2>
            <p className="type-lede mx-auto">
              Everything you need to know about Datastraw Support CRM
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={cn(
                    'rounded-2xl border transition-colors overflow-hidden',
                    isDark ? 'border-slate-800 bg-[#0E1424]' : 'border-slate-200/80 bg-white'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2',
                        isOpen && 'rotate-180 text-indigo-600'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 p-8 sm:p-12 text-center text-white shadow-2xl space-y-5">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="type-h2 text-white">
              Ready to elevate your <em>customer support?</em>
            </h2>
            <p className="type-lede text-indigo-100 mx-auto">
              Join leading tech companies worldwide. Free forever for starter teams.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('app')}
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 text-xs sm:text-sm font-bold shadow-lg hover:bg-slate-50 active:scale-95 transition-all font-sans"
            >
              Open Live Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="px-6 py-3 rounded-xl bg-indigo-950/40 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-950/60 transition-all font-sans"
            >
              Start free &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer
        className={cn(
          'py-12 border-t text-xs transition-colors duration-200',
          isDark ? 'border-slate-800/80 bg-[#060810] text-slate-500' : 'border-slate-200 bg-white text-slate-400'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Hexagon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Datastraw Support CRM</span>
            <span>© 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" onClick={() => onNavigate('app')} className="hover:text-indigo-600">
              Dashboard
            </button>
            <button type="button" onClick={() => onNavigate('login')} className="hover:text-indigo-600">
              Sign In
            </button>
            <button type="button" onClick={() => onNavigate('signup')} className="hover:text-indigo-600">
              Sign Up
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Tour Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchApp={() => onNavigate('app')}
        isDark={isDark}
      />
    </div>
  );
}
