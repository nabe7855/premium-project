import { execSync } from 'child_process';

function getUrlHeaders(url) {
  try {
    const out = execSync(`curl.exe -sI "${url}"`, { encoding: 'utf8' });
    const statusMatch = out.match(/HTTP\/[\d\.]+\s+(\d+)/i);
    const locationMatch = out.match(/Location:\s*([^\r\n]+)/i);

    return {
      status: statusMatch ? statusMatch[1] : 'Unknown',
      location: locationMatch ? locationMatch[1].trim() : null,
      raw: out
    };
  } catch (err) {
    return { status: 'Error', error: err.message };
  }
}

function getCanonical(url) {
  try {
    const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });
    const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    return {
      canonical: match ? match[1] : 'Not Found',
      htmlSnippet: match ? match[0] : 'No Canonical Tag'
    };
  } catch (err) {
    return { canonical: 'Error' };
  }
}

async function verifyAll() {
  console.log('===========================================================');
  console.log('=== FINAL PRODUCTION VERIFICATION AFTER REFINEMENT ===');
  console.log('===========================================================\n');

  // 1. Single-Store News Cross-Path 301 Redirect Check
  console.log('--- 1. Single-Store News Cross-Path Redirect Check ---');
  const crossUrl = 'https://www.sutoroberrys.jp/store/yokohama/news/news-1785225904472-copy-1785376605692';
  const crossRes = getUrlHeaders(crossUrl);
  console.log(`- Accessing Fukuoka news via Yokohama URL: ${crossUrl}`);
  console.log(`  HTTP Status: ${crossRes.status}`);
  console.log(`  Location Header: ${crossRes.location}`);

  if (crossRes.location) {
    const redirectTargetRes = getUrlHeaders(crossRes.location.startsWith('http') ? crossRes.location : `https://www.sutoroberrys.jp${crossRes.location}`);
    console.log(`  Redirect Target Status (${crossRes.location}): ${redirectTargetRes.status}`);
  }

  // 2. Multi-Store News Check (猛暑日割 mousho-wari-2026)
  console.log('\n--- 2. Multi-Store News Check (猛暑日割: mousho-wari-2026) ---');
  const moushoFukuokaUrl = 'https://www.sutoroberrys.jp/store/fukuoka/news/mousho-wari-2026';
  const moushoYokohamaUrl = 'https://www.sutoroberrys.jp/store/yokohama/news/mousho-wari-2026';

  const fukuokaRes = getUrlHeaders(moushoFukuokaUrl);
  const yokohamaRes = getUrlHeaders(moushoYokohamaUrl);
  const yokohamaCanon = getCanonical(moushoYokohamaUrl);

  console.log(`- Fukuoka URL (${moushoFukuokaUrl}): HTTP Status = ${fukuokaRes.status}`);
  console.log(`- Yokohama URL (${moushoYokohamaUrl}): HTTP Status = ${yokohamaRes.status} (Expected: 200)`);
  console.log(`- Yokohama URL Canonical Tag: ${yokohamaCanon.htmlSnippet}`);

  // 3. Regular Single-Store News 200 OK & Canonical Check
  console.log('\n--- 3. Regular Single-Store News 200 OK & Canonical Check ---');
  const yokohamaObonUrl = 'https://www.sutoroberrys.jp/store/yokohama/news/news-20260803-info';
  const fukuokaObonUrl = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1785225904472-copy-1785376605692';

  console.log(`- Yokohama Obon (${yokohamaObonUrl}): HTTP Status = ${getUrlHeaders(yokohamaObonUrl).status}`);
  console.log(`  Canonical Tag: ${getCanonical(yokohamaObonUrl).htmlSnippet}`);

  console.log(`- Fukuoka Obon (${fukuokaObonUrl}): HTTP Status = ${getUrlHeaders(fukuokaObonUrl).status}`);
  console.log(`  Canonical Tag: ${getCanonical(fukuokaObonUrl).htmlSnippet}`);
}

verifyAll().catch(console.error);
