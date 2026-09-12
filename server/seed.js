import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INITIAL_CUSTOMERS = [
  { id: "CUST-01", name: "Pooja Reddy", email: "pooja@techcorp.com", company: "TechCorp India", role: "VP Engineering", status: "Enterprise", avatar_bg: "bg-rose-500 text-white" },
  { id: "CUST-02", name: "Amit Kumar", email: "amit@acme.com", company: "Acme Corp", role: "Engineering Manager", status: "Enterprise", avatar_bg: "bg-blue-600 text-white" },
  { id: "CUST-03", name: "Rahul Jain", email: "rahul@innovate.io", company: "Innovate Labs", role: "SOC Lead", status: "Pro", avatar_bg: "bg-emerald-600 text-white" },
  { id: "CUST-04", name: "Neha Patel", email: "neha@financehub.com", company: "FinanceHub Global", role: "Product Director", status: "Enterprise", avatar_bg: "bg-purple-600 text-white" },
  { id: "CUST-05", name: "Karan Thakur", email: "karan@devkit.com", company: "DevKit Systems", role: "Backend Developer", status: "Pro", avatar_bg: "bg-amber-600 text-white" },
  { id: "CUST-06", name: "Sneha Choudhary", email: "sneha@startup.dev", company: "StartupDev Labs", role: "Founder & CTO", status: "Startup", avatar_bg: "bg-indigo-600 text-white" },
  { id: "CUST-07", name: "Sarah Jenkins", email: "sarah@acme.io", company: "Acme Corp", role: "Lead Architect", status: "Enterprise", avatar_bg: "bg-teal-600 text-white" },
];

const INITIAL_AGENT = {
  id: "AGENT-01",
  name: "Shubham Dubey",
  email: "shubham.dubey@datastraw.io",
  role: "Support Agent",
};

