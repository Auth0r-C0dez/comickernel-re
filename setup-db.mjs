import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function setup() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing Turso credentials in .env.local');
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const schemaPath = path.join(process.cwd(), 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('Applying schema to Turso...');
  
  // Split schema into individual commands (semicolon + newline)
  const commands = schema.split(';').map(c => c.trim()).filter(c => c.length > 0);
  
  for (const cmd of commands) {
    try {
      await client.execute(cmd);
      console.log(`Executed: ${cmd.substring(0, 50)}...`);
    } catch (err) {
      console.error(`Error executing command: ${err.message}`);
    }
  }

  console.log('Database setup complete!');
}

setup();
