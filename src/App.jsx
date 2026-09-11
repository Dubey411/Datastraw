import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/features/landing/LandingPage';
import { AuthPage } from './components/features/auth/AuthPage';

function AppContent() {
  const getRouteFromHash = () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (['landing', 'login', 'signup', 'app'].includes(hash)) {
      return hash;
    }
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (['landing', 'login', 'signup', 'app'].includes(hash)) {
        setCurrentRoute(hash);
      } else if (!hash) {
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

