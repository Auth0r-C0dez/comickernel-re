import { isAdmin } from '../actions';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  const admin = await isAdmin();
  
  // Sensitive info check (masking for safety)
  const dbUrl = process.env.TURSO_DATABASE_URL || 'NOT SET';
  const maskedUrl = dbUrl === 'NOT SET' ? 'NOT SET' : dbUrl.substring(0, 15) + '...';
  const hasToken = !!process.env.TURSO_AUTH_TOKEN ? 'YES' : 'NO';
  const nodeEnv = process.env.NODE_ENV;

  let dbStatus = 'Unknown';
  let recordCount = 0;
  let error = '';

  try {
    const r = await db.execute('SELECT COUNT(*) as count FROM results');
    recordCount = Number(r.rows[0].count);
    dbStatus = 'Connected';
  } catch (e: any) {
    dbStatus = 'Failed';
    error = e.message;
  }

  return (
    <div className="p-10 font-mono text-sm space-y-4 bg-black text-green-500 overflow-auto">
      <h1 className="text-xl font-bold border-b border-green-900 pb-2">System Diagnostic</h1>
      <div className="grid grid-cols-2 gap-2">
        <span>Admin Status:</span> <span>{admin ? 'TRUE' : 'FALSE'}</span>
        <span>Environment:</span> <span>{nodeEnv}</span>
        <span>DB URL Prefix:</span> <span>{maskedUrl}</span>
        <span>Has Auth Token:</span> <span>{hasToken}</span>
        <span>DB Connection:</span> <span>{dbStatus}</span>
        <span>Record Count:</span> <span>{recordCount}</span>
      </div>
      {error && (
        <div className="mt-4 p-4 border border-red-900 text-red-500">
          <p className="font-bold">Last Error:</p>
          <pre>{error}</pre>
        </div>
      )}
      <div className="mt-10 opacity-30">
        <p>Diagnostics automatically generated on each request.</p>
      </div>
    </div>
  );
}
