async function verifyHeroReal() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache, no-store' } });
  const html = await res.text();

  console.log('HTTP status:', res.status);
  const heroMatch = html.match(/<figure class="comic">[\s\S]*?<\/figure>/);
  console.log('--- LIVE HERO IMAGE HTML ---');
  console.log(heroMatch ? heroMatch[0] : 'Hero image block not found');
}

verifyHeroReal().catch(console.error);
