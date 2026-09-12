import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from '../../../context/ToastContext';
import { DashboardPreviewMockup } from '../landing/DashboardPreviewMockup';
import { signInWithGoogle, isSupabaseConfigured } from '../../../services/supabaseClient';
import {
  Hexagon,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  Shield,
  Sun,
  Moon,
  Check,
  ArrowLeft,
} from 'lucide-react';

export function AuthPage({ initialMode = 'login', onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('shubham.dubey@datastraw.io');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Shubham Dubey');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        toast.success('Welcome back!', 'Signed in as Shubham Dubey.');
      } else {
        toast.success('Account created!', 'Welcome to Datastraw Support CRM.');
      }
      onNavigate('app');
    }, 600);
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    if (provider === 'Google') {
      try {
        if (isSupabaseConfigured) {
          sessionStorage.setItem('datastraw_auth_intent', 'app');
          toast.info('Connecting to Google...', 'Redirecting to Google secure authentication.');
          await signInWithGoogle();
          return;
        } else {
          toast.info('Google Sign-In', 'Logged in as Shubham Dubey (Add VITE_SUPABASE_ANON_KEY to client/.env for live OAuth redirect).');
          setTimeout(() => {
            setIsLoading(false);
            onNavigate('app');
          }, 400);
        }
      } catch (err) {
        console.error('Google OAuth error:', err);
        toast.error('Authentication Error', err.message || 'Failed to sign in with Google.');
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast.success(`Authenticated with ${provider}`, 'Logged in as Shubham Dubey.');
        onNavigate('app');
      }, 500);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsForgotOpen(false);
    toast.info('Password Reset Sent', `Reset instructions sent to ${forgotEmail}`);
    setForgotEmail('');
  };

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-300 select-none flex flex-col justify-between relative overflow-x-hidden',
        isDark ? 'bg-[#080B14] text-slate-100' : 'bg-[#FAFBFD] text-slate-900'
      )}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div
          className={cn(
            'absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25',
            isDark ? 'bg-indigo-600' : 'bg-indigo-300'
          )}
        />
        <div
          className={cn(
            'absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-20',
            isDark ? 'bg-purple-600' : 'bg-purple-200'
          )}
        />
      </div>

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-20">
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

        {/* Right switch link & theme toggle */}
        <div className="flex items-center gap-4 text-xs font-medium">
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

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={cn(
              'hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all',
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Auth Layout */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Social Proof, Floating Testimonial, 3D Mockup */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Support teams around the world trust Datastraw</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
              Better Support.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Happier
              </span>{' '}
              Customers.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              A modern customer support CRM to manage tickets, collaborate with your team, and deliver exceptional customer experiences — all in one place.
            </p>

            {/* 4 Micro Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div
                className={cn(
                  'p-2.5 rounded-xl border flex items-center gap-2',
                  isDark ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
                )}
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">Track & Resolve</div>
                  <div className="text-[9px] text-slate-400 truncate">Tickets efficiently</div>
                </div>
              </div>

              <div
                className={cn(
                  'p-2.5 rounded-xl border flex items-center gap-2',
                  isDark ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
                )}
              >
                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">Collaborate</div>
                  <div className="text-[9px] text-slate-400 truncate">With your team</div>
                </div>
              </div>

              <div
                className={cn(
                  'p-2.5 rounded-xl border flex items-center gap-2',
                  isDark ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
                )}
              >
                <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">Gain Insights</div>
                  <div className="text-[9px] text-slate-400 truncate">From real data</div>
                </div>
              </div>

              <div
                className={cn(
                  'p-2.5 rounded-xl border flex items-center gap-2',
                  isDark ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
                )}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">Build Loyalty</div>
                  <div className="text-[9px] text-slate-400 truncate">Through support</div>
                </div>
              </div>
            </div>

            {/* Testimonial card + Hand-drawn Arrow + Mini Dashboard Preview */}
            <div className="relative pt-12 sm:pt-14">
              {/* Floating Testimonial Card */}
              <div
                className={cn(
                  'absolute -top-4 left-2 sm:left-6 z-20 p-3.5 rounded-2xl border shadow-sm backdrop-blur-md max-w-[230px] hidden sm:block',
                  isDark
                    ? 'bg-slate-900/90 border-slate-700/80 text-white'
                    : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-indigo-950/5'
                )}
              >
                <p className="text-[11px] italic font-medium leading-snug text-slate-700 dark:text-slate-300">
                  "Datastraw has completely transformed how we support our customers."
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  — Product Team
                </p>
              </div>

              {/* Hand-drawn Curly Arrow pointing to dashboard */}
              <div className="absolute top-0 right-4 sm:right-10 hidden md:flex items-center gap-1.5 z-20 pointer-events-none select-none">
                <span className="font-handwriting text-xs text-indigo-500 dark:text-indigo-400 font-medium italic text-right leading-tight transform -rotate-6">
                  Turn support<br />into growth
                </span>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="text-indigo-500 dark:text-indigo-400">
                  <path
                    d="M 6 8 C 16 12, 24 18, 24 28"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 18 26 L 24 28 L 26 22"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Scaled Preview Mockup */}
              <div className="opacity-95 transform -rotate-1 hover:rotate-0 transition-transform duration-500 max-w-xl">
                <DashboardPreviewMockup isDark={isDark} />
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="pt-2 text-xs italic text-slate-500 dark:text-slate-400">
              “Great support builds greater products.” — Datastraw
            </div>
          </div>

          {/* Right Column: Floating Auth Form Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className={cn(
                'w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all duration-300 space-y-5',
                isDark
                  ? 'bg-[#0E1424] border-slate-800 shadow-black/60 text-white'
                  : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-950/10 text-slate-900'
              )}
            >
              {/* Brand Logo & Header */}
              <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md mx-auto">
                  <Hexagon className="w-5 h-5 fill-white/20 stroke-white stroke-[2.5]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mode === 'login'
                    ? 'Sign in to your account to continue'
                    : 'Get started with your free Datastraw account'}
                </p>
              </div>

              {/* Social Login Buttons: Google & GitHub */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                    isDark
                      ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
                  )}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                    isDark
                      ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
                  )}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider: or */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative px-3 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0E1424]">
                  or
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 pl-9 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 pl-9 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(true)}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me / Terms Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                  >
                    {mode === 'login' ? 'Remember me' : 'I agree to the Terms of Service & Privacy Policy'}
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign in' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Callout Box */}
              <div
                className={cn(
                  'p-3 rounded-2xl border flex items-center gap-3 text-xs',
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold leading-tight">Secure & encrypted</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Your data is protected with industry-standard security
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer: Trusted By */}
      <footer
        className={cn(
          'py-8 border-t text-center transition-colors duration-200 mt-auto',
          isDark ? 'border-slate-800/80 bg-[#060810]' : 'border-slate-200 bg-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            TRUSTED BY MODERN TEAMS
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Microsoft */}
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <span className="bg-[#F25022]" />
                <span className="bg-[#7FBA00]" />
                <span className="bg-[#00A4EF]" />
                <span className="bg-[#FFB900]" />
              </div>
              <span>Microsoft</span>
            </div>

            {/* Google */}
            <div className="font-bold text-xs sm:text-sm tracking-tight">
              Google
            </div>

            {/* Slack */}
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <span className="text-amber-500 font-black">#</span>
              <span>Slack</span>
            </div>

            {/* Notion */}
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <div className="w-3.5 h-3.5 rounded bg-current text-white dark:text-black flex items-center justify-center text-[9px] font-black">
                N
              </div>
              <span>Notion</span>
            </div>

            {/* Vercel */}
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <polygon points="12 2 22 20 2 20" />
              </svg>
              <span>Vercel</span>
            </div>

            {/* Stripe */}
            <div className="font-extrabold text-xs sm:text-sm tracking-tight italic text-indigo-600 dark:text-indigo-400">
              stripe
            </div>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'w-full max-w-sm p-6 rounded-3xl border shadow-2xl space-y-4',
              isDark ? 'bg-[#0E1424] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            <h3 className="text-base font-bold">Reset your password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered email and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
