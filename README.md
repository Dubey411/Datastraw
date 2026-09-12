# Datastraw Support CRM — Hiring Assessment Submission

> **Full-Stack Customer Support Ticketing System**  
> Built for the **Datastraw Assessment Test (Hiring Assignment: Build a Support CRM System)**.

---

## 🚀 Live Production Deployments

| Component | Provider | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | [https://client-nine-ruddy-88.vercel.app/](https://client-nine-ruddy-88.vercel.app/) | 🟢 **Live** |
| **Backend REST API** | **Render** | [https://datastraw-9xoy.onrender.com/api/health](https://datastraw-9xoy.onrender.com/api/health) | 🟢 **Live (Connected)** |
| **Database** | **Supabase** | Managed PostgreSQL (Cloud-Hosted) | 🟢 **Live** |
| **Source Code** | **GitHub** | [https://github.com/Dubey411/Datastraw](https://github.com/Dubey411/Datastraw) | 🟢 **Public Repo** |

---

## 📋 Assessment Requirements Checklist

| Requirement from PDF | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. Create Tickets** | ✅ **Complete** | Modal with customer name, email, subject, category, priority, & description. Auto-generates `TKT-001` format ID and ISO timestamp. |
| **2. List All Tickets** | ✅ **Complete** | Responsive list view displaying Ticket ID, Customer Avatar/Email, Subject, Status Badge, Priority, and Updated timestamp. |
| **3. Search Functionality** | ✅ **Complete** | Instant search-as-you-type across ticket IDs, subjects, descriptions, customer names, and customer emails. |
| **4. Filter by Status** | ✅ **Complete** | One-click filter tabs for **Open**, **In Progress**, **Closed**, plus bonus **Trash** recovery queue. |
| **5. View & Update Tickets** | ✅ **Complete** | Slide-over detail panel with timeline history, quick status dropdowns, priority switchers, and internal notes composer. |
| **6. REST API Endpoints** | ✅ **Complete** | All 4 required endpoints (`POST /api/tickets`, `GET /api/tickets`, `GET /api/tickets/:id`, `PUT /api/tickets/:id`) implemented with strict parameter compatibility. |
| **7. Database (PostgreSQL)** | ✅ **Complete** | Normalized PostgreSQL relational schema hosted on Supabase with foreign keys, cascading deletes, and indexed query columns. |
| **8. Production Deployment** | ✅ **Complete** | Automated CI/CD pipeline on Vercel (frontend) and Render (backend) linked with reverse proxy rewrites. |

---

## 🌟 Bonus / Standout Features ("Strong" Evaluation Tier)

1. **Editorial B2B SaaS Typography System**:
   - Headlines: **Fraunces** variable serif (weights 520–540) with editorial brand color italic accents (`<em>...</em>`). Zero cheap gradient text.
   - Body & Controls: **Plus Jakarta Sans** (400–800) for clean enterprise readability.
   - Data & Timers: **JetBrains Mono** for eyebrow labels, ticket IDs, SLA timers, and metric counters.
2. **Dual View Modes (List + Kanban)**:
   - Toggle seamlessly between a high-density tabular data stream and an interactive **Kanban Board** with columns for *Open*, *In Progress*, and *Closed*.
3. **Multi-Tenant Account Isolation**:
   - Google OAuth via Supabase. Real authenticated users receive their own clean, isolated ticket workspace, with an optional one-click *"Load Demo Data"* seeder.
4. **Soft Delete & Trash Recovery**:
   - Safe soft-deletion with confirmation alerts, trash queue view, one-click ticket restoration, and bulk permanent purge.
5. **Real-Time SLA & Performance Analytics**:
   - Median response time velocity, CSAT satisfaction indicators, and SLA compliance targets.
6. **Polished Dark / Light Theme**:
   - Seamless, flicker-free dark navy and crisp light mode toggle with CSS custom properties.

---

## 🗄️ Database Architecture (PostgreSQL)

```sql
-- 1. Customers
CREATE TABLE customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pro',
  owner_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT customers_email_owner_unique UNIQUE (email, owner_email)
);

-- 2. Tickets
CREATE TABLE tickets (
  id VARCHAR(50) PRIMARY KEY,          -- e.g. TKT-001
  subject VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Open',    -- Open | In Progress | Closed
  priority VARCHAR(50) DEFAULT 'Medium',-- Urgent | High | Medium | Low
  category VARCHAR(50) DEFAULT 'General',
  customer_id VARCHAR(50) REFERENCES customers(id) ON DELETE SET NULL,
  assignee_id VARCHAR(50) REFERENCES agents(id) ON DELETE SET NULL,
  owner_email VARCHAR(255),
  deleted_at TIMESTAMPTZ DEFAULT NULL,  -- Soft delete support
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Timeline & Notes
CREATE TABLE timeline_entries (
  id VARCHAR(50) PRIMARY KEY,
  ticket_id VARCHAR(50) REFERENCES tickets(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,            -- customer_message | agent_reply | internal_note | system_event
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  author_role VARCHAR(100),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend & DB Health Check | None | `{"status": "healthy", "database": "connected"}` |
| `GET` | `/api/tickets` | List tickets with filters & search | `?status=Open&search=query&priority=High` | `[ { ticket_id, customer_name, subject, status, created_at } ]` |
| `GET` | `/api/tickets/:id` | Single ticket details & timeline | `id` in URL parameter | `{ ticket_id, customer_name, customer_email, subject, description, status, notes, timeline }` |
| `POST` | `/api/tickets` | Create a new ticket | `{ customer_name, customer_email, subject, description }` | `{ ticket_id, created_at, ... }` |
| `PUT` | `/api/tickets/:id` | Update ticket status & append note | `{ status: "Closed", notes: "Resolved issue" }` | `{ success: true, ticket_id, updated_at }` |
| `DELETE` | `/api/tickets/:id` | Soft delete or permanent purge | `?permanent=true` (optional) | `{ message: "Ticket moved to trash", id }` |

---

## 💻 Tech Stack & Framework Choices

* **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide Icons.
* **Backend**: Node.js (v24), Express 4 (ES Modules).
* **Database**: PostgreSQL (Supabase Cloud).
* **Tooling & Performance**: Bun runtime, Oxlint for zero-defect static analysis.
* **Deployment**: Vercel (SPA Frontend + API Rewrites) + Render (Node.js Web Service).

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Dubey411/Datastraw.git
cd Datastraw
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env and supply your PostgreSQL DATABASE_URL
npm install
npm run dev   # Runs with node / bun on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
cp .env.example .env
# Edit .env and supply your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev   # Runs on http://localhost:5173
```

---

## 👤 Author
* **Candidate**: Shubham Dubey
* **Repository**: [Dubey411/Datastraw](https://github.com/Dubey411/Datastraw)
