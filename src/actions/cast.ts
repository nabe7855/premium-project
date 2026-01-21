'use server';

import { getTodayCastsByStore, TodayCast } from '@/lib/getTodayCastsByStore';

export async function fetchDailyCasts(storeSlug: string, date: string): Promise<TodayCast[]> {
  try {
    const data = await getTodayCastsByStore(storeSlug, date);
    return data;
  } catch (error) {
    console.error('Failed to fetch daily casts:', error);
    return [];
  }
}
