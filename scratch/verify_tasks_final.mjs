import { execSync } from 'child_process';
import https from 'https';

const testDeactivatedBlogs = [
  'd8605d6a-7f00-489c-b239-9b4b206f9297',
  'b442cdf7-96bb-427d-a840-757da6608e14',
  '5843e217-c1a0-4a9c-8dd5-cfac9b81f873',
  '574c9b2c-c8f3-4957-a336-7a58c5c6517c',
  '86effd86-cc4a-4e1c-a6eb-6145e7cdf3db'
];

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

async function runFinalVerify() {
  console.log('===========================================================');
  console.log('=== FINAL PRODUCTION VERIFICATION AFTER DEPLOY ===');
  console.log('===========================================================\n');

  // 1. Verify 404 Status for Deactivated Test Blogs
  console.log('--- 1. VERIFYING 404 FOR DEACTIVATED TEST BLOGS ---');
  for (const id of testDeactivatedBlogs) {
    const url = `https://www.sutoroberrys.jp/store/fukuoka/diary/post/${id}`;
    const res = getUrlHeaders(url);
    console.log(`- Test Blog [${id}]: HTTP Status = ${res.status}`);
  }

  // 2. Verify 301 Redirect for Cross-Store Path Access
  console.log('\n--- 2. VERIFYING 301 REDIRECT FOR OTHER STORE PATH (Fukuoka Blog accessed via Yokohama URL) ---');
  const fukuokaBlogId = '26b90d63-4f34-4bb9-8af7-6c37f1e9f6ad'; // カズヤの日記 (福岡所属)
  const crossStoreUrl = `https://www.sutoroberrys.jp/store/yokohama/diary/post/${fukuokaBlogId}`;
  const redirectRes = getUrlHeaders(crossStoreUrl);
  console.log(`- Request URL: ${crossStoreUrl}`);
  console.log(`  HTTP Status: ${redirectRes.status}`);
  console.log(`  Location Header: ${redirectRes.location}`);

  // 3. Verify Multi-Store Cast (ユウト) Access & Canonical
  console.log('\n--- 3. VERIFYING MULTI-STORE CAST (ユウト) CANONICAL ---');
  const multiStoreBlogId = '1e6894a8-560e-4c46-9c3b-7817b6319827'; // 初の黒毛和牛 (tokyo, yokohama兼任)
  const yokohamaUrl = `https://www.sutoroberrys.jp/store/yokohama/diary/post/${multiStoreBlogId}`;
  const yokohamaRes = getUrlHeaders(yokohamaUrl);
  console.log(`- Multi-Store Blog accessed via Yokohama URL: HTTP Status = ${yokohamaRes.status} (No Redirect)`);

  const html = execSync(`curl.exe -s "${yokohamaUrl}"`, { encoding: 'utf8' });
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  console.log(`  Canonical URL output in HTML: ${canonicalMatch ? canonicalMatch[1] : 'Not Found'}`);
}

runFinalVerify().catch(console.error);
