import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/?v=' + Date.now();
console.log(`Fetching fresh HTML from home page with timestamp: ${url}`);
try {
  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

  const badgeMatches = html.match(/<span[^>]*>[^<]*⭐[^<]*<\/span>/g);
  const sinceMatches = html.match(/<span[^>]*>[^<]*2018[^<]*<\/span>/g);

  console.log('--- Fresh HTML ⭐ Badges ---');
  console.log(badgeMatches);

  console.log('--- Fresh HTML Since 2018 Badges ---');
  console.log(sinceMatches);
} catch (err) {
  console.error(err);
}
