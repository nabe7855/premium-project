'use server';

import { prisma } from '@/lib/prisma';

/**
 * 全く進捗がない（全ステップが未完了）予約の数を取得する。
 * サイドバーのバッジ表示用。
 */
export async function getZeroProgressReservationsCount() {
  try {
    const reservations = await prisma.reservations.findMany({
      where: {
        status: 'pending',
      },
      select: {
        progress_json: true,
      },
    });

    // progress_json 内の全ての isCompleted が false のものをカウント
    const count = reservations.filter((res) => {
      const steps = res.progress_json as any[];
      if (!steps || !Array.isArray(steps)) return false;
      return steps.every((s) => s.isCompleted === false);
    }).length;

    return count;
  } catch (error) {
    console.error('Error in getZeroProgressReservationsCount:', error);
    return 0;
  }
}
