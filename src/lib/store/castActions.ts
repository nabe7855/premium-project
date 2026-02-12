'use server';

import { prisma } from '@/lib/prisma';

export interface CastData {
  id: string;
  name: string;
  age: number;
  image_url: string;
  profile: string;
  features?: {
    personality?: { name: string } | null;
    appearance?: { name: string } | null;
  } | null;
}

export async function getCastsByStore(storeSlug: string, limit: number = 3) {
  try {
    // 店舗情報を取得
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true, name: true },
    });

    if (!store) {
      return { success: false, error: `Store not found: ${storeSlug}`, casts: [] };
    }

    // 生SQLでキャスト情報を取得
    const castRows = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT 
        c.id, 
        c.name, 
        c.age, 
        c.image_url, 
        c.profile,
        (SELECT fm.name FROM cast_features cf JOIN feature_master fm ON cf.feature_id = fm.id WHERE cf.cast_id = c.id AND fm.category = 'personality' LIMIT 1) as personality_name,
        (SELECT fm.name FROM cast_features cf JOIN feature_master fm ON cf.feature_id = fm.id WHERE cf.cast_id = c.id AND fm.category = 'appearance' LIMIT 1) as appearance_name,
        m.is_main,
        m.priority,
        m.end_date
      FROM casts c
      JOIN cast_store_memberships m ON c.id = m.cast_id
      WHERE m.store_id = $1::uuid
        AND (m.end_date IS NULL OR m.end_date > NOW() OR m.end_date > '2099-01-01'::date)
      ORDER BY m.is_main DESC, m.priority ASC, m.start_date DESC
      LIMIT $2
      `,
      store.id,
      limit,
    );

    const casts: CastData[] = castRows.map((row, index) => ({
      id: row.id,
      name: row.name,
      age: row.age,
      // DBに画像がない場合は、パブリックフォルダの cast1.png 〜 cast8.png を順番に表示する
      image_url: row.image_url || `/images/cast${(index % 8) + 1}.png`,
      profile: row.profile || '',
      features: {
        personality: row.personality_name ? { name: row.personality_name } : null,
        appearance: row.appearance_name ? { name: row.appearance_name } : null,
      },
    }));

    return { success: true, casts };
  } catch (error) {
    console.error('[getCastsByStore] Error fetching casts:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage, casts: [] };
  }
}
