import { getInterviewArticles } from '../src/lib/actions/interview.ts';

async function verifyAll3Articles() {
  const { articles } = await getInterviewArticles({ limit: 10 });
  console.log('Testing articles:', articles?.length);

  for (const art of articles || []) {
    const meta = art.interview_meta;
    const castLink = meta?.cast_links?.find(l => l.cast_id || l.cast_name_romaji) || meta?.cast_links?.[0];
    const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'cast';
    const storeSlug = meta?.area === 'yokohama' || meta?.area === '横浜' ? 'yokohama' : 'fukuoka';

    const url = `/store/${storeSlug}/interview/${castSlug}/${art.slug}`;
    console.log(`Generated URL: ${url} (castName: ${castLink?.cast_name})`);
  }
}

verifyAll3Articles().catch(console.error);
