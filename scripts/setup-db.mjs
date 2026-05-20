import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.SUPABASE_DB_URL || 'postgresql://postgres:hZ3f6BV8BHmtpsUq@db.bzmvamvwjgewddvnlfuz.supabase.co:5432/postgres';

async function setupDatabase() {
  const client = new pg.Client({
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
