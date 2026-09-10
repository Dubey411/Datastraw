import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_TICKETS, INITIAL_CUSTOMERS } from '../data/initialData';
import { useToast } from './ToastContext';

const TicketContext = createContext(null);

const STORAGE_KEY = 'datastraw_crm_tickets_v1';
const CURRENT_AGENT = {
  name: "Shubham Dubey",
  email: "shubham.dubey@datastraw.io",
  role: "Support Agent",
};

export function TicketProvider({ children }) {
  const toast = useToast();
  
  // Initialize tickets from localStorage or default seed
  const [tickets, setTickets] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load tickets from localStorage:', e);
    }
    return INITIAL_TICKETS;
  });

  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Open' | 'In Progress' | 'Closed'
  const [priorityFilter, setPriorityFilter] = useState('All'); // 'All' | 'Urgent' | 'High' | 'Medium' | 'Low'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'priority' | 'recently_updated'

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Failed to save tickets to localStorage:', e);
    }
  }, [tickets]);

  // Selected ticket memo
  const selectedTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'Open').length;
    const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
    const closed = tickets.filter((t) => t.status === 'Closed').length;

    return {
      total,
      open,
      inProgress,
      closed,
      openTrend: '+8% this week',
      inProgressTrend: 'Avg response 18m',
      closedTrend: '98.4% resolution rate',
    };
  }, [tickets]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: tickets.length,
      Open: tickets.filter((t) => t.status === 'Open').length,
      'In Progress': tickets.filter((t) => t.status === 'In Progress').length,
      Closed: tickets.filter((t) => t.status === 'Closed').length,
    };
  }, [tickets]);

  // Filtered & Sorted Tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // Status tab filter
        if (statusFilter !== 'All' && ticket.status !== statusFilter) {
          return false;
        }
        // Priority filter
        if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) {
          return false;
        }
        // Category filter
        if (categoryFilter !== 'All' && ticket.category !== categoryFilter) {
          return false;
        }
        // Debounced Search: Ticket ID, Customer Name, Email, Subject, Description
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = ticket.id.toLowerCase().includes(q);
          const matchSubject = ticket.subject.toLowerCase().includes(q);
          const matchDesc = ticket.description.toLowerCase().includes(q);
          const matchCustomerName = ticket.customer?.name.toLowerCase().includes(q);
          const matchCustomerEmail = ticket.customer?.email.toLowerCase().includes(q);
          if (!matchId && !matchSubject && !matchDesc && !matchCustomerName && !matchCustomerEmail) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'recently_updated') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === 'priority') {
          const rank = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        return 0;
      });
  }, [tickets, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy]);

  // Actions
  const openTicketDetail = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const closeTicketDetail = () => {
    setSelectedTicketId(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setSortBy('newest');
  };

  const isFiltered = useMemo(() => {
    return searchQuery !== '' || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || sortBy !== 'newest';
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // Create Ticket with validation & simulation
  const createTicket = async (ticketData) => {
    setIsLoading(true);
    // Simulate brief asynchronous processing
    await new Promise((resolve) => setTimeout(resolve, 350));

    const nextNumber = tickets.length + 1;
    const formattedId = `TKT-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newTicket = {
      id: formattedId,
      subject: ticketData.subject.trim(),
      description: ticketData.description.trim(),
      status: 'Open',
      priority: ticketData.priority || 'Medium',
      category: ticketData.category || 'General',
      customer: {
        name: ticketData.customerName.trim(),
        email: ticketData.customerEmail.trim(),
        company: ticketData.customerCompany?.trim() || 'Direct Client',
        role: 'Customer',
        avatarBg: 'bg-indigo-600',
      },
      assignee: CURRENT_AGENT,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `act-${Date.now()}-1`,
          type: 'customer_message',
          author: {
            name: ticketData.customerName.trim(),
            email: ticketData.customerEmail.trim(),
            role: 'Customer',
          },
          timestamp: now,
          content: ticketData.description.trim(),
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setIsLoading(false);
    setIsCreateModalOpen(false);
    setSelectedTicketId(formattedId);

    toast.success('Ticket Created', `${formattedId} — "${ticketData.subject}" has been logged successfully.`);
    return newTicket;
  };

  // Update Status
  const updateTicketStatus = (ticketId, newStatus) => {
    if (!ticketId || !newStatus) return;

    const now = new Date().toISOString();
    let oldStatus = '';

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          oldStatus = ticket.status;
          const auditEntry = {
            id: `audit-${Date.now()}`,
            type: 'system_event',
            author: CURRENT_AGENT,
            timestamp: now,
            content: `Status changed from ${oldStatus} to ${newStatus}`,
          };
          return {
            ...ticket,
            status: newStatus,
            updatedAt: now,
            timeline: [...ticket.timeline, auditEntry],
          };
        }
        return ticket;
      })
    );

    toast.success('Status Updated', `${ticketId} is now marked as ${newStatus}`);
  };

  // Update Priority
  const updateTicketPriority = (ticketId, newPriority) => {
    if (!ticketId || !newPriority) return;

    const now = new Date().toISOString();
    let oldPriority = '';

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          oldPriority = ticket.priority;
          const auditEntry = {
            id: `audit-${Date.now()}`,
            type: 'system_event',
            author: CURRENT_AGENT,
            timestamp: now,
            content: `Priority changed from ${oldPriority} to ${newPriority}`,
          };
          return {
            ...ticket,
            priority: newPriority,
            updatedAt: now,
            timeline: [...ticket.timeline, auditEntry],
          };
        }
        return ticket;
      })
    );

    toast.info('Priority Updated', `${ticketId} priority set to ${newPriority}`);
  };

  // Add Reply or Internal Note
  const addTimelineEntry = (ticketId, content, type = 'agent_reply') => {
    if (!ticketId || !content.trim()) return;

    const now = new Date().toISOString();
    const newEntry = {
      id: `act-${Date.now()}`,
      type: type, // 'agent_reply' | 'internal_note'
      author: CURRENT_AGENT,
      timestamp: now,
      content: content.trim(),
    };

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            updatedAt: now,
            timeline: [...ticket.timeline, newEntry],
          };
        }
        return ticket;
      })
    );

    if (type === 'internal_note') {
      toast.info('Note Added', 'Internal note saved securely for your team.');
    } else {
      toast.success('Reply Sent', `Reply posted to ${ticketId}`);
    }
  };

  // Restore Seed Data
  const restoreSampleData = () => {
    setTickets(INITIAL_TICKETS);
    localStorage.removeItem(STORAGE_KEY);
    resetFilters();
    setSelectedTicketId(null);
    toast.info('Data Reset', 'Restored original demo tickets and activity.');
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filteredTickets,
        customers,
        selectedTicketId,
        selectedTicket,
        isCreateModalOpen,
        isLoading,
        searchQuery,
        statusFilter,
        priorityFilter,
        categoryFilter,
        sortBy,
        stats,
        tabCounts,
        isFiltered,
        currentAgent: CURRENT_AGENT,
        setSearchQuery,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        setSortBy,
        setIsCreateModalOpen,
        setIsLoading,
        openTicketDetail,
        closeTicketDetail,
        resetFilters,
        createTicket,
        updateTicketStatus,
        updateTicketPriority,
        addTimelineEntry,
        restoreSampleData,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
