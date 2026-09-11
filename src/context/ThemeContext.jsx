import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'datastraw_crm_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      console.warn('Failed to access theme localStorage:', e);
    }
    return 'light';
  });

  const applyTheme = useCallback((targetTheme, withTransition = false) => {
    const root = document.documentElement;

    if (withTransition) {
      root.classList.add('theme-transition');
    }

    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme);
    } catch (e) {
      console.warn('Failed to store theme preference:', e);
    }

    if (withTransition) {
      setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 350);
    }
  }, []);

  // Initial apply on mount without transition to prevent flash
  useEffect(() => {
    applyTheme(theme, false);
  }, []);

  // Listen to OS system changes if no explicit storage was set
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme, true);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme, true);
  };

  const setThemeMode = (mode) => {
    if (mode === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
      const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nextTheme = isDarkSystem ? 'dark' : 'light';
      setTheme(nextTheme);
      applyTheme(nextTheme, true);
    } else {
      setTheme(mode);
      applyTheme(mode, true);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
