import { query } from './db.js';

async function runMigration() {
  console.log('🔄 Running migration: adding owner_email columns...');
  await query(`
    ALTER TABLE tickets ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255) DEFAULT 'shubham.dubey@datastraw.io';
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255) DEFAULT 'shubham.dubey@datastraw.io';
    UPDATE tickets SET owner_email = 'shubham.dubey@datastraw.io' WHERE owner_email IS NULL;
    UPDATE customers SET owner_email = 'shubham.dubey@datastraw.io' WHERE owner_email IS NULL;
    CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(owner_email);
    CREATE INDEX IF NOT EXISTS idx_customers_owner ON customers(owner_email);
  `);
  console.log('✅ Migration succeeded: tickets and customers now partitioned by owner_email.');
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
