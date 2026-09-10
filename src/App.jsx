import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TicketProvider>
          <AppLayout />
        </TicketProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
