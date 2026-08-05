import { prisma } from '../src/lib/prisma.ts';

async function verify() {
  console.log('=== 1. VERIFYING AYA ARTICLE IN DB ===');
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
    include: { tags: { include: { tag: true } } },
  });

  if (!article) {
    console.error('❌ Article "voice-aya" NOT found in DB!');
    return;
  }

  console.log('✅ Found article:', article.title);
  console.log('Category:', article.category);
  console.log('Status:', article.status);
  console.log('Tags:', article.tags.map(t => t.tag.name));

  console.log('\n=== 2. VERIFYING REGIONAL NEUTRALITY (改訂1) ===');
  const regionalKeywords = ['福岡店で利用', '福岡で利用', '横浜店で利用', '横浜で利用', '福岡店を利用', '横浜店を利用'];
  let foundRegional = false;
  for (const kw of regionalKeywords) {
    if (article.content.includes(kw) || article.title.includes(kw) || (article.excerpt && article.excerpt.includes(kw))) {
      console.error(`❌ REGIONAL CLAIM FOUND: "${kw}"`);
      foundRegional = true;
    }
  }
  if (!foundRegional) {
    console.log('✅ REGIONAL NEUTRALITY CONFIRMED: No false regional claims found in article!');
  }

  console.log('\n=== 3. VERIFYING STEALTH MARKETING COMPLIANCE (改訂2) ===');
  const complianceNotice = '本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています';
  if (article.content.includes(complianceNotice)) {
    console.log('✅ STEALTH MARKETING COMPLIANCE CONFIRMED: Notice is present in article content!');
  } else {
    console.error('❌ COMPLIANCE NOTICE MISSING in article content!');
  }

  console.log('\n=== 4. VERIFYING VOICE SECTION DISPLAY CONDITION (改訂3) ===');
  const voiceTag = await prisma.mediaTag.findFirst({ where: { name: '体験談' } });
  const voiceArticles = await prisma.mediaArticle.findMany({
    where: {
      status: 'published',
      category: 'amolab',
      tags: { some: { tag_id: voiceTag?.id } },
    },
  });

  console.log(`Current published "体験談" articles count: ${voiceArticles.length}`);
  if (voiceArticles.length < 2) {
    console.log('✅ TOP COLUMN VOICE SECTION CONDITION CONFIRMED: < 2 articles, TopColumnVoiceSection returns NULL (DOM not output)!');
  } else {
    console.log('ℹ️ 2 or more articles exist, TopColumnVoiceSection will render.');
  }

  console.log('\n=== ALL VERIFICATIONS COMPLETED ===');
}

verify().catch(console.error);
