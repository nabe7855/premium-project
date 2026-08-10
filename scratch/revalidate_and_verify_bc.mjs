import { execSync } from 'child_process';

function revalidateAndVerifyBC() {
  console.log('=== REVALIDATING & VERIFYING TASK B & C LIVE HTML ===\n');

  const path = '/store/fukuoka/news/news-20260810-campaign';
  const payload = JSON.stringify({ path });
  const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
  execSync(cmd, { encoding: 'utf8' });

  const html = execSync(`curl.exe -s "https://www.sutoroberrys.jp${path}"`, { encoding: 'utf8' });

  // 1. New <title> tag (Task B)
  const titleMatch = html.match(/<title>.*?<\/title>/g);
  console.log('Task B Title Tag:', titleMatch);

  // 2. H1 and H2 check (Task C)
  const h1Match = html.match(/<h1.*?>.*?<\/h1>/g);
  const h2Match = html.match(/<h2.*?>.*?<\/h2>/g);

  console.log('H1 Tag:', h1Match);
  console.log('H2 Tags:', h2Match);

  const duplicateH2 = h2Match && h2Match.some(h => h.includes('今年いちばんの夏の思い出を'));
  console.log('Has Duplicate H2 (Expected: false):', duplicateH2);
}

revalidateAndVerifyBC();
