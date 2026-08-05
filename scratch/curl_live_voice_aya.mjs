async function testLive() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache, no-store' } });
  const html = await res.text();

  console.log('HTTP status:', res.status);
  console.log('Includes aya-real-profile.webp:', html.includes('aya-real-profile.webp'));
  console.log('Includes editor-note:', html.includes('editor-note'));
  console.log('Includes aya-photo-top.webp:', html.includes('aya-photo-top.webp'));

  // どこに aya-real-profile.webp があるか周辺を出力
  const idx = html.indexOf('aya-real-profile.webp');
  if (idx !== -1) {
    console.log('\n--- Real photo snippet in live HTML ---');
    console.log(html.substring(idx - 200, idx + 300));
  } else {
    console.log('\n❌ aya-real-profile.webp WAS NOT FOUND IN LIVE HTML!');
  }
}

testLive().catch(console.error);
