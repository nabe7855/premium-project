import { execSync } from 'child_process';

const testPosts = [
  '1e6894a8-560e-4c46-9c3b-7817b6319827',
  'ab430069-00ca-4562-b467-025779deed89'
];

console.log('===========================================================');
console.log('=== VERIFYING CANONICAL URL FOR MULTI-STORE CAST (ユウト) ===');
console.log('===========================================================\n');

testPosts.forEach(postId => {
  const url = `https://www.sutoroberrys.jp/store/yokohama/diary/post/${postId}`;
  console.log(`🔍 Testing URL: ${url}`);

  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);

  console.log(`  - Canonical URL output in HTML: ${canonicalMatch ? canonicalMatch[1] : 'Not Found'}`);
  console.log('-----------------------------------------------------------');
});
