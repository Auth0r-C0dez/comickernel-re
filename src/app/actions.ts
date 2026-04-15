'use server';

import { db, type LotteryResult } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function loginAdmin(password: string) {
  const ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'admin123').trim();
  if (password.trim() === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  revalidatePath('/');
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function getResults(date: string) {
  try {
    const rs = await db.execute({
      sql: 'SELECT * FROM results WHERE date = ? ORDER BY draw_time ASC',
      args: [date]
    });
    return rs.rows as unknown as LotteryResult[];
  } catch (error) {
    console.error('Database fetch failed:', error);
    return [];
  }
}

export async function upsertResult(data: LotteryResult) {
  if (!(await isAdmin())) throw new Error('Unauthorized');

  if (data.id) {
    await db.execute({
      sql: `UPDATE results SET 
            draw_time = ?, sangam = ?, chetak = ?, super = ?, 
            mp_deluxe = ?, bhagya_rekha = ?, diamond = ? 
            WHERE id = ?`,
      args: [
        data.draw_time, data.sangam, data.chetak, data.super,
        data.mp_deluxe, data.bhagya_rekha, data.diamond, data.id
      ]
    });
  } else {
    await db.execute({
      sql: `INSERT INTO results (date, draw_time, sangam, chetak, super, mp_deluxe, bhagya_rekha, diamond) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.date, data.draw_time, data.sangam, data.chetak, data.super,
        data.mp_deluxe, data.bhagya_rekha, data.diamond
      ]
    });
  }
  revalidatePath('/');
}

export async function deleteResult(id: number) {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  await db.execute({
    sql: 'DELETE FROM results WHERE id = ?',
    args: [id]
  });
  revalidatePath('/');
}
