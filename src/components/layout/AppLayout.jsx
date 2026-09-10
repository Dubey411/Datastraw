import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTickets } from '../../context/TicketContext';
import { DashboardView } from '../features/dashboard/DashboardView';
import { TicketInbox } from '../features/tickets/TicketInbox';
import { TicketDetailPanel } from '../features/tickets/TicketDetailPanel';
import { CreateTicketModal } from '../features/tickets/CreateTicketModal';
import { CustomersView } from '../features/customers/CustomersView';
import { AnalyticsView } from '../features/analytics/AnalyticsView';
import { KnowledgeBaseView } from '../features/knowledge/KnowledgeBaseView';
import { SettingsView } from '../features/settings/SettingsView';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export function AppLayout() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    selectedTicket,
    closeTicketDetail,
    isCreateModalOpen,
    setIsCreateModalOpen,
  } = useTickets();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
      case 'tickets':
        return (
          <div className="space-y-4 max-w-7xl mx-auto animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-colors duration-200">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-dark-text">Support Tickets</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Full inbox stream. Filter by urgency, queue status, or search across customer issues.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={Plus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                + New Ticket
              </Button>
            </div>
            <TicketInbox onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          </div>
        );
      case 'customers':
        return <CustomersView onSelectCustomerTickets={() => setActiveView('tickets')} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Layout */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Ticket Detail Panel (Slide-over) */}
      {selectedTicket && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-2xs z-30 transition-opacity duration-300 animate-in fade-in"
            onClick={closeTicketDetail}
            aria-hidden="true"
          />
          <TicketDetailPanel
            ticket={selectedTicket}
            onClose={closeTicketDetail}
          />
        </>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
