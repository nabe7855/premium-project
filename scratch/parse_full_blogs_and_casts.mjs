import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function parseAllData() {
  console.log('===========================================================');
  console.log('=== PRISMA DEEP AUDIT FOR CASTS, BLOGS, NEWS ===');
  console.log('===========================================================\n');

  // 1. Audit Casts via Prisma
  const casts = await prisma.cast.findMany({
    include: {
      memberships: {
        include: { store: true }
      }
    }
  });

  console.log(`Total Casts in DB: ${casts.length}`);
  console.log('--- Cast List & Store Memberships ---');
  casts.forEach(c => {
    const storeSlugs = c.memberships?.map(m => m.store?.slug).filter(Boolean) || [];
    console.log(`- [ID: ${c.id}] 名前: "${c.name}" | slug: "${c.slug}" | 店舗: [${storeSlugs.join(', ')}] | status: ${c.status}`);
  });

  // 2. Audit Blogs via Prisma
  const blogs = await prisma.blog.findMany({
    include: {
      cast: {
        include: {
          memberships: {
            include: { store: true }
          }
        }
      },
      blog_images: true
    },
    orderBy: { created_at: 'desc' }
  });

  console.log(`\nTotal Blogs in DB: ${blogs.length}`);

  const blogReport = [];
  const testBlogs = [];

  blogs.forEach(b => {
    const castName = b.cast?.name || 'キャスト未割り当て';
    const castSlug = b.cast?.slug || 'no-slug';
    const storeSlugs = b.cast?.memberships?.map(m => m.store?.slug).filter(Boolean) || [];
    const storeNames = b.cast?.memberships?.map(m => m.store?.name).filter(Boolean) || [];

    const images = b.blog_images?.map(i => i.image_url) || [];
    const hasDummyImg = images.some(img => img.includes('favicon.png') || img.includes('no-image.png') || img.includes('test'));
    const isSuspiciousText = Boolean(
      b.title?.match(/(おいｆ|テスト|test|あいうえお|asdf|qwerty)/i) || 
      b.content?.match(/(こにんいちは|テスト|test|おいｆ|asdf)/i) ||
      castName === 'koko' || castName.includes('test')
    );

    const isTest = hasDummyImg || isSuspiciousText;

    const item = {
      id: b.id,
      title: b.title,
      castName,
      castSlug,
      stores: storeSlugs.length > 0 ? storeSlugs.join(', ') : '所属店舗なし',
      isDuplicateStore: storeSlugs.length > 1,
      status: b.status,
      created_at: b.created_at,
      imageCount: images.length,
      firstImage: images[0] || 'なし',
      isTest,
      testReason: isTest ? [
        isSuspiciousText ? 'テスト文字列（「おいｆ」「こにんいちは」等）' : null,
        hasDummyImg ? 'ダミー画像（favicon.png / no-image.png）' : null,
        castName === 'koko' ? '未在籍キャスト(koko名義)' : null
      ].filter(Boolean).join(' / ') : '正常'
    };

    blogReport.push(item);
    if (isTest) testBlogs.push(item);
  });

  console.log('\n===========================================================');
  console.log(`=== (1) TEST BLOG POSTS AUDIT REPORT (Total: ${testBlogs.length}件) ===`);
  console.log('===========================================================');
  testBlogs.forEach((tb, i) => {
    console.log(`${i + 1}. [ID: ${tb.id}] タイトル: "${tb.title}"`);
    console.log(`   - 投稿キャスト: ${tb.castName} (slug: ${tb.castSlug})`);
    console.log(`   - 判定された理由: ${tb.testReason}`);
    console.log(`   - DB上のキャスト所属店舗: [${tb.stores}]`);
    console.log(`   - 画像URL: ${tb.firstImage}`);
    console.log(`   - 公開ステータス: ${tb.status}`);
  });

  // 3. Audit News via Prisma
  const news = await prisma.news.findMany({
    include: { store: true },
    orderBy: { created_at: 'desc' }
  });

  console.log(`\nTotal News in DB: ${news.length}`);
  const testNews = news.filter(n =>
    n.title?.match(/(テスト|test|おいｆ|あいうえお)/i) ||
    n.content?.match(/(テスト|test|こにんいちは|asdf)/i)
  );

  console.log('\n--- Test News Items ---');
  testNews.forEach((tn, i) => {
    console.log(`${i + 1}. [ID: ${tn.id}] "${tn.title}" | 店舗: ${tn.store?.slug || '全体'} | status: ${tn.status}`);
  });

  fs.writeFileSync('scratch/blog_store_mapping_full.json', JSON.stringify(blogReport, null, 2));
  console.log('\n✅ Full Blog Store Mapping JSON written to scratch/blog_store_mapping_full.json');

  await prisma.$disconnect();
}

parseAllData().catch(console.error);
