import { getInterviewArticles } from '../src/lib/actions/interview.ts';

async function testUrls() {
  const result = await getInterviewArticles({ limit: 10 });
  console.log('Found articles:', result.articles?.length);

  for (const art of result.articles || []) {
    const meta = art.interview_meta;
    console.log('\n--- ARTICLE ---');
    console.log('ID:', art.id);
    console.log('Title:', art.title);
    console.log('Slug:', art.slug);

    const castLinks = meta?.cast_links || [];
    console.log('Cast links:', JSON.stringify(castLinks, null, 2));

    for (const link of castLinks) {
      console.log(`\nCastLink role: ${link.role}, cast_id: ${link.cast_id}, cast_name: ${link.cast_name}, romaji: ${link.cast_name_romaji}`);

      const castIdentifier = link.cast_id || link.cast_name_romaji || link.cast_name;

      const testUrls = [
        `https://www.sutoroberrys.jp/store/fukuoka/interview/${castIdentifier}/${art.slug}`,
        `https://www.sutoroberrys.jp/store/fukuoka/interview/${encodeURIComponent(castIdentifier)}/${art.slug}`,
        `https://www.sutoroberrys.jp/magazine/interview/${art.slug}`,
      ];

      for (const u of testUrls) {
        try {
          const res = await fetch(u);
          console.log(`HTTP ${res.status} -> ${u}`);
        } catch (e) {
          console.error(`Error fetching ${u}:`, e);
        }
      }
    }
  }
}

testUrls().catch(console.error);
