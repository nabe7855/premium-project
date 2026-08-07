import { prisma } from '../src/lib/prisma.ts';

async function setupFeaturedCasts() {
  console.log('=== CREATING TABLE AND SEEDING FEATURED CASTS ===\n');

  // 1. featured_casts テーブルの有無確認・作成
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS featured_casts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      store_name VARCHAR(255) NOT NULL,
      store_slug VARCHAR(255) NOT NULL,
      catch_copy TEXT,
      image_url TEXT NOT NULL,
      link_url TEXT NOT NULL,
      is_external BOOLEAN DEFAULT false,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('✅ Table featured_casts ensured.');

  // 2. 既存の登録数をクリア/削除して再セットアップ
  await prisma.$executeRawUnsafe(`DELETE FROM featured_casts;`);

  // 3. 初期データの登録 (自社店：福岡・横浜を先頭、外部店：東京・大阪・名古屋を後ろに配置)
  const initialCasts = [
    {
      name: 'ユウト',
      store_name: '福岡店',
      store_slug: 'fukuoka',
      catch_copy: '甘く優しい言葉と至福のオイルトリートメント',
      image_url: '/ゆうと.png',
      link_url: '/store/fukuoka/cast/-a18112',
      is_external: false,
      display_order: 1,
    },
    {
      name: 'シュン',
      store_name: '横浜店',
      store_slug: 'yokohama',
      catch_copy: '極上の癒やしと大人のプライベートサロンタイム',
      image_url: '/シュン.png',
      link_url: '/store/yokohama/cast/-af6943',
      is_external: false,
      display_order: 2,
    },
    {
      name: 'トワ',
      store_name: '名古屋店',
      store_slug: 'nagoya',
      catch_copy: '上質な出会いが届ける、特別なひとときを',
      image_url: '/towa.png',
      link_url: 'https://sutoroberrys-aichi.com/main.html',
      is_external: true,
      display_order: 3,
    },
    {
      name: 'カイト',
      store_name: '大阪店',
      store_slug: 'osaka',
      catch_copy: '美しい夜の街で、ときめきの時間を',
      image_url: '/カイト.png',
      link_url: 'https://sutoroberrys-osaka.com/main.html',
      is_external: true,
      display_order: 4,
    },
  ];

  for (const c of initialCasts) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO featured_casts (name, store_name, store_slug, catch_copy, image_url, link_url, is_external, display_order, is_active)
       VALUES ('${c.name}', '${c.store_name}', '${c.store_slug}', '${c.catch_copy}', '${c.image_url}', '${c.link_url}', ${c.is_external}, ${c.display_order}, true);`
    );
  }

  console.log(`✅ Inserted ${initialCasts.length} initial featured casts.`);
}

setupFeaturedCasts().catch(console.error);
