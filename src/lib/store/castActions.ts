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

    // 生SQLでキャスト情報を取得 (キャッシュを避けるためタイムスタンプを出す)
    const now = new Date().toISOString();
    console.log(`[getCastsByStore] Executing @ ${now} for storeId: ${store.id}`);
    const castRows = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT 
        c.id, 
        c.name, 
        c.age, 
        c.main_image_url,
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
        AND c.is_active = true
        AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE OR m.end_date > '2099-01-01'::date)
      ORDER BY m.is_main DESC, m.priority ASC, m.start_date DESC
      LIMIT $2
      `,
      store.id,
      limit,
    );

    console.log(`[getCastsByStore] Found ${castRows.length} casts for ${storeSlug}`);

    const casts: CastData[] = castRows.map((row, index) => {
      let imageUrl = row.main_image_url || row.image_url;
      
      // If none, fallback to no-image
      if (!imageUrl) {
        imageUrl = '/cast-default.jpg';
      } else if (!imageUrl.startsWith('http')) {
        // Construct Supabase public URL if it's just a path/filename
        const bucket = 'gallery';
        imageUrl = `https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/${bucket}/${row.id}/${imageUrl}`;
      }

      return {
        id: row.id,
        name: row.name,
        age: row.age,
        image_url: imageUrl,
        profile: row.profile || '',
        features: {
          personality: row.personality_name ? { name: row.personality_name } : null,
          appearance: row.appearance_name ? { name: row.appearance_name } : null,
        },
      };
    });

    return { success: true, casts };
  } catch (error) {
    console.error('[getCastsByStore] Error fetching casts:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage, casts: [] };
  }
}
