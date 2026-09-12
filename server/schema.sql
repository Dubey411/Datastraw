-- Datastraw Support CRM Database Schema (PostgreSQL)

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  company VARCHAR(255),
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pro',
  avatar_bg VARCHAR(100) DEFAULT 'bg-blue-600 text-white',
  owner_email VARCHAR(255) DEFAULT 'shubham.dubey@datastraw.io',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(100) DEFAULT 'Support Agent',
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(50) PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  category VARCHAR(50) NOT NULL DEFAULT 'General',
  customer_id VARCHAR(50) REFERENCES customers(id) ON DELETE SET NULL,
  assignee_id VARCHAR(50) REFERENCES agents(id) ON DELETE SET NULL,
  owner_email VARCHAR(255) DEFAULT 'shubham.dubey@datastraw.io',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Timeline / Messages Table
CREATE TABLE IF NOT EXISTS timeline_entries (
  id VARCHAR(50) PRIMARY KEY,
  ticket_id VARCHAR(50) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'customer_message' | 'agent_reply' | 'internal_note' | 'system_event'
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  author_role VARCHAR(100),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast querying & filtering
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(owner_email);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_ticket_id ON timeline_entries(ticket_id);
CREATE INDEX IF NOT EXISTS idx_customers_owner ON customers(owner_email);
