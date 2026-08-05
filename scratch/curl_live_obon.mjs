import fetch from 'node-fetch';

async function check(url, label) {
  console.log(`\n========================================`);
  console.log(`Checking Live Production URL [${label}]: ${url}`);
  console.log(`========================================`);
  const res = await fetch(url + `?_t=${Date.now()}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Cache-Control': 'no-cache, no-store'
    }
  });

  const html = await res.text();
  console.log(`Status: ${res.status}`);

  // Title tag
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  console.log('Title Tag:', titleMatch ? titleMatch[1] : 'N/A');

  // H1 tag
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/gi);
  console.log('H1 Tags:', h1Match);

  // Canonical tag
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  console.log('Canonical Tag:', canonicalMatch ? canonicalMatch[0] : 'N/A');

  // Check '日本最大級'
  const hasSaidaikyu = html.includes('日本最大級');
  console.log('Contains "日本最大級":', hasSaidaikyu);

  // Check Body Snippet
  const snippetIndex = html.indexOf('猛暑日割は、通常コースすべてにご利用いただけます');
  console.log('Body Snippet (3 links paragraph):', snippetIndex !== -1 ? 'FOUND!' : 'NOT FOUND');

  // Links
  console.log('Internal Links:');
  console.log('  /store/fukuoka/price:', (html.match(/\/store\/fukuoka\/price/g) || []).length);
  console.log('  /store/fukuoka/schedule:', (html.match(/\/store\/fukuoka\/schedule/g) || []).length);
  console.log('  /store/fukuoka/first-time:', (html.match(/\/store\/fukuoka\/first-time/g) || []).length);
  console.log('  /store/fukuoka/news/mousho-wari-2026:', (html.match(/\/store\/fukuoka\/news\/mousho-wari-2026/g) || []).length);
}

async function main() {
  await check('https://www.sutoroberrys.jp/store/fukuoka/news/mousho-wari-2026', '猛暑日割ニュース');
  await check('https://www.sutoroberrys.jp/store/fukuoka/news/news-1785225904472-copy-1785376605692', 'お盆ニュース');
}

main();
