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

async function verifyNews() {
  console.log('===========================================================');
  console.log('=== PRODUCTION VERIFICATION FOR NEWS SCOPING & REDIRECTS ===');
  console.log('===========================================================\n');

  // 1. Single Store Cross-Path 301 Redirect Check (Fukuoka news accessed via Yokohama URL)
  console.log('--- 1. Single-Store News Cross-Path 301 Redirect Check ---');
  const crossUrl = 'https://www.sutoroberrys.jp/store/yokohama/news/news-1785225904472-copy-1785376605692';
  const crossRes = getUrlHeaders(crossUrl);
  console.log(`- Accessing: ${crossUrl}`);
  console.log(`  HTTP Status: ${crossRes.status}`);
  console.log(`  Location Header: ${crossRes.location}`);

  if (crossRes.location) {
    const redirectTargetRes = getUrlHeaders(crossRes.location);
    console.log(`  Redirect Target Status (${crossRes.location}): ${redirectTargetRes.status}`);
  }

  // 2. Regular Single-Store News 200 OK & Canonical Check
  console.log('\n--- 2. Regular Single-Store News 200 OK & Canonical Check ---');
  const yokohamaObonUrl = 'https://www.sutoroberrys.jp/store/yokohama/news/news-20260803-info';
  const fukuokaObonUrl = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1785225904472-copy-1785376605692';

  console.log(`- Yokohama Obon (${yokohamaObonUrl}):`);
  console.log(`  HTTP Status: ${getUrlHeaders(yokohamaObonUrl).status}`);
  console.log(`  Canonical Tag: ${getCanonical(yokohamaObonUrl).htmlSnippet}`);

  console.log(`- Fukuoka Obon (${fukuokaObonUrl}):`);
  console.log(`  HTTP Status: ${getUrlHeaders(fukuokaObonUrl).status}`);
  console.log(`  Canonical Tag: ${getCanonical(fukuokaObonUrl).htmlSnippet}`);

  // 3. Task C Deactivated Recruit News 404 Check
  console.log('\n--- 3. Task C Deactivated Recruit News 404 Check ---');
  const deactivated1 = 'https://www.sutoroberrys.jp/store/yokohama/news/news-1770103168917-copy-1774078959842';
  const deactivated2 = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1773289329952';

  console.log(`- Deactivated Yokohama Recruit (${deactivated1}): HTTP Status = ${getUrlHeaders(deactivated1).status}`);
  console.log(`- Deactivated Fukuoka Recruit (${deactivated2}): HTTP Status = ${getUrlHeaders(deactivated2).status}`);
}

verifyNews().catch(console.error);
