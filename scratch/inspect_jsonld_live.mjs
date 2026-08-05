async function inspectJsonLd() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  const res = await fetch(url);
  const html = await res.text();

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  console.log('=== FOUND JSON-LD SCRIPTS ON LIVE PAGE ===');
  jsonLdMatches?.forEach((script, idx) => {
    console.log(`\n--- Script ${idx + 1} ---`);
    console.log(script.replace(/<[^>]+>/g, '').trim());
  });
}

inspectJsonLd().catch(console.error);
