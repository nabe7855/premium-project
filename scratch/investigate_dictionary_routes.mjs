async function investigateRoutes() {
  const slugs = ['consent-and-rights', 'what-is-female-delivery', 'self-care-and-jofuu'];
  const baseUrl = 'https://www.sutoroberrys.jp';

  console.log('=== DICTIONARY DUAL ROUTE INVESTIGATION ===\n');

  for (const slug of slugs) {
    console.log(`--- Testing Slug: [${slug}] ---`);

    // Route A: /amolab/jiten/[slug]
    const urlA = `${baseUrl}/amolab/jiten/${slug}`;
    try {
      const resA = await fetch(urlA, { headers: { 'Cache-Control': 'no-cache' } });
      const htmlA = await resA.text();
      const canonicalA = htmlA.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || 'canonical tag NOT FOUND';
      console.log(`Route A (${urlA}): Status ${resA.status}`);
      console.log(`  Canonical Output: ${canonicalA}`);
    } catch (e) {
      console.log(`Route A Error: ${e.message}`);
    }

    // Route B: /amolab/jiten/words/[slug]
    const urlB = `${baseUrl}/amolab/jiten/words/${slug}`;
    try {
      const resB = await fetch(urlB, { headers: { 'Cache-Control': 'no-cache' } });
      const htmlB = await resB.text();
      const canonicalB = htmlB.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || 'canonical tag NOT FOUND';
      console.log(`Route B (${urlB}): Status ${resB.status}`);
      console.log(`  Canonical Output: ${canonicalB}`);
    } catch (e) {
      console.log(`Route B Error: ${e.message}`);
    }
    console.log('');
  }
}

investigateRoutes().catch(console.error);
