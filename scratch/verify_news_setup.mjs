import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyNewsSetup() {
  const slug = 'news-20260816-info';
  const news = await prisma.pageRequest.findUnique({
    where: { slug }
  });

  if (!news) {
    console.error('News not found!');
    return;
  }

  const refs = news.referenceUrls || {};
  const fukuokaSettings = refs.storeSettings?.fukuoka;
  
  console.log('=== ニュース予約投稿 検証結果 ===');
  console.log(`URL Slug: ${news.slug}`);
  console.log(`Title(SEO): ${news.title}`);
  console.log(`Category: ${refs.category}`);
  console.log(`Target Store: ${news.targetStoreSlugs.join(', ')}`);
  console.log(`Global Status: ${news.status}`);
  console.log(`Fukuoka Status: ${fukuokaSettings?.status}`);
  
  if (fukuokaSettings?.publishedAt) {
    const pubJST = new Date(fukuokaSettings.publishedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    console.log(`予約公開日時(JST): ${pubJST}`);
  }

  console.log(`\nアイキャッチ画像: ${news.thumbnailUrl}`);
  
  // alt_text is not stored in a separate image_alts table
  
  console.log('\n--- 本文 (プレビュー) ---');
  const sections = news.sections || [];
  for (const s of sections) {
    if (s.type === 'hero') {
      console.log(`[HERO IMAGE]: ${s.content.imageUrl}`);
    } else if (s.type === 'text_block') {
      console.log(`[TEXT BLOCK]:\n${s.content.description}`);
    }
  }
}

verifyNewsSetup().catch(console.error).finally(() => prisma.$disconnect());
