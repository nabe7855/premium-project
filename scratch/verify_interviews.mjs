import { getInterviewArticles } from '../src/lib/actions/interview.ts';

async function verifyInterviews() {
  console.log('========================================');
  console.log('VERIFYING INTERVIEW HUB IMPLEMENTATION');
  console.log('========================================');

  // 1. Fukuoka Interviews
  const fukuokaRes = await getInterviewArticles({ area: 'fukuoka' });
  console.log(`\n1. Fukuoka Interview Count: ${fukuokaRes.articles.length}`);
  fukuokaRes.articles.forEach((a, i) => {
    const meta = a.interview_meta;
    const castLink = meta?.cast_links?.[0];
    const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
    console.log(`   ${i + 1}. [${a.slug}] ${a.title}`);
    console.log(`      URL: /store/fukuoka/interview/${castSlug}/${a.slug}`);
  });

  if (fukuokaRes.articles.length === 3) {
    console.log('✅ VERIFICATION PASSED: All 3 Fukuoka interviews found!');
  } else {
    console.error(`❌ VERIFICATION FAILED: Expected 3 Fukuoka interviews, found ${fukuokaRes.articles.length}`);
  }

  // 2. Yokohama Interviews
  const yokohamaRes = await getInterviewArticles({ area: 'yokohama' });
  console.log(`\n2. Yokohama Interview Count: ${yokohamaRes.articles.length}`);
  if (yokohamaRes.articles.length === 0) {
    console.log('✅ VERIFICATION PASSED: 0 interviews for Yokohama (will return 404 and hide top section)!');
  } else {
    console.error(`❌ VERIFICATION FAILED: Expected 0 Yokohama interviews, found ${yokohamaRes.articles.length}`);
  }
}

verifyInterviews().catch(console.error);
