import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  console.log('URL Prefix:', url?.substring(0, 15));
  console.log('Token Length:', token?.length);

  const client = createClient({
    url: url || 'file:local.db',
    authToken: token,
  });

  try {
    const r = await client.execute('SELECT COUNT(*) as count FROM results');
    console.log('Database Result:', JSON.stringify(r.rows));
  } catch (e) {
    console.error('Database Error:', e.message);
  }
}

verify().catch(console.error);
