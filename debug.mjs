import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function debug() {
  const r = await client.execute('SELECT * FROM results');
  console.log('Total records:', r.rows.length);
  if (r.rows.length > 0) {
    console.log('Sample record:', JSON.stringify(r.rows[0]));
    const dates = [...new Set(r.rows.map(row => row.date))];
    console.log('Distinct dates in DB:', dates);
  } else {
    console.log('DB IS COMPLETELY EMPTY');
  }
}

debug().catch(console.error);
