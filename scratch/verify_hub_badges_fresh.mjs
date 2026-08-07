import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/';
console.log(`Fetching fresh HTML from home page: ${url}`);
try {
  const html = execSync(`curl.exe -s -H "Cache-Control: no-cache" -H "Pragma: no-cache" "${url}"`, { encoding: 'utf8' });

  // Extract snippet containing badges
  const badgeSection = html.match(/<div[^>]*class="[^"]*flex flex-wrap gap-2[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

  console.log('--- Fresh HTML Badges Snippet (PC) ---');
  if (badgeSection) {
    console.log(badgeSection[0]);
  } else {
    // fallback regex for badge text
    const textMatches = html.match(/⭐[^\n<]+/g);
    console.log('Badge Text Matches:', textMatches);
  }
} catch (err) {
  console.error(err);
}
