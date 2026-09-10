import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { X, AlertCircle } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    onClear,
    className,
    containerClassName,
    id,
    type = 'text',
    required,
    ...props
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={cn(
            'w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-dark-text text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-dark-border px-3.5 py-2 shadow-2xs transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500',
            Icon && 'pl-9',
            (onClear || error) && 'pr-9',
            error && 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900 dark:text-rose-300',
            className
          )}
          {...props}
        />
        {onClear && props.value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {error && !onClear && (
          <div className="absolute right-3 pointer-events-none text-rose-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium mt-0.5" role="alert">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    className,
    containerClassName,
    id,
    rows = 4,
    required,
    ...props
  },
  ref
) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        className={cn(
          'w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-dark-text text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-dark-border p-3 shadow-2xs transition-all duration-200 leading-relaxed resize-y',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500',
          error && 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium mt-0.5" role="alert">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});
