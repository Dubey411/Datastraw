// Datastraw API Service with Multi-Tenant Account Isolation
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
   * Get Tickets with user scoping and optional filters
   */
  async getTickets(params = {}) {
    const query = new URLSearchParams();
    if (params.userEmail) query.set('userEmail', params.userEmail);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.priority && params.priority !== 'All') query.set('priority', params.priority);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);

    const qs = query.toString();
    const url = `${API_BASE}/tickets${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, {
      headers: params.userEmail ? { 'x-user-email': params.userEmail } : {},
    });
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
   * Create New Ticket (scoped to user account)
   */
  async createTicket(ticketData) {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ticketData.ownerEmail ? { 'x-user-email': ticketData.ownerEmail } : {}),
      },
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
   * Delete Ticket
   */
  async deleteTicket(id, userEmail) {
    const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(userEmail ? { 'x-user-email': userEmail } : {}),
      },
    });
    return handleResponse(res);
  },

  /**
   * Bulk Delete Tickets
   */
  async bulkDeleteTickets(ids, userEmail) {
    const res = await fetch(`${API_BASE}/tickets/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userEmail ? { 'x-user-email': userEmail } : {}),
      },
      body: JSON.stringify({ ids }),
    });
    return handleResponse(res);
  },

  /**
   * Fetch Customers (scoped to user account)
   */
  async getCustomers(userEmail) {
    const url = userEmail ? `${API_BASE}/customers?userEmail=${encodeURIComponent(userEmail)}` : `${API_BASE}/customers`;
    const res = await fetch(url, {
      headers: userEmail ? { 'x-user-email': userEmail } : {},
    });
    return handleResponse(res);
  },

  /**
   * Clone demo sample data into a fresh user account
   */
  async seedUserDemo(userEmail) {
    const res = await fetch(`${API_BASE}/user/seed-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });
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
