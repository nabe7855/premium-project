'use server';

import { prisma } from '@/lib/prisma';

/**
 * サーバーサイドから指定されたユーザーのロールを取得する（RLSをバイパス）
 * クライアントサイドのSupabaseクエリがタイムアウトする場合の代替手段として使用
 */
export async function getRoleFromServer(userId: string) {
  console.log(`[AuthDebug] getRoleFromServer started for ${userId}`);
  try {
    // Prismaを使用してロールを取得（これは通常RLSを無視する直接接続）
    const roleData = await prisma.roles.findFirst({
      where: {
        user_id: userId,
      },
    });

    console.log(`[AuthDebug] getRoleFromServer result:`, roleData);
    return { success: true, role: roleData?.role };
  } catch (error: any) {
    console.error(`[AuthDebug] getRoleFromServer error:`, error);
    return { success: false, error: error.message };
  }
}
