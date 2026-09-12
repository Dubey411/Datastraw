import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon: Icon = AlertTriangle,
  isLoading = false,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60',
      confirmButton: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-2 focus:ring-rose-500/20',
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60',
      confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs focus:ring-2 focus:ring-amber-500/20',
    },
    primary: {
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60',
      confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs focus:ring-2 focus:ring-indigo-500/20',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Card Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-dark-surface text-left shadow-2xl transition-all w-full max-w-md my-8 border border-slate-200/80 dark:border-dark-border animate-in fade-in zoom-in-[0.97] duration-200 p-6 select-none"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon Box */}
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs',
                currentVariant.iconBg
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pr-4">
              <h3
                id="confirm-dialog-title"
                className="text-base font-bold text-slate-900 dark:text-dark-text tracking-tight leading-snug"
              >
                {title}
              </h3>
              <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all',
                currentVariant.confirmButton
              )}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
