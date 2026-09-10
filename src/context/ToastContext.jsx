import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div 
        aria-live="assertive" 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
            info: <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />,
          };

          const borders = {
            success: 'border-emerald-200 bg-white/95 dark:bg-slate-900/95 dark:border-emerald-900/70 text-slate-900 dark:text-slate-100',
            error: 'border-rose-200 bg-white/95 dark:bg-slate-900/95 dark:border-rose-900/70 text-slate-900 dark:text-slate-100',
            warning: 'border-amber-200 bg-white/95 dark:bg-slate-900/95 dark:border-amber-900/70 text-slate-900 dark:text-slate-100',
            info: 'border-indigo-200 bg-white/95 dark:bg-slate-900/95 dark:border-indigo-900/70 text-slate-900 dark:text-slate-100',
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl dark:shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 ${borders[t.type] || borders.info}`}
              role="alert"
            >
              {icons[t.type]}
              <div className="flex-1 min-w-0">
                {t.title && <h4 className="text-sm font-semibold tracking-tight leading-tight">{t.title}</h4>}
                {t.message && <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
