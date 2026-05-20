const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:hZ3f6BV8BHmtpsUq@db.bzmvamvwjgewddvnlfuz.supabase.co:5432/postgres';

async function setupDatabase() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await client.query(schemaSql);
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Error executing schema', err);
  } finally {
    await client.end();
  }
}

setupDatabase();
