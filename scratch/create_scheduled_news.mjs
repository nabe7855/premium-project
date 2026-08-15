import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createScheduledNews() {
  const JST_OFFSET = 9 * 60 * 60 * 1000;
  // 2026-08-16 19:00 JST
  const pubDateJST = new Date('2026-08-16T19:00:00+09:00');
  const pubDateUTC = new Date(pubDateJST.getTime());

  const slug = `news-20260816-info`;
  const title = '【福岡店】「はじめての女性用風俗」体験談を公開中｜予約の緊張から帰り道まで、お客様のリアルな記録';
  const imgUrl = '/images/amolab/jyosei-fuzoku-guide-eyecatch.jpg';

  const bodyContent = `「興味はあるけど、怖い」「実際どんな流れなの?」——初めてのご利用を迷っている方から、いちばん多くいただく声です。

そこで、実際にストロベリーボーイズを利用されたお客様に、予約ボタンを押すまでの迷いから、当日の緊張、施術中の気持ち、帰り道の心境まで、飾らずに書いていただいた体験談を公開しています。良かったことだけでなく、緊張したことや戸惑ったことも、そのまま載せています。

「自分と同じだ」と思える誰かの記録は、どんな説明よりも安心材料になるはずです。迷っている方は、まずこちらを読んでみてください。

▶ <a href="/amolab/voice-aya" class="text-blue-600 underline">体験談を読む</a>
▶ <a href="/store/fukuoka/first-time" class="text-blue-600 underline">初めての方へ(ご利用の流れ)</a>
▶ <a href="/store/fukuoka/cast-list" class="text-blue-600 underline">セラピスト一覧を見る</a>

福岡・博多・天神エリアでの新しい一歩を、女性用風俗ストロベリーボーイズ福岡店が丁寧にサポートします。`;

  const sections = [
    {
      id: 'section-hero',
      type: 'hero',
      content: {
        imageUrl: imgUrl
      }
    },
    {
      id: 'section-body',
      type: 'text_block',
      content: {
        description: bodyContent
      }
    }
  ];

  // Also we need to populate ImageAlt table for the alt tag, or we can just rely on the fallback or check how ImageAlt is structured
  
  const referenceUrls = {
    category: 'info',
    seoTitle: title,
    storeSettings: {
      fukuoka: {
        status: 'published',
        publishedAt: pubDateUTC.toISOString()
      }
    }
  };

  const existing = await prisma.pageRequest.findUnique({ where: { slug } });
  if (existing) {
    await prisma.pageRequest.delete({ where: { slug } });
  }

  const result = await prisma.pageRequest.create({
    data: {
      title,
      slug,
      status: 'private', // global status usually private if using storeSettings
      thumbnailUrl: imgUrl,
      targetStoreSlugs: ['fukuoka'],
      sections: sections,
      referenceUrls: referenceUrls
    }
  });

  // Check if we need to insert to image_alts table
  const altText = 'はじめての女性用風俗の体験談を読む女性';
  const imgAltExists = await prisma.$queryRaw`SELECT 1 FROM pg_tables WHERE tablename = 'image_alts'`;
  if (Array.isArray(imgAltExists) && imgAltExists.length > 0) {
      await prisma.$executeRaw`
        INSERT INTO image_alts (page_id, component_id, alt_text, created_at, updated_at) 
        VALUES (${result.id}, 'section-hero-main', ${altText}, NOW(), NOW())
        ON CONFLICT (page_id, component_id) DO UPDATE SET alt_text = EXCLUDED.alt_text, updated_at = NOW()
      `;
  }
  
  console.log('✅ Scheduled news created:', result.slug);
  console.log('Publish time (UTC):', pubDateUTC.toISOString());
  console.log('Publish time (JST):', pubDateJST.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
}

createScheduledNews().catch(console.error).finally(() => prisma.$disconnect());
