// src/app/[lang]/admin/dashboard/actions.ts
'use server';

import { testConnection } from '@/lib/db/server';

export async function testFirestoreConnection(): Promise<{ success: boolean; message: string; details?: string }> {
  return await testConnection();
}
