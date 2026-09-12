// Datastraw API Service
const API_BASE = '/api';

/**
 * Helper to handle fetch responses
 */
async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.error) errorMsg = data.error;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  /**
   * Health Check
   */
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  /**
   * Get Tickets with optional filters
   */
  async getTickets(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.priority && params.priority !== 'All') query.set('priority', params.priority);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);

    const qs = query.toString();
    const url = `${API_BASE}/tickets${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  /**
   * Get Single Ticket Details
   */
  async getTicket(id) {
    const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}`);
    return handleResponse(res);
  },

  /**
   * Create New Ticket
   */
  async createTicket(ticketData) {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    return handleResponse(res);
  },

  /**
   * Update Ticket Status
   */
  async updateStatus(id, status) {
    const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  /**
   * Update Ticket Priority
   */
  async updatePriority(id, priority) {
    const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    });
    return handleResponse(res);
  },

  /**
   * Add Timeline Message or Internal Note
   */
  async addTimelineEntry(id, content, type = 'agent_reply') {
    const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type }),
    });
    return handleResponse(res);
  },

  /**
   * Fetch Customers
   */
  async getCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    return handleResponse(res);
  },

  /**
   * Reset / Seed Sample Data
   */
  async resetDatabase() {
    const res = await fetch(`${API_BASE}/seed`, {
      method: 'POST',
    });
    return handleResponse(res);
  },
};
