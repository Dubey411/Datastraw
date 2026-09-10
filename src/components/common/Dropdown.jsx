import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export function Dropdown({
  trigger,
  items = [],
  value,
  onChange,
  align = 'left',
  className,
  menuClassName,
  placeholder = 'Select option',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedItem = items.find((item) => item.value === value);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => !disabled && setIsOpen(!isOpen)}>{trigger(isOpen, selectedItem)}</div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-xs font-medium text-slate-700 dark:text-dark-text rounded-xl shadow-2xs hover:bg-slate-50 dark:hover:bg-dark-surface-hover hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="truncate">{selectedItem ? selectedItem.label : placeholder}</span>
          <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200', isOpen && 'rotate-180')} />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-48 rounded-xl bg-white dark:bg-dark-surface p-1 border border-slate-200 dark:border-dark-border shadow-dropdown dark:shadow-dropdown-dark focus:outline-none animate-in fade-in zoom-in-[0.98] slide-in-from-top-1 duration-150',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
          role="menu"
        >
          {items.map((item) => {
            const isSelected = item.value === value;
            const ItemIcon = item.icon;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange?.(item.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg text-left transition-colors duration-150',
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-surface-hover hover:text-slate-900 dark:hover:text-white'
                )}
                role="menuitem"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {ItemIcon && <ItemIcon className={cn('w-3.5 h-3.5 flex-shrink-0', item.iconColor || 'text-slate-400')} />}
                  <span className="truncate">{item.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
