'use server';

import { prisma } from '@/lib/prisma';
import { DEFAULT_FIRST_TIME_CONFIG, FirstTimeConfig, mergeConfig } from './firstTimeConfig';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function getFirstTimeConfig(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true },
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    const config = await prisma.firstTimeConfig.findUnique({
      where: { store_id: store.id },
    });

    if (!config) {
      return { success: true, config: JSON.parse(JSON.stringify(DEFAULT_FIRST_TIME_CONFIG)) };
    }

    // デープマージは一旦省略して単に返すか、必要なら実装
    return { success: true, config: config.config as unknown as FirstTimeConfig };
  } catch (error: any) {
    console.error(`[getFirstTimeConfig] ERROR for ${storeSlug}:`, error);
    return { success: false, error: error.message };
  }
}

export async function saveFirstTimeConfig(storeSlug: string, config: FirstTimeConfig) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true },
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    await prisma.firstTimeConfig.upsert({
      where: { store_id: store.id },
      create: {
        store_id: store.id,
        config: config as any,
      },
      update: {
        config: config as any,
      },
    });

    // 履歴テーブルへの保存（バックアップ1: DB履歴）
    await prisma.firstTimeConfigHistory.create({
      data: {
        store_id: store.id,
        config: config as any,
      },
    });

    // ローカルファイルへの保存（バックアップ2: JSONファイル）
    try {
      const backupDir = path.join(process.cwd(), 'src/lib/store/backups', storeSlug);
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' + new Date().getHours() + '-' + new Date().getMinutes();
      const backupPath = path.join(backupDir, `${timestamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(config, null, 2));
      
      // 古いバックアップの整理（最新10件のみ保持）
      const files = fs.readdirSync(backupDir)
        .map(f => ({ name: f, mtime: fs.statSync(path.join(backupDir, f)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      if (files.length > 20) {
        files.slice(20).forEach(f => fs.unlinkSync(path.join(backupDir, f.name)));
      }
    } catch (err) {
      console.error('Local backup creation failed:', err);
    }

    revalidatePath(`/store/${storeSlug}/first-time`);
    return { success: true };
  } catch (error: any) {
    console.error(`[saveFirstTimeConfig] ERROR for ${storeSlug}:`, error);
    return { success: false, error: error.message };
  }
}

// 履歴一覧の取得
export async function getFirstTimeHistory(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true }
    });
    if (!store) return { success: false, error: 'Store not found' };

    const history = await prisma.firstTimeConfigHistory.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    return { success: true, history };
  } catch (error: any) {
    console.error('Failed to fetch first time history:', error);
    return { success: false, error: error.message };
  }
}

// 履歴の削除
export async function deleteFirstTimeHistory(historyId: string) {
  try {
    await prisma.firstTimeConfigHistory.delete({
      where: { id: historyId }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete history:', error);
    return { success: false, error: error.message };
  }
}
