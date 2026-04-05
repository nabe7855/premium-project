
'use server';
import { prisma } from '@/lib/prisma';
import { StoreLinksConfig } from './storeLinksConfig';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function saveStoreLinksConfig(storeSlug: string, config: StoreLinksConfig) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true }
    });

    if (!store) {
      return { success: false, error: 'Store not found' } as const;
    }

    await prisma.storeLinksConfig.upsert({
      where: { store_id: store.id },
      create: {
        store_id: store.id,
        config: config as any
      },
      update: {
        config: config as any
      }
    });

    // 履歴テーブルへの保存（バックアップ1: DB履歴）
    await prisma.headerConfigHistory.create({
      data: {
        store_id: store.id,
        config: config as any,
      },
    });

    // ローカルファイルへの保存（バックアップ2: JSONファイル）
    try {
      const backupDir = path.join(process.cwd(), 'src/lib/store/backups/header', storeSlug);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' + new Date().getHours() + '-' + new Date().getMinutes();
      const backupPath = path.join(backupDir, `${timestamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(config, null, 2));
      
      const files = fs.readdirSync(backupDir)
        .map(f => ({ name: f, mtime: fs.statSync(path.join(backupDir, f)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      if (files.length > 20) {
        files.slice(20).forEach(f => fs.unlinkSync(path.join(backupDir, f.name)));
      }
    } catch (err) {
      console.error('Header backup file creation failed:', err);
    }

    revalidatePath(`/store/${storeSlug}/links`);
    return { success: true } as const;
  } catch (error) {
    console.error('[saveStoreLinksConfig] Error:', error);
    return { success: false, error: 'Failed to save links config' } as const;
  }
}

// 履歴一覧の取得
export async function getHeaderHistory(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug }
    });
    if (!store) return { success: false, error: 'Store not found' };

    const history = await prisma.headerConfigHistory.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    return { success: true, history };
  } catch (error) {
    console.error('Failed to fetch header history:', error);
    return { success: false, error: '履歴の取得に失敗しました' };
  }
}

// 履歴の削除
export async function deleteHeaderHistory(historyId: string) {
  try {
    await prisma.headerConfigHistory.delete({
      where: { id: historyId }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete history:', error);
    return { success: false, error: '履歴の削除に失敗しました' };
  }
}
