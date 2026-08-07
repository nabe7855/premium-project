import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function parseRawSql() {
  console.log('===========================================================');
  console.log('=== RAW SQL AUDIT FOR CASTS, BLOGS, NEWS ===');
  console.log('===========================================================\n');

  // 1. Casts & Store Memberships via Raw SQL
  const casts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.slug,
           STRING_AGG(s.slug, ', ') AS store_slugs,
           STRING_AGG(s.name, ', ') AS store_names
    FROM casts c
    LEFT JOIN cast_store_memberships csm ON c.id = csm.cast_id
    LEFT JOIN stores s ON csm.store_id = s.id
    GROUP BY c.id, c.name, c.slug
    ORDER BY c.created_at DESC
  `;

  console.log(`Total Casts in DB: ${casts.length}`);
  const testCasts = casts.filter(c => 
    c.name.includes('test') || c.name.includes('テスト') || c.name.toLowerCase() === 'koko' ||
    c.slug.includes('test') || c.name.match(/[ぁ-んァ-ヶa-zA-Z]{10,}/)
  );

  console.log('\n--- 洗い出されたテストキャスト一覧 ---');
  testCasts.forEach((c, i) => {
    console.log(`${i + 1}. [ID: ${c.id}] 名前: "${c.name}" | slug: "${c.slug}" | 所属店舗: [${c.store_slugs || 'なし'}]`);
  });

  // 2. Blogs via Raw SQL
  const blogs = await prisma.$queryRaw`
    SELECT b.id, b.title, b.content, b.status, b.created_at, b.published_at,
           c.name AS cast_name, c.slug AS cast_slug,
           STRING_AGG(DISTINCT s.slug, ', ') AS store_slugs,
           STRING_AGG(DISTINCT img.image_url, ' || ') AS blog_images
    FROM blogs b
    LEFT JOIN casts c ON b.cast_id = c.id
    LEFT JOIN cast_store_memberships csm ON c.id = csm.cast_id
    LEFT JOIN stores s ON csm.store_id = s.id
    LEFT JOIN blog_images img ON b.id = img.blog_id
    GROUP BY b.id, b.title, b.content, b.status, b.created_at, b.published_at, c.name, c.slug
    ORDER BY b.created_at DESC
  `;

  console.log(`\nTotal Blogs in DB: ${blogs.length}`);

  const fullBlogMappingTable = [];
  const testBlogs = [];

  blogs.forEach(b => {
    const castName = b.cast_name || 'キャスト未割り当て';
    const storeSlugsStr = b.store_slugs || '所属店舗なし';
    const storeCount = b.store_slugs ? b.store_slugs.split(', ').length : 0;

    const images = b.blog_images ? b.blog_images.split(' || ') : [];
    const hasDummyImg = images.some(img => img.includes('favicon.png') || img.includes('no-image.png') || img.includes('test'));
    const isSuspiciousText = Boolean(
      b.title?.match(/(おいｆ|テスト|test|あいうえお|asdf|qwerty)/i) || 
      b.content?.match(/(こにんいちは|テスト|test|おいｆ|asdf)/i) ||
      castName === 'koko' || castName.includes('test')
    );

    const isTest = hasDummyImg || isSuspiciousText;

    const record = {
      id: b.id,
      title: b.title,
      castName,
      castSlug: b.cast_slug || 'no-slug',
      assignedStores: storeSlugsStr,
      storeCount,
      isStoreDuplicate: storeCount > 1,
      status: b.status,
      created_at: b.created_at,
      published_at: b.published_at,
      imageCount: images.length,
      firstImage: images[0] || 'なし',
      isTest,
      testReason: isTest ? [
        isSuspiciousText ? '意味をなさないタイトル/本文（「おいｆ」「こにんいちは」等）' : null,
        hasDummyImg ? 'ダミー画像（favicon.png / no-image.png）' : null,
        castName === 'koko' ? '未在籍キャスト名義 (koko)' : null
      ].filter(Boolean).join(' / ') : '正常'
    };

    fullBlogMappingTable.push(record);
    if (isTest) testBlogs.push(record);
  });

  console.log('\n===========================================================');
  console.log(`=== (1) TEST BLOG POSTS AUDIT REPORT (Total: ${testBlogs.length}件) ===`);
  console.log('===========================================================');
  testBlogs.forEach((tb, i) => {
    console.log(`${i + 1}. [ID: ${tb.id}] タイトル: "${tb.title}"`);
    console.log(`   - 投稿キャスト: ${tb.castName} (slug: ${tb.castSlug})`);
    console.log(`   - 判定理由: ${tb.testReason}`);
    console.log(`   - 所属店舗: [${tb.assignedStores}] (店舗カウント: ${tb.storeCount})`);
    console.log(`   - 画像URL: ${tb.firstImage}`);
    console.log(`   - 公開ステータス: ${tb.status}`);
  });

  // 3. News via Raw SQL
  const news = await prisma.$queryRaw`
    SELECT n.id, n.title, n.content, n.status, s.slug AS store_slug, n.created_at
    FROM news n
    LEFT JOIN stores s ON n.store_id = s.id
    ORDER BY n.created_at DESC
  `;

  console.log(`\nTotal News in DB: ${news.length}`);
  const testNews = news.filter(n =>
    n.title?.match(/(テスト|test|おいｆ|あいうえお)/i) ||
    n.content?.match(/(テスト|test|こにんいちは|asdf)/i)
  );

  console.log('\n--- 洗い出されたテストニュース一覧 ---');
  testNews.forEach((tn, i) => {
    console.log(`${i + 1}. [ID: ${tn.id}] タイトル: "${tn.title}" | 所属店舗: ${tn.store_slug || '全体/なし'} | status: ${tn.status}`);
  });

  fs.writeFileSync('scratch/blog_store_mapping_full.json', JSON.stringify(fullBlogMappingTable, null, 2));
  console.log('\n✅ Full Blog Store Mapping JSON written to scratch/blog_store_mapping_full.json');

  await prisma.$disconnect();
}

parseRawSql().catch(console.error);
