import { getInterviewArticles } from '../src/lib/actions/interview.ts';

async function main() {
  const result = await getInterviewArticles({ limit: 3 });
  if (!result.articles) return;

  for (const art of result.articles) {
    const meta = art.interview_meta;
    const castLink = meta?.cast_links?.find((l) => l.role === 'participant') || meta?.cast_links?.[0];
    const castName = castLink?.cast_name || 'セラピスト';
    const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
    const storeSlug = meta?.area === 'yokohama' || meta?.area === '横浜' ? 'yokohama' : 'fukuoka';
    const url = `/store/${storeSlug}/interview/${castSlug}/${art.slug}`;
    console.log({
      id: art.id,
      title: art.title,
      slug: art.slug,
      eyecatchUrl: art.eyecatch_url || art.thumbnail_url,
      castName,
      url,
    });
  }
}

main().catch(console.error);
