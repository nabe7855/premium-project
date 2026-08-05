import fetch from 'node-fetch';

async function checkUrl(url, name) {
  console.log(`\n========================================`);
  console.log(`Testing Live URL [${name}]: ${url}`);
  console.log(`========================================`);
  try {
    const res = await fetch(url + `?_t=${Date.now()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    console.log(`HTTP Status: ${res.status}`);
    const html = await res.text();

    // 1. Check H1
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    console.log(`H1 count: ${h1Matches.length}`);
    h1Matches.forEach((h, i) => console.log(`  H1 [${i}]: ${h.replace(/\s+/g, ' ').trim()}`));

    // 2. Check Canonical
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/gi);
    console.log(`Canonical tag:`, canonicalMatch ? canonicalMatch[0] : 'NOT FOUND');

    // 3. Check '日本最大級'
    const containsNihonSaidaikyu = html.includes('日本最大級');
    console.log(`Contains '日本最大級':`, containsNihonSaidaikyu);

    // 4. Check Title tag
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/gi);
    console.log(`Title Tag:`, titleMatch ? titleMatch[0] : 'NOT FOUND');

    // 5. Check Internal Links
    const links = [
      '/store/fukuoka/price',
      '/store/fukuoka/schedule',
      '/store/fukuoka/first-time',
      '/store/fukuoka/news/mousho-wari-2026'
    ];
    console.log('Internal Link checks:');
    for (const link of links) {
      const linkCount = (html.match(new RegExp(link, 'g')) || []).length;
      console.log(`  Link '${link}': ${linkCount} occurrences`);
    }

  } catch (err) {
    console.error(`Error fetching ${url}:`, err);
  }
}

async function main() {
  await checkUrl('https://www.sutoroberrys.jp/store/fukuoka/news/mousho-wari-2026', '猛暑日割');
  await checkUrl('https://www.sutoroberrys.jp/store/fukuoka/news/news-1785225904472-copy-1785376605692', 'お盆営業');
}

main();
