'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { StoreTopPageConfig } from './storeTopConfig';
import fs from 'fs';
import path from 'path';

export async function saveStoreTopConfig(storeSlug: string, config: StoreTopPageConfig) {
  try {
    // 店舗を取得
    console.log(`[saveStoreTopConfig] Finding store with slug: ${storeSlug}`);
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      console.error(`[saveStoreTopConfig] Store not found: ${storeSlug}`);
      return { success: false, error: '店舗が見つかりません' };
    }
    console.log(`[saveStoreTopConfig] Found store: ${store.name} (${store.id})`);

    // 更新または新規作成 (upsert)
    console.log(`[saveStoreTopConfig] Upserting config for store_id: ${store.id}`);

    await prisma.storeTopConfig.upsert({
      where: { store_id: store.id },
      update: {
        config: config as any,
      },
      create: {
        store_id: store.id,
        config: config as any,
      },
    });

    // 履歴テーブルへの保存（バックアップ1: DB履歴）
    await prisma.homePageConfigHistory.create({
      data: {
        store_id: store.id,
        config: config as any,
      },
    });

    // ローカルファイルへの保存（バックアップ2: JSONファイル）
    try {
      const backupDir = path.join(process.cwd(), 'src/lib/store/backups/home', storeSlug);
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
      console.error('Home backup file creation failed:', err);
    }

    // ページをrevalidate (トップおよび全下層ページを対象)
    revalidatePath(`/store/${storeSlug}`, 'layout');
    revalidatePath(`/store/${storeSlug}`);
    console.log(`Successfully saved and revalidated config for ${storeSlug}`);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving store top config:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

// 履歴一覧の取得
export async function getHomePageHistory(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug }
    });
    if (!store) return { success: false, error: 'Store not found' };

    const history = await prisma.homePageConfigHistory.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    return { success: true, history };
  } catch (error) {
    console.error('Failed to fetch home history:', error);
    return { success: false, error: '履歴の取得に失敗しました' };
  }
}

// 履歴の削除
export async function deleteHomePageHistory(historyId: string) {
  try {
    await prisma.homePageConfigHistory.delete({
      where: { id: historyId }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete history:', error);
    return { success: false, error: '履歴の削除に失敗しました' };
  }
}
