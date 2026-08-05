import { prisma } from '../src/lib/prisma.ts';

async function runVerification() {
  console.log('=== TRIAGE VERIFICATION REPORT ===\n');

  // 1. /amolab トップ公開記事チェック
  const activeArticles = await prisma.mediaArticle.findMany({
    where: {
      category: 'amolab',
      status: 'published'
    },
    select: { slug: true, title: true }
  });
  console.log('1. /amolab Published Articles Count:', activeArticles.length);
  console.log('   Published Slugs:', activeArticles.map(a => a.slug));
  const isCount2 = activeArticles.length === 2 && activeArticles.some(a => a.slug === 'jyosei-fuzoku-guide') && activeArticles.some(a => a.slug === 'voice-aya');
  console.log(`   -> Check Result: ${isCount2 ? '✅ PASS' : '❌ FAIL'}\n`);

  // 2. 非公開5本 & 残存2本のレスポンス状態チェック
  const baseUrl = 'https://www.sutoroberrys.jp';
  const testUrls = [
    { slug: 'jyosei-fuzoku-guide', expectedStatus: 200 },
    { slug: 'voice-aya', expectedStatus: 200 },
    { slug: 'self-pleasure-guide', expectedStatus: 404 },
    { slug: 'couple-sex-communication', expectedStatus: 404 },
    { slug: 'women-orgasm-science', expectedStatus: 404 },
    { slug: 'femtech-sex-health', expectedStatus: 404 },
    { slug: 'self-care-tonight', expectedStatus: 404 },
  ];

  console.log('2. URL Response Status Check (Local DB / Live):');
  for (const item of testUrls) {
    const art = await prisma.mediaArticle.findUnique({ where: { slug: item.slug } });
    const localStatus = art ? (art.status === 'published' ? 200 : 404) : 404;
    console.log(`   - Slug [${item.slug}]: DB status = '${art?.status}' -> App Response = ${localStatus} (Expected: ${item.expectedStatus}) ${localStatus === item.expectedStatus ? '✅ PASS' : '❌ FAIL'}`);
  }

  // 3. 女風ガイドの実HTMLチェック
  console.log('\n3. jyosei-fuzoku-guide Content Inspection:');
  const guide = await prisma.mediaArticle.findUnique({ where: { slug: 'jyosei-fuzoku-guide' } });
  if (guide) {
    const hasMedicalSentence = guide.content.includes('ホルモン分泌が活性化し');
    const hasOperatorNote = guide.content.includes('本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています');
    const hasLinkFirstTime = guide.content.includes('/store/fukuoka/first-time');
    const hasLinkVoiceAya = guide.content.includes('/amolab/voice-aya');

    console.log(`   - Medical Sentence Removed: ${!hasMedicalSentence ? '✅ PASS (Removed)' : '❌ FAIL'}`);
    console.log(`   - Operator Note Present: ${hasOperatorNote ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   - Internal Link 1 (/first-time): ${hasLinkFirstTime ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   - Internal Link 2 (/voice-aya): ${hasLinkVoiceAya ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n   [jyosei-fuzoku-guide HTML Footprint Snippet]:');
    const snippetIndex = guide.content.indexOf('article-footer-blocks');
    if (snippetIndex !== -1) {
      console.log(guide.content.substring(snippetIndex - 50, snippetIndex + 600));
    }
  }

  // 4. self-care-and-jofuu 実HTMLチェック
  console.log('\n4. self-care-and-jofuu Content Inspection:');
  const dictItem = await prisma.mediaArticle.findUnique({ where: { slug: 'self-care-and-jofuu' } });
  if (dictItem) {
    const hasOldSentence = dictItem.content.includes('エストロゲン');
    const hasNewSentence = dictItem.content.includes('利用をきっかけに、自分の外見や生活を大切にする気持ちが生まれたという声は多く聞かれます');
    console.log(`   - Old Medical Sentence Removed: ${!hasOldSentence ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   - New Sentence Present: ${hasNewSentence ? '✅ PASS' : '❌ FAIL'}`);
    console.log('\n   [self-care-and-jofuu Content Snippet]:');
    console.log(`   "${dictItem.content}"`);
  }

  // 5. 空になったタグが /amolab トップで非表示になっているかチェック
  console.log('\n5. Active Tags Check for /amolab:');
  const rawTags = await prisma.mediaTag.findMany({
    include: { articles: { include: { article: true } } }
  });
  
  const amolabPublished = await prisma.mediaArticle.findMany({
    where: { category: 'amolab', status: 'published' },
    include: { tags: { include: { tag: true } } }
  });

  const activeTagNames = new Set();
  amolabPublished.forEach(art => {
    art.tags?.forEach(t => {
      if (t.tag?.name) activeTagNames.add(t.tag.name);
    });
  });

  console.log('   Active Tags with Published amolab Articles:', Array.from(activeTagNames));
  console.log('   All Tags Summary:');
  for (const tag of rawTags) {
    const pubAmolabCount = tag.articles.filter(ta => ta.article.category === 'amolab' && ta.article.status === 'published').length;
    const isShownOnAmolab = activeTagNames.has(tag.name);
    console.log(`   - Tag [${tag.name}]: Published amolab articles = ${pubAmolabCount} -> Shown on /amolab = ${isShownOnAmolab}`);
  }
}

runVerification().catch(console.error);
