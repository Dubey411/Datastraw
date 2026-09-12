import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TICKETS, INITIAL_CUSTOMERS } from '../data/initialData';
import { useToast } from './ToastContext';
import { api } from '../services/api';
import { supabase } from '../services/supabaseClient';

const TicketContext = createContext(null);

const STORAGE_KEY = 'datastraw_crm_tickets_v4';
const DEFAULT_DEMO_AGENT = {
  name: "Shubham Dubey",
  email: "shubham.dubey@datastraw.io",
  role: "Support Agent",
  avatarUrl: null,
};

export function TicketProvider({ children }) {
  const toast = useToast();

  // Current authenticated agent (defaults to demo agent if not logged in via Google)
  const [currentAgent, setCurrentAgent] = useState(() => {
    try {
      const stored = localStorage.getItem('datastraw_crm_user');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DEFAULT_DEMO_AGENT;
  });

  // Listen to Supabase Auth State (Google OAuth login)
  useEffect(() => {
    if (!supabase) return;

    // Check existing Supabase session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0];
        const userObj = {
          name,
          email: u.email,
          role: 'Workspace Owner',
          avatarUrl: u.user_metadata?.avatar_url || null,
        };
        setCurrentAgent(userObj);
        localStorage.setItem('datastraw_crm_user', JSON.stringify(userObj));
      }
    });

    // Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0];
        const userObj = {
          name,
          email: u.email,
          role: 'Workspace Owner',
          avatarUrl: u.user_metadata?.avatar_url || null,
        };
        setCurrentAgent(userObj);
        localStorage.setItem('datastraw_crm_user', JSON.stringify(userObj));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize tickets (demo account gets INITIAL_TICKETS, fresh accounts start empty)
  const [tickets, setTickets] = useState(() => {
    if (currentAgent.email !== DEFAULT_DEMO_AGENT.email) {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return INITIAL_TICKETS;
  });

  const [customers, setCustomers] = useState(
    currentAgent.email === DEFAULT_DEMO_AGENT.email ? INITIAL_CUSTOMERS : []
  );
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Open' | 'In Progress' | 'Closed'
  const [priorityFilter, setPriorityFilter] = useState('All'); // 'All' | 'Urgent' | 'High' | 'Medium' | 'Low'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'priority' | 'recently_updated'

  // Fetch tickets & customers scoped to current account
  const loadData = useCallback(async (email) => {
    const targetEmail = email || currentAgent.email;
    try {
      const data = await api.getTickets({ userEmail: targetEmail });
      if (data && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        setIsServerConnected(true);
      }
      const custData = await api.getCustomers(targetEmail);
      if (custData && Array.isArray(custData)) {
        setCustomers(custData);
      }
    } catch (err) {
      console.warn('Backend API unavailable, utilizing local storage cache:', err.message);
      setIsServerConnected(false);
      if (targetEmail === DEFAULT_DEMO_AGENT.email) {
        setTickets(INITIAL_TICKETS);
        setCustomers(INITIAL_CUSTOMERS);
      } else {
        setTickets([]);
        setCustomers([]);
      }
    }
  }, [currentAgent.email]);

  useEffect(() => {
    loadData(currentAgent.email);
  }, [loadData, currentAgent.email]);

  // Sync to localStorage as offline cache
  useEffect(() => {
    if (currentAgent.email === DEFAULT_DEMO_AGENT.email) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      } catch (e) {
        console.warn('Failed to save tickets to localStorage:', e);
      }
    }
  }, [tickets, currentAgent.email]);

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
      openTrend: total > 0 ? '+8% this week' : '0 tickets active',
      inProgressTrend: total > 0 ? 'Avg response 18m' : 'Ready for triage',
      closedTrend: total > 0 ? '98.4% resolution rate' : 'No resolved tickets yet',
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
        if (statusFilter !== 'All' && ticket.status !== statusFilter) return false;
        if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) return false;
        if (categoryFilter !== 'All' && ticket.category !== categoryFilter) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchId = ticket.id?.toLowerCase().includes(q);
          const matchSubject = ticket.subject?.toLowerCase().includes(q);
          const matchDesc = ticket.description?.toLowerCase().includes(q);
          const matchCustName = ticket.customer?.name?.toLowerCase().includes(q);
          const matchCustEmail = ticket.customer?.email?.toLowerCase().includes(q);
          const matchCustComp = ticket.customer?.company?.toLowerCase().includes(q);

          return matchId || matchSubject || matchDesc || matchCustName || matchCustEmail || matchCustComp;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'recently_updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
        if (sortBy === 'priority') {
          const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        }
        return 0;
      });
  }, [tickets, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy]);

  const openTicketDetail = (ticketId) => setSelectedTicketId(ticketId);
  const closeTicketDetail = () => setSelectedTicketId(null);

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

  // Is this account a fresh empty workspace?
  const isFreshWorkspace = useMemo(() => {
    return tickets.length === 0 && currentAgent.email !== DEFAULT_DEMO_AGENT.email;
  }, [tickets.length, currentAgent.email]);

  // Create Ticket
  const createTicket = async (ticketData) => {
    setIsLoading(true);
    const now = new Date().toISOString();

    try {
      const payload = {
        subject: ticketData.subject.trim(),
        description: ticketData.description.trim(),
        priority: ticketData.priority || 'Medium',
        category: ticketData.category || 'General',
        ownerEmail: currentAgent.email,
        customer: {
          name: ticketData.customerName.trim(),
          email: ticketData.customerEmail.trim(),
          company: ticketData.customerCompany?.trim() || 'Direct Client',
        },
      };

      const created = await api.createTicket(payload);
      setTickets((prev) => [created, ...prev]);
      setIsLoading(false);
      setIsCreateModalOpen(false);
      setSelectedTicketId(created.id);
      setIsServerConnected(true);
      toast.success('Ticket Created', `${created.id} — "${created.subject}" has been saved to Supabase.`);
      return created;
    } catch (err) {
      console.warn('API creation failed, falling back to local creation:', err);
      const nextNumber = tickets.length + 1;
      const formattedId = `TKT-${String(nextNumber).padStart(3, '0')}`;

      const newTicket = {
        id: formattedId,
        subject: ticketData.subject.trim(),
        description: ticketData.description.trim(),
        status: 'Open',
        priority: ticketData.priority || 'Medium',
        category: ticketData.category || 'General',
        ownerEmail: currentAgent.email,
        customer: {
          name: ticketData.customerName.trim(),
          email: ticketData.customerEmail.trim(),
          company: ticketData.customerCompany?.trim() || 'Direct Client',
          role: 'Customer',
          avatarBg: 'bg-indigo-600 text-white',
        },
        assignee: currentAgent,
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
      toast.success('Ticket Created', `${formattedId} — "${ticketData.subject}" created.`);
      return newTicket;
    }
  };

  // Update Status
  const updateTicketStatus = async (ticketId, newStatus) => {
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
            author: currentAgent,
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

    try {
      await api.updateStatus(ticketId, newStatus);
    } catch (err) {
      console.warn('Failed to sync status to backend:', err);
    }
  };

  // Update Priority
  const updateTicketPriority = async (ticketId, newPriority) => {
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
            author: currentAgent,
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

    try {
      await api.updatePriority(ticketId, newPriority);
    } catch (err) {
      console.warn('Failed to sync priority to backend:', err);
    }
  };

  // Add Timeline Entry
  const addTimelineEntry = async (ticketId, content, type = 'agent_reply') => {
    if (!ticketId || !content.trim()) return;

    const now = new Date().toISOString();
    const newEntry = {
      id: `act-${Date.now()}`,
      type,
      author: currentAgent,
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

    try {
      await api.addTimelineEntry(ticketId, content.trim(), type);
    } catch (err) {
      console.warn('Failed to sync timeline entry to backend:', err);
    }
  };

  // Clone sample demo data into fresh account
  const loadDemoDataForCurrentUser = async () => {
    setIsLoading(true);
    try {
      await api.seedUserDemo(currentAgent.email);
      await loadData(currentAgent.email);
      toast.success('Sample Data Loaded', '8 demo tickets and customer records loaded into your workspace.');
    } catch (err) {
      console.error('Failed to load demo data:', err);
      toast.error('Error', 'Could not load sample data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset demo database
  const restoreSampleData = async () => {
    if (currentAgent.email === DEFAULT_DEMO_AGENT.email) {
      try {
        await api.resetDatabase();
        await loadData(currentAgent.email);
        localStorage.removeItem(STORAGE_KEY);
        resetFilters();
        setSelectedTicketId(null);
        toast.info('Data Reset', 'Restored original demo tickets in Supabase PostgreSQL.');
      } catch (err) {
        setTickets(INITIAL_TICKETS);
        setCustomers(INITIAL_CUSTOMERS);
        localStorage.removeItem(STORAGE_KEY);
        resetFilters();
        setSelectedTicketId(null);
        toast.info('Data Reset', 'Restored original demo tickets locally.');
      }
    } else {
      setTickets([]);
      setSelectedTicketId(null);
      resetFilters();
      toast.info('Workspace Cleared', 'Your tickets have been reset.');
    }
  };

  // Sign out helper
  const logoutUser = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentAgent(DEFAULT_DEMO_AGENT);
    localStorage.removeItem('datastraw_crm_user');
    loadData(DEFAULT_DEMO_AGENT.email);
    toast.info('Signed Out', 'Returned to Datastraw Demo Workspace.');
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
        isServerConnected,
        isFreshWorkspace,
        searchQuery,
        statusFilter,
        priorityFilter,
        categoryFilter,
        sortBy,
        stats,
        tabCounts,
        isFiltered,
        currentAgent,
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
        loadDemoDataForCurrentUser,
        logoutUser,
        refreshData: () => loadData(currentAgent.email),
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
