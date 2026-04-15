import { createClient } from '@libsql/client';

const url = (process.env.TURSO_DATABASE_URL || 'file:local.db').trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

export const db = createClient({
  url,
  authToken,
});

export type LotteryResult = {
  id?: number;
  date: string;
  draw_time: string;
  sangam: string;
  chetak: string;
  super: string;
  mp_deluxe: string;
  bhagya_rekha: string;
  diamond: string;
  created_at?: string;
};
