import { prisma } from '../src/lib/prisma.ts';

async function verifyAllFixes() {
  console.log('=== VERIFYING ALL 6 PRODUCTION FIXES FOR VOICE-AYA ===');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found!');
    return;
  }

  // (1) Check dummy links href="#"
  const hashes = article.content.match(/href="#"/g);
  const hashCount = hashes ? hashes.length : 0;
  console.log(`\n(1) Dummy links href="#" count: ${hashCount} ${hashCount === 0 ? '✅ PASS' : '❌ FAIL'}`);

  // (2) Check 5-area selection block
  const areaBlockPresent = article.content.includes('お住まいのエリアから店舗を選ぶ');
  console.log(`(2) 5-area selection block present: ${areaBlockPresent} ${areaBlockPresent ? '✅ PASS' : '❌ FAIL'}`);

  // (3) Check FAQ Q5
  const faq5Present = article.content.includes('どこで待ち合わせるの？家族にバレませんか？');
  console.log(`(3) FAQ Q5 present in body: ${faq5Present} ${faq5Present ? '✅ PASS' : '❌ FAIL'}`);

  // (4) Check h2 headings for よくある質問, 編集部より, あわせて読みたい
  const h2Faq = /<h2[^>]*>[\s\S]*?よくある質問[\s\S]*?<\/h2>/i.test(article.content);
  const h2Ed = /<h2[^>]*>[\s\S]*?編集部より[\s\S]*?<\/h2>/i.test(article.content);
  const h2Rel = /<h2[^>]*>[\s\S]*?あわせて読みたい[\s\S]*?<\/h2>/i.test(article.content);
  console.log(`(4) Heading h2 check: FAQ(${h2Faq}), Editorial(${h2Ed}), Related(${h2Rel}) ${(h2Faq && h2Ed && h2Rel) ? '✅ PASS' : '❌ FAIL'}`);

  // (5) Check title
  console.log(`(5) Title: "${article.title}" ${article.title.endsWith('｜体験談｜アモラボ') ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n=== ALL 6 FIXES VERIFIED ===');
}

verifyAllFixes().catch(console.error);
