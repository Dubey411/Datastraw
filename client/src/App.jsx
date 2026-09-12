import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/features/landing/LandingPage';
import { AuthPage } from './components/features/auth/AuthPage';

import { useTickets } from './context/TicketContext';

function AppContent() {
  const { currentAgent } = useTickets();

  const getRouteFromHash = () => {
    // Check if returning from OAuth (code query param, access_token hash, or auth_intent)
    const isOAuthReturn =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token=') ||
      sessionStorage.getItem('datastraw_auth_intent') === 'app';

    if (isOAuthReturn) {
      sessionStorage.removeItem('datastraw_auth_intent');
      return 'app';
    }

    const rawHash = window.location.hash.replace(/^#/, '');
    if (rawHash.startsWith('app')) {
      return 'app';
    }
    const cleanRoute = rawHash.split('?')[0].split('&')[0];
    if (['landing', 'login', 'signup', 'app'].includes(cleanRoute)) {
      return cleanRoute;
    }

    // If already logged in with a real Google account, default to app
    try {
      const savedUser = localStorage.getItem('datastraw_crm_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.email && parsed.email !== 'shubham.dubey@datastraw.io') {
          return 'app';
        }
      }
    } catch (_) {}

    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When a real user logs in or completes OAuth, automatically route to app if on auth or landing
  useEffect(() => {
    if (currentAgent?.email && currentAgent.email !== 'shubham.dubey@datastraw.io') {
      if (
        currentRoute === 'login' ||
        currentRoute === 'signup' ||
        window.location.search.includes('code=') ||
        window.location.hash.includes('access_token=')
      ) {
        handleNavigate('app');
      }
    }
  }, [currentAgent?.email, currentRoute]);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.location.hash = route;
    if (route === 'app' && window.location.search.includes('code=')) {
      window.history.replaceState(null, '', window.location.pathname + '#app');
    }
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

