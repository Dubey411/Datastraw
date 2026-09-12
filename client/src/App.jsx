import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/features/landing/LandingPage';
import { AuthPage } from './components/features/auth/AuthPage';

function AppContent() {
  const getRouteFromHash = () => {
    const rawHash = window.location.hash.replace(/^#/, '');
    if (rawHash.includes('access_token=') || rawHash.startsWith('app')) {
      return 'app';
    }
    const cleanRoute = rawHash.split('?')[0].split('&')[0];
    if (['landing', 'login', 'signup', 'app'].includes(cleanRoute)) {
      return cleanRoute;
    }
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#/, '');
      if (rawHash.includes('access_token=') || rawHash.startsWith('app')) {
        setCurrentRoute('app');
        return;
      }
      const cleanRoute = rawHash.split('?')[0].split('&')[0];
      if (['landing', 'login', 'signup', 'app'].includes(cleanRoute)) {
        setCurrentRoute(cleanRoute);
      } else if (!cleanRoute) {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  switch (currentRoute) {
    case 'landing':
      return <LandingPage onNavigate={handleNavigate} />;
    case 'login':
      return <AuthPage initialMode="login" onNavigate={handleNavigate} />;
    case 'signup':
      return <AuthPage initialMode="signup" onNavigate={handleNavigate} />;
    case 'app':
      return <AppLayout onNavigate={handleNavigate} />;
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TicketProvider>
          <AppContent />
        </TicketProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