const INITIAL_TICKETS = [
  {
    id: "TKT-007",
    subject: "Add 15 additional seats to Pro Plan",
    description: "Our engineering organization is onboarding 15 new QA contractors starting next Monday. We need to upgrade our license from 35 to 50 active seats with prorated billing.",
    status: "Closed",
    priority: "Low",
    category: "Account",
    customerId: "CUST-01",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    timeline: [
      {
        id: "act-701",
        type: "customer_message",
        authorName: "Pooja Reddy",
        authorEmail: "pooja@techcorp.com",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        content: "Our engineering organization is onboarding 15 new QA contractors starting next Monday. We need to upgrade our license from 35 to 50 active seats with prorated billing.",
      },
      {
        id: "act-702",
        type: "agent_reply",
        authorName: "Shubham Dubey",
        authorEmail: "shubham.dubey@datastraw.io",
        authorRole: "Support Agent",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        content: "Hi Pooja, I have successfully updated your team's license count to 50 seats. The prorated adjustments will reflect on your monthly statement.",
      },
    ],
  },
  {
    id: "TKT-006",
    subject: "Cannot reset my password",
    description: "I'm not receiving the password reset email on amit@acme.com even after multiple attempts. Our corporate single sign-on is failing with SAML authentication error 401.",
    status: "In Progress",
    priority: "High",
    category: "Account",
    customerId: "CUST-02",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    timeline: [
      {
        id: "act-601",
        type: "customer_message",
        authorName: "Amit Kumar",
        authorEmail: "amit@acme.com",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        content: "I'm not receiving the password reset email on amit@acme.com even after multiple attempts. Our corporate single sign-on is failing with SAML authentication error 401.",
      },
      {
        id: "act-602",
        type: "internal_note",
        authorName: "Shubham Dubey",
        authorEmail: "shubham.dubey@datastraw.io",
        authorRole: "Support Agent",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        content: "Checked Okta integration logs: Okta cert expired yesterday on client side. Advised IT admin to renew certificate thumbprint.",
      },
    ],
  },
  {
    id: "TKT-005",
    subject: "Feature request: Dark mode",
    description: "It would be great to have a dark mode option for night shift operations in our monitoring center. Having a dark theme reduces eye strain during 12-hour shifts.",
    status: "Open",
    priority: "Medium",
    category: "Feature",
    customerId: "CUST-03",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    timeline: [
      {
        id: "act-501",
        type: "customer_message",
        authorName: "Rahul Jain",
        authorEmail: "rahul@innovate.io",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        content: "It would be great to have a dark mode option for night shift operations in our monitoring center. Having a dark theme reduces eye strain during 12-hour shifts.",
      },
    ],
  },
  {
    id: "TKT-004",
    subject: "Billing issue: Duplicate credit card charges",
    description: "We noticed duplicate credit card charges on invoice #INV-2024-098. Can someone please review this and process a refund for the extra charge?",
    status: "Closed",
    priority: "High",
    category: "Billing",
    customerId: "CUST-04",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    timeline: [
      {
        id: "act-401",
        type: "customer_message",
        authorName: "Neha Patel",
        authorEmail: "neha@financehub.com",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        content: "We noticed duplicate credit card charges on invoice #INV-2024-098. Can someone please review this and process a refund for the extra charge?",
      },
      {
        id: "act-402",
        type: "agent_reply",
        authorName: "Shubham Dubey",
        authorEmail: "shubham.dubey@datastraw.io",
        authorRole: "Support Agent",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        content: "Hello Neha, we have identified the transient billing error and initiated a full refund for the duplicate transaction. It will reflect on your card in 2-3 business days.",
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "Error while uploading file > 50MB",
    description: "Getting 500 error when uploading a file through the dashboard. The upload fails at 98% with an unhandled network exception.",
    status: "Open",
    priority: "High",
    category: "Bug",
    customerId: "CUST-05",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    timeline: [
      {
        id: "act-301",
        type: "customer_message",
        authorName: "Karan Thakur",
        authorEmail: "karan@devkit.com",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        content: "Getting 500 error when uploading a file through the dashboard. The upload fails at 98% with an unhandled network exception.",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "How to integrate with API?",
    description: "Can you share the documentation for API integration? Specifically interested in the webhook payloads and authentication headers.",
    status: "In Progress",
    priority: "Medium",
    category: "Technical",
    customerId: "CUST-06",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    timeline: [
      {
        id: "act-201",
        type: "customer_message",
        authorName: "Sneha Choudhary",
        authorEmail: "sneha@startup.dev",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
        content: "Can you share the documentation for API integration? Specifically interested in the webhook payloads and authentication headers.",
      },
      {
        id: "act-202",
        type: "agent_reply",
        authorName: "Shubham Dubey",
        authorEmail: "shubham.dubey@datastraw.io",
        authorRole: "Support Agent",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        content: "Hi Sneha, here is the direct link to our developer guides: https://docs.datastraw.io/api/v2. Feel free to reply here if you run into any signature validation questions!",
      },
    ],
  },
  {
    id: "TKT-001",
    subject: "Login issue with SSO authentication",
    description: "Unable to login using company Google SSO on Chrome. Getting redirect_uri_mismatch error 400 when attempting OAuth handshake.",
    status: "Open",
    priority: "Low",
    category: "Technical",
    customerId: "CUST-01",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    timeline: [
      {
        id: "act-101",
        type: "customer_message",
        authorName: "Pooja Reddy",
        authorEmail: "pooja@techcorp.com",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        content: "Unable to login using company Google SSO on Chrome. Getting redirect_uri_mismatch error 400 when attempting OAuth handshake.",
      },
    ],
  },
  {
    id: "TKT-008",
    subject: "Webhook latency spikes on event ingestion",
    description: "We are noticing 350ms delays when ingesting webhook notifications for batch customer records. Need advice on parallel socket pooling.",
    status: "In Progress",
    priority: "High",
    category: "Technical",
    customerId: "CUST-07",
    assigneeId: "AGENT-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    timeline: [
      {
        id: "act-801",
        type: "customer_message",
        authorName: "Sarah Jenkins",
        authorEmail: "sarah@acme.io",
        authorRole: "Customer",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        content: "We are noticing 350ms delays when ingesting webhook notifications for batch customer records. Need advice on parallel socket pooling.",
      },
    ],
  },
];

export async function seedDatabase() {
  console.log('🚀 Initializing Supabase PostgreSQL Database for Datastraw CRM...');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  console.log('📦 Executing schema migrations...');
  await query(schemaSql);
  console.log('✅ Schema tables verified/created successfully.');

  // Check if tickets already exist
  const existingTickets = await query('SELECT COUNT(*) as count FROM tickets;');
  if (parseInt(existingTickets.rows[0].count, 10) > 0) {
    console.log(`ℹ️ Database already contains ${existingTickets.rows[0].count} tickets. Skipping initial seed.`);
    return;
  }

  console.log('🌱 Seeding initial Agents...');
  await query(
    `INSERT INTO agents (id, name, email, role) 
     VALUES ($1, $2, $3, $4) 
     ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, role = $4;`,
    [INITIAL_AGENT.id, INITIAL_AGENT.name, INITIAL_AGENT.email, INITIAL_AGENT.role]
  );

  console.log('🌱 Seeding initial Customers...');
  for (const c of INITIAL_CUSTOMERS) {
    await query(
      `INSERT INTO customers (id, name, email, company, role, status, avatar_bg)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, company = $4, role = $5, status = $6, avatar_bg = $7;`,
      [c.id, c.name, c.email, c.company, c.role, c.status, c.avatar_bg]
    );
  }

  console.log('🌱 Seeding reference Tickets & Timeline entries...');
  for (const t of INITIAL_TICKETS) {
    await query(
      `INSERT INTO tickets (id, subject, description, status, priority, category, customer_id, assignee_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING;`,
      [t.id, t.subject, t.description, t.status, t.priority, t.category, t.customerId, t.assigneeId, t.createdAt, t.updatedAt]
    );

    if (t.timeline && t.timeline.length > 0) {
      for (const item of t.timeline) {
        await query(
          `INSERT INTO timeline_entries (id, ticket_id, type, author_name, author_email, author_role, content, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING;`,
          [item.id, t.id, item.type, item.authorName, item.authorEmail, item.authorRole, item.content, item.createdAt]
        );
      }
    }
  }

  const ticketCount = await query('SELECT COUNT(*) as count FROM tickets;');
  const customerCount = await query('SELECT COUNT(*) as count FROM customers;');
  const timelineCount = await query('SELECT COUNT(*) as count FROM timeline_entries;');

  console.log(`🎉 Database Seed Completed Successfully:`);
  console.log(`   - Customers: ${customerCount.rows[0].count}`);
  console.log(`   - Tickets: ${ticketCount.rows[0].count}`);
  console.log(`   - Timeline Entries: ${timelineCount.rows[0].count}`);
}

// If executed directly: node seed.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seed script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration/Seed error:', err);
      process.exit(1);
    });
}
