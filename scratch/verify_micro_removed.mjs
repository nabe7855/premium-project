async function verifyMicroRemoved() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache, no-store' } });
  const html = await res.text();
  console.log('Includes micro note text on live site:', html.includes('リンク先は'));
}

verifyMicroRemoved().catch(console.error);
