'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAlerts() {
  revalidatePath('/', 'page');
}
