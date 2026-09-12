import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection } from './db.js';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const DEMO_EMAIL = 'shubham.dubey@datastraw.io';

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Helper: Extract current user email
function getEffectiveUserEmail(req) {
  const email = req.query.userEmail || req.headers['x-user-email'] || req.body?.userEmail || req.body?.ownerEmail || '';
  const trimmed = email.trim().toLowerCase();
  // If no email provided, or explicitly demo account, return DEMO_EMAIL
  if (!trimmed || trimmed === DEMO_EMAIL || trimmed === 'demo@datastraw.io') {
    return DEMO_EMAIL;
  }
  return trimmed;
}

// 1. Health Check
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await query('SELECT NOW() as now, version() as version;');
    res.json({
      status: 'healthy',
      database: 'connected',
      engine: 'Supabase PostgreSQL',
      serverTime: dbRes.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Helper: Format raw DB ticket into frontend shape and PDF assessment spec
function formatTicket(row, timelineRows = []) {
  const notes = timelineRows.filter((t) => t.type === 'internal_note').map((t) => t.content);
  return {
    id: row.id,
    ticket_id: row.id,
    subject: row.subject,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    customer_name: row.customer_name || 'Anonymous Customer',
    customer_email: row.customer_email || 'support@client.com',
    notes: notes.length > 0 ? notes : timelineRows.map((t) => t.content),
    ownerEmail: row.owner_email,
    deletedAt: row.deleted_at || null,
    isDeleted: Boolean(row.deleted_at),
    createdAt: row.created_at,
    created_at: row.created_at,
    updatedAt: row.updated_at,
    updated_at: row.updated_at,
    customer: {
      id: row.customer_id,
      name: row.customer_name || 'Anonymous Customer',
      email: row.customer_email || 'support@client.com',
      company: row.customer_company || 'Independent',
      role: row.customer_role || 'Customer',
      avatarBg: row.customer_avatar_bg || 'bg-blue-600 text-white',
    },
    assignee: {
      id: row.assignee_id,
      name: row.assignee_name || 'Unassigned',
      email: row.assignee_email || '',
      role: row.assignee_role || 'Support Agent',
    },
    timeline: timelineRows.map((t) => ({
      id: t.id,
      type: t.type,
      author: {
        name: t.author_name,
        email: t.author_email,
        role: t.author_role,
      },
      timestamp: t.created_at,
      content: t.content,
    })),
  };
}

// 2. GET /api/tickets (List with user isolation, filters, stats, & trash support)
app.get('/api/tickets', async (req, res) => {
  try {
    const userEmail = getEffectiveUserEmail(req);
    const { status, priority, category, search, sortBy, showTrash } = req.query;

    const isTrashView = showTrash === 'true' || status === 'Trash';

    let sql = `
      SELECT 
        t.id, t.subject, t.description, t.status, t.priority, t.category, t.owner_email, t.deleted_at, t.created_at, t.updated_at,
        c.id as customer_id, c.name as customer_name, c.email as customer_email, c.company as customer_company, c.role as customer_role, c.avatar_bg as customer_avatar_bg,
        a.id as assignee_id, a.name as assignee_name, a.email as assignee_email, a.role as assignee_role
      FROM tickets t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN agents a ON t.assignee_id = a.id
      WHERE LOWER(t.owner_email) = LOWER($1)
    `;
    const params = [userEmail];

    if (isTrashView) {
      sql += ` AND t.deleted_at IS NOT NULL`;
    } else {
      sql += ` AND t.deleted_at IS NULL`;
      if (status && status !== 'All') {
        params.push(status);
        sql += ` AND LOWER(t.status) = LOWER($${params.length})`;
      }
    }

    if (priority && priority !== 'All') {
      params.push(priority);
      sql += ` AND LOWER(t.priority) = LOWER($${params.length})`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND LOWER(t.category) = LOWER($${params.length})`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (
        LOWER(t.id) LIKE $${params.length} OR
        LOWER(t.subject) LIKE $${params.length} OR
        LOWER(t.description) LIKE $${params.length} OR
        LOWER(c.name) LIKE $${params.length} OR
        LOWER(c.email) LIKE $${params.length}
      )`;
    }

    // Sorting
    if (sortBy === 'oldest') {
      sql += ` ORDER BY t.created_at ASC`;
    } else if (sortBy === 'priority') {
      sql += ` ORDER BY CASE t.priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 ELSE 5 END, t.created_at DESC`;
    } else if (sortBy === 'recently_updated') {
      sql += ` ORDER BY t.updated_at DESC`;
    } else {
      sql += ` ORDER BY t.created_at DESC`;
    }

    const ticketsRes = await query(sql, params);

    // Fetch timeline entries for returned tickets
    const ticketIds = ticketsRes.rows.map((r) => r.id);
    let timelinesByTicket = {};

    if (ticketIds.length > 0) {
      const timelineRes = await query(
        `SELECT id, ticket_id, type, author_name, author_email, author_role, content, created_at 
         FROM timeline_entries 
         WHERE ticket_id = ANY($1::varchar[]) 
         ORDER BY created_at ASC;`,
        [ticketIds]
      );

      for (const entry of timelineRes.rows) {
        if (!timelinesByTicket[entry.ticket_id]) {
          timelinesByTicket[entry.ticket_id] = [];
        }
        timelinesByTicket[entry.ticket_id].push(entry);
      }
    }

    const tickets = ticketsRes.rows.map((row) =>
      formatTicket(row, timelinesByTicket[row.id] || [])
    );

    // Aggregate counts specifically for this user's workspace (active vs trash)
    const countsRes = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE deleted_at IS NULL) as total,
        COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'Open') as open,
        COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'In Progress') as in_progress,
        COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'Closed') as closed,
        COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as trash
      FROM tickets
      WHERE LOWER(owner_email) = LOWER($1);
    `, [userEmail]);

    const counts = countsRes.rows[0];
    const totalActiveCount = parseInt(counts.total, 10);
    const totalTrashCount = parseInt(counts.trash, 10);

    res.json({
      tickets,
      isFreshWorkspace: totalActiveCount === 0 && totalTrashCount === 0 && userEmail !== DEMO_EMAIL,
      ownerEmail: userEmail,
      stats: {
        total: totalActiveCount,
        open: parseInt(counts.open, 10),
        inProgress: parseInt(counts.in_progress, 10),
        closed: parseInt(counts.closed, 10),
        trash: totalTrashCount,
        openTrend: totalActiveCount > 0 ? '+8% this week' : '0 tickets active',
        inProgressTrend: totalActiveCount > 0 ? 'Avg response 18m' : 'Ready for triage',
        closedTrend: totalActiveCount > 0 ? '98.4% resolution rate' : 'No resolved tickets yet',
      },
      tabCounts: {
        All: totalActiveCount,
        Open: parseInt(counts.open, 10),
        'In Progress': parseInt(counts.in_progress, 10),
        Closed: parseInt(counts.closed, 10),
        Trash: totalTrashCount,
      },
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/tickets/:id (Single Ticket Details)
app.get('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ticketRes = await query(
      `SELECT 
        t.id, t.subject, t.description, t.status, t.priority, t.category, t.owner_email, t.deleted_at, t.created_at, t.updated_at,
        c.id as customer_id, c.name as customer_name, c.email as customer_email, c.company as customer_company, c.role as customer_role, c.avatar_bg as customer_avatar_bg,
        a.id as assignee_id, a.name as assignee_name, a.email as assignee_email, a.role as assignee_role
      FROM tickets t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN agents a ON t.assignee_id = a.id
      WHERE t.id = $1;`,
      [id]
    );

    if (ticketRes.rows.length === 0) {
      return res.status(404).json({ error: `Ticket ${id} not found` });
    }

    const timelineRes = await query(
      `SELECT id, ticket_id, type, author_name, author_email, author_role, content, created_at 
       FROM timeline_entries 
       WHERE ticket_id = $1 
       ORDER BY created_at ASC;`,
      [id]
    );

    res.json(formatTicket(ticketRes.rows[0], timelineRes.rows));
  } catch (error) {
    console.error(`Error fetching ticket ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 4. POST /api/tickets (Create Ticket with user scoping and assessment spec support)
app.post('/api/tickets', async (req, res) => {
  try {
    const ownerEmail = getEffectiveUserEmail(req);
    const {
      subject,
      title,
      description,
      priority = 'Medium',
      category = 'General',
      customer,
      customer_name,
      customer_email,
      customer_company,
    } = req.body;

    const finalSubject = (subject || title || '').trim();
    if (!finalSubject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const custName = (customer?.name || customer_name || 'New Client').trim();
    const custEmail = (customer?.email || customer_email || '').trim();
    const custCompany = (customer?.company || customer_company || 'Direct Inquiry').trim();

    // Determine or create Customer scoped to ownerEmail
    let customerId = customer?.id || null;
    if (custEmail) {
      const custRes = await query(
        `SELECT id FROM customers WHERE LOWER(email) = LOWER($1) AND LOWER(owner_email) = LOWER($2);`,
        [custEmail, ownerEmail]
      );
      if (custRes.rows.length > 0) {
        customerId = custRes.rows[0].id;
      } else {
        customerId = `CUST-${Date.now().toString().slice(-4)}`;
        await query(
          `INSERT INTO customers (id, name, email, company, role, avatar_bg, owner_email) 
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            customerId,
            custName,
            custEmail,
            custCompany,
            'Customer',
            'bg-indigo-600 text-white',
            ownerEmail,
          ]
        );
      }
    }

    // Generate formatted ticket ID: TKT-001, TKT-002...
    const countRes = await query(`SELECT COUNT(*) as count FROM tickets;`);
    const nextNum = parseInt(countRes.rows[0].count, 10) + 1;
    const ticketId = `TKT-${String(nextNum).padStart(3, '0')}`;

    const now = new Date().toISOString();

    await query(
      `INSERT INTO tickets (id, subject, description, status, priority, category, customer_id, assignee_id, owner_email, created_at, updated_at)
       VALUES ($1, $2, $3, 'Open', $4, $5, $6, 'AGENT-01', $7, $8, $8);`,
      [ticketId, finalSubject, description || '', priority, category, customerId, ownerEmail, now]
    );

    // Initial timeline message
    const actId = `act-${Date.now()}`;
    await query(
      `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
       VALUES ($1, $2, 'customer_message', $3, $4, 'Customer', $5, $6);`,
      [actId, ticketId, custName, custEmail, description || finalSubject, now]
    );

    // Fetch and return newly created ticket
    const createdRes = await query(
      `SELECT 
        t.id, t.subject, t.description, t.status, t.priority, t.category, t.owner_email, t.created_at, t.updated_at,
        c.id as customer_id, c.name as customer_name, c.email as customer_email, c.company as customer_company, c.role as customer_role, c.avatar_bg as customer_avatar_bg,
        a.id as assignee_id, a.name as assignee_name, a.email as assignee_email, a.role as assignee_role
      FROM tickets t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN agents a ON t.assignee_id = a.id
      WHERE t.id = $1;`,
      [ticketId]
    );

    const timelineRes = await query(
      `SELECT id, ticket_id, type, author_name, author_email, author_role, content, created_at 
       FROM timeline_entries WHERE ticket_id = $1;`,
      [ticketId]
    );

    const createdTicket = formatTicket(createdRes.rows[0], timelineRes.rows);
    res.status(201).json({
      ...createdTicket,
      ticket_id: ticketId,
      created_at: now,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. PUT /api/tickets/:id (Update ticket status and notes - PDF assessment REST specification)
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, priority, subject, description } = req.body;
    const now = new Date().toISOString();

    const currentTicket = await query('SELECT * FROM tickets WHERE id = $1;', [id]);
    if (currentTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket ${id} not found` });
    }

    const updates = [];
    const params = [id];

    if (status) {
      params.push(status);
      updates.push(`status = $${params.length}`);
    }
    if (priority) {
      params.push(priority);
      updates.push(`priority = $${params.length}`);
    }
    if (subject) {
      params.push(subject);
      updates.push(`subject = $${params.length}`);
    }
    if (description) {
      params.push(description);
      updates.push(`description = $${params.length}`);
    }

    params.push(now);
    updates.push(`updated_at = $${params.length}`);

    await query(`UPDATE tickets SET ${updates.join(', ')} WHERE id = $1;`, params);

    // If note provided, add to timeline
    if (notes && typeof notes === 'string' && notes.trim()) {
      const entryId = `act-${Date.now()}`;
      await query(
        `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
         VALUES ($1, $2, 'internal_note', 'Support Agent', 'agent@datastraw.io', 'Support Agent', $3, $4);`,
        [entryId, id, notes.trim(), now]
      );
    }

    res.json({
      success: true,
      ticket_id: id,
      id,
      status: status || currentTicket.rows[0].status,
      updated_at: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error(`Error updating ticket ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 5. PATCH /api/tickets/:id/status
app.patch('/api/tickets/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, authorName = 'Support Agent', authorEmail = 'agent@datastraw.io' } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const currentTicket = await query('SELECT status FROM tickets WHERE id = $1;', [id]);
    if (currentTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket ${id} not found` });
    }

    const oldStatus = currentTicket.rows[0].status;
    const now = new Date().toISOString();

    await query('UPDATE tickets SET status = $1, updated_at = $2 WHERE id = $3;', [status, now, id]);

    const auditId = `audit-${Date.now()}`;
    await query(
      `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
       VALUES ($1, $2, 'system_event', $3, $4, 'Support Agent', $5, $6);`,
      [auditId, id, authorName, authorEmail, `Status changed from ${oldStatus} to ${status}`, now]
    );

    res.json({ id, status, oldStatus, updatedAt: now });
  } catch (error) {
    console.error(`Error updating ticket status ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 6. PATCH /api/tickets/:id/priority
app.patch('/api/tickets/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, authorName = 'Support Agent', authorEmail = 'agent@datastraw.io' } = req.body;

    if (!priority) {
      return res.status(400).json({ error: 'Priority is required' });
    }

    const currentTicket = await query('SELECT priority FROM tickets WHERE id = $1;', [id]);
    if (currentTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket ${id} not found` });
    }

    const oldPriority = currentTicket.rows[0].priority;
    const now = new Date().toISOString();

    await query('UPDATE tickets SET priority = $1, updated_at = $2 WHERE id = $3;', [priority, now, id]);

    const auditId = `audit-${Date.now()}`;
    await query(
      `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
       VALUES ($1, $2, 'system_event', $3, $4, 'Support Agent', $5, $6);`,
      [auditId, id, authorName, authorEmail, `Priority changed from ${oldPriority} to ${priority}`, now]
    );

    res.json({ id, priority, oldPriority, updatedAt: now });
  } catch (error) {
    console.error(`Error updating ticket priority ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 7. POST /api/tickets/:id/timeline (Reply or Internal Note)
app.post('/api/tickets/:id/timeline', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type = 'agent_reply', authorName = 'Support Agent', authorEmail = 'agent@datastraw.io', authorRole = 'Support Agent' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const now = new Date().toISOString();
    const entryId = `act-${Date.now()}`;

    await query(
      `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [entryId, id, type, authorName, authorEmail, authorRole, content.trim(), now]
    );

    await query('UPDATE tickets SET updated_at = $1 WHERE id = $2;', [now, id]);

    res.status(201).json({
      id: entryId,
      ticketId: id,
      type,
      author: { name: authorName, email: authorEmail, role: authorRole },
      content: content.trim(),
      timestamp: now,
    });
  } catch (error) {
    console.error(`Error adding timeline entry for ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 8. DELETE /api/tickets/:id (Soft delete to trash, or permanent purge)
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent, authorName = 'Support Agent', authorEmail = 'agent@datastraw.io' } = req.query;
    const userEmail = getEffectiveUserEmail(req);

    if (permanent === 'true') {
      const result = await query(
        `DELETE FROM tickets WHERE id = $1 AND LOWER(owner_email) = LOWER($2) RETURNING id;`,
        [id, userEmail]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Ticket ${id} not found or unauthorized` });
      }

      return res.json({ message: `Ticket ${id} permanently deleted`, id, permanent: true });
    }

    // Soft delete: set deleted_at to now
    const now = new Date().toISOString();
    const result = await query(
      `UPDATE tickets SET deleted_at = $1, updated_at = $1 WHERE id = $2 AND LOWER(owner_email) = LOWER($3) RETURNING id;`,
      [now, id, userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Ticket ${id} not found or unauthorized` });
    }

    // Record audit event in timeline
    const auditId = `audit-${Date.now()}`;
    await query(
      `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
       VALUES ($1, $2, 'system_event', $3, $4, 'Support Agent', 'Ticket moved to Trash', $5);`,
      [auditId, id, authorName, authorEmail, now]
    );

    res.json({ message: `Ticket ${id} moved to Trash`, id, deletedAt: now });
  } catch (error) {
    console.error(`Error deleting ticket ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 9. POST /api/tickets/:id/restore (Restore ticket from trash)
app.post('/api/tickets/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName = 'Support Agent', authorEmail = 'agent@datastraw.io' } = req.body || {};
    const userEmail = getEffectiveUserEmail(req);
    const now = new Date().toISOString();

    const result = await query(
      `UPDATE tickets SET deleted_at = NULL, updated_at = $1 WHERE id = $2 AND LOWER(owner_email) = LOWER($3) RETURNING id;`,
      [now, id, userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Ticket ${id} not found or unauthorized` });
    }

    // Record audit event in timeline
    const auditId = `audit-${Date.now()}`;
    await query(
      `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
       VALUES ($1, $2, 'system_event', $3, $4, 'Support Agent', 'Ticket restored from Trash', $5);`,
      [auditId, id, authorName, authorEmail, now]
    );

    res.json({ message: `Ticket ${id} restored from Trash`, id });
  } catch (error) {
    console.error(`Error restoring ticket ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 10. POST /api/tickets/bulk-trash (Move multiple tickets to trash)
app.post('/api/tickets/bulk-trash', async (req, res) => {
  try {
    const { ids } = req.body;
    const userEmail = getEffectiveUserEmail(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of ticket IDs is required' });
    }

    const now = new Date().toISOString();
    const result = await query(
      `UPDATE tickets SET deleted_at = $1, updated_at = $1 WHERE id = ANY($2::varchar[]) AND LOWER(owner_email) = LOWER($3) RETURNING id;`,
      [now, ids, userEmail]
    );

    res.json({
      message: `Moved ${result.rows.length} tickets to Trash`,
      trashedIds: result.rows.map((r) => r.id),
    });
  } catch (error) {
    console.error('Error bulk trashing tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

// 11. POST /api/tickets/bulk-restore (Restore multiple tickets from trash)
app.post('/api/tickets/bulk-restore', async (req, res) => {
  try {
    const { ids } = req.body;
    const userEmail = getEffectiveUserEmail(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of ticket IDs is required' });
    }

    const now = new Date().toISOString();
    const result = await query(
      `UPDATE tickets SET deleted_at = NULL, updated_at = $1 WHERE id = ANY($2::varchar[]) AND LOWER(owner_email) = LOWER($3) RETURNING id;`,
      [now, ids, userEmail]
    );

    res.json({
      message: `Restored ${result.rows.length} tickets from Trash`,
      restoredIds: result.rows.map((r) => r.id),
    });
  } catch (error) {
    console.error('Error bulk restoring tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

// 12. POST /api/tickets/bulk-permanent-delete (Permanently purge multiple tickets)
app.post('/api/tickets/bulk-permanent-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    const userEmail = getEffectiveUserEmail(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of ticket IDs is required' });
    }

    const result = await query(
      `DELETE FROM tickets WHERE id = ANY($1::varchar[]) AND LOWER(owner_email) = LOWER($2) RETURNING id;`,
      [ids, userEmail]
    );

    res.json({
      message: `Permanently purged ${result.rows.length} tickets`,
      deletedIds: result.rows.map((r) => r.id),
    });
  } catch (error) {
    console.error('Error bulk permanently deleting tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. GET /api/customers (Scoped by user)
app.get('/api/customers', async (req, res) => {
  try {
    const userEmail = getEffectiveUserEmail(req);

    const custRes = await query(`
      SELECT 
        c.id, c.name, c.email, c.company, c.role, c.status, c.avatar_bg,
        COUNT(t.id) as total_tickets,
        COUNT(t.id) FILTER (WHERE t.status != 'Closed') as open_tickets
      FROM customers c
      LEFT JOIN tickets t ON c.id = t.customer_id
      WHERE LOWER(c.owner_email) = LOWER($1)
      GROUP BY c.id, c.name, c.email, c.company, c.role, c.status, c.avatar_bg
      ORDER BY c.name ASC;
    `, [userEmail]);

    const customers = custRes.rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      company: c.company,
      role: c.role,
      status: c.status,
      avatarBg: c.avatar_bg,
      totalTickets: parseInt(c.total_tickets, 10),
      openTickets: parseInt(c.open_tickets, 10),
    }));

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: error.message });
  }
});

// 9. POST /api/user/seed-demo (Optionally load demo sample data into a fresh account)
app.post('/api/user/seed-demo', async (req, res) => {
  try {
    const userEmail = getEffectiveUserEmail(req);
    if (!userEmail || userEmail === DEMO_EMAIL) {
      return res.json({ message: 'Demo account already populated' });
    }

    console.log(`🌱 Cloning demo sample tickets for fresh user: ${userEmail}...`);

    // Copy demo customers for this user
    await query(`
      INSERT INTO customers (id, name, email, company, role, status, avatar_bg, owner_email)
      SELECT 
        id || '-' || SUBSTRING(MD5($1) FROM 1 FOR 4),
        name,
        $1 || '+' || email,
        company,
        role,
        status,
        avatar_bg,
        $1
      FROM customers
      WHERE owner_email = $2
      ON CONFLICT DO NOTHING;
    `, [userEmail, DEMO_EMAIL]);

    // Copy demo tickets for this user
    await query(`
      INSERT INTO tickets (id, subject, description, status, priority, category, customer_id, assignee_id, owner_email, created_at, updated_at)
      SELECT 
        id || '-' || SUBSTRING(MD5($1) FROM 1 FOR 4),
        subject,
        description,
        status,
        priority,
        category,
        customer_id || '-' || SUBSTRING(MD5($1) FROM 1 FOR 4),
        assignee_id,
        $1,
        created_at,
        updated_at
      FROM tickets
      WHERE owner_email = $2
      ON CONFLICT DO NOTHING;
    `, [userEmail, DEMO_EMAIL]);

    res.json({ message: `Sample demo tickets loaded successfully for ${userEmail}` });
  } catch (error) {
    console.error('Error cloning demo tickets for user:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. POST /api/seed (Reset / re-seed base database)
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database reset and re-seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Datastraw API Server listening on http://localhost:${PORT}`);
  await testConnection();
});
