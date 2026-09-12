import React, { useState } from 'react';
import { useTickets } from '../../../context/TicketContext';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import { Avatar } from '../../common/Avatar';
import { Button } from '../../common/Button';
import {
  User,
  Bell,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export function SettingsView() {
  const { currentAgent, restoreSampleData } = useTickets();
  const { theme, isDark, setThemeMode } = useTheme();
  const toast = useToast();

  const [notifications, setNotifications] = useState({
    urgentSms: true,
    emailDailyDigest: true,
    slaWarning: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Preferences Saved', 'Your CRM settings have been updated.');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-colors duration-200">
        <div className="type-eyebrow mb-1">CONFIGURATION</div>
        <h1 className="type-h2 !text-2xl sm:!text-3xl text-slate-900 dark:text-dark-text tracking-tight">
          Workspace <em>Settings & Profile</em>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your support agent credentials, theme appearance, and notification rules.
        </p>
      </div>

      {/* Theme Appearance Selector */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-dark-border pb-3">
          <Sun className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="type-h3 !text-sm">Theme Appearance</h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize the CRM appearance. Choose between crisp light mode, futuristic dark navy mode, or follow your operating system preference.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
              !isDark
                ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface-hover'
            }`}
          >
            <Sun className={`w-5 h-5 ${!isDark ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-900 dark:text-dark-text">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
              isDark
                ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface-hover'
            }`}
          >
            <Moon className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-900 dark:text-dark-text">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeMode('system')}
            className="p-3 rounded-xl border border-slate-200 dark:border-dark-border text-center hover:bg-slate-50 dark:hover:bg-dark-surface-hover transition-all flex flex-col items-center gap-2"
          >
            <Laptop className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-900 dark:text-dark-text">System Sync</span>
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-dark-border pb-3">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-dark-text">Agent Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          <Avatar name={currentAgent.name} size="xl" showStatus isOnline />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text">{currentAgent.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentAgent.email}</p>
            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              {currentAgent.role}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Rules */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-dark-border pb-3">
          <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-dark-text">Notifications & Alerts</h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-dark-border">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-dark-text">Urgent Ticket Escalations</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive instant notification when P1 / Urgent ticket is logged</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.urgentSms}
              onChange={() => toggleNotif('urgentSms')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-indigo-500"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-dark-text">SLA Breach Warnings</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Alert agent when response timer reaches 75% of target SLA threshold</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.slaWarning}
              onChange={() => toggleNotif('slaWarning')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-indigo-500"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-dark-text">Daily Digest Summary</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Send an 8:00 AM overview of open queues and pending customer replies</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailDailyDigest}
              onChange={() => toggleNotif('emailDailyDigest')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" variant="primary" isLoading={isSaving} onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark space-y-3 transition-colors duration-200">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-dark-border pb-3">
          <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-dark-text">Reset Demo Data</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Restore the CRM tickets and timeline events back to initial assessment seed data (TKT-001 through TKT-005). Useful for testing fresh review flows.
        </p>
        <div>
          <Button size="sm" variant="outline" onClick={restoreSampleData} icon={RotateCcw}>
            Restore Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
}
