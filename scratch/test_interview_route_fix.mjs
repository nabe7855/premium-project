import { getInterviewArticles } from '../src/lib/actions/interview.ts';

async function testAllInterviewRoutes() {
  const result = await getInterviewArticles({ limit: 10 });
  console.log('Total articles:', result.articles?.length);

  for (const art of result.articles || []) {
    const meta = art.interview_meta;
    const castLink = meta?.cast_links?.find((l) => l.cast_id || l.cast_name_romaji) || meta?.cast_links?.[0];
    const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'cast';
    const storeSlug = meta?.area === 'yokohama' || meta?.area === '横浜' ? 'yokohama' : 'fukuoka';

    const url1 = `https://www.sutoroberrys.jp/store/${storeSlug}/interview/${castSlug}/${art.slug}`;
    const url2 = `https://www.sutoroberrys.jp/store/${storeSlug}/cast/${castSlug}/interview/${art.slug}`;

    console.log(`\nArticle: "${art.title}"`);
    console.log(`Selected castSlug: ${castSlug}`);
    console.log(`URL1: ${url1}`);
    console.log(`URL2: ${url2}`);
  }
}

testAllInterviewRoutes().catch(console.error);
