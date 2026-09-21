/**
 * Run Database Migration Script
 */

const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...\n');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('📄 Reading migration file...\n');
    const sql = fs.readFileSync('./database/migration-add-itinerary-details.sql', 'utf-8');

    console.log('🚀 Running migration...\n');
    await client.query(sql);

    console.log('✅ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Connection closed.');
  }
}

runMigration();
