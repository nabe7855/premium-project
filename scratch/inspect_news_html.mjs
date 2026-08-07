import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/store/yokohama/news/news-1784964648172';
console.log(`Fetching HTML from: ${url}`);
const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

console.log('HTML length:', html.length);
const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
if (headMatch) {
  console.log('--- Head Section Snippet ---');
  console.log(headMatch[0].slice(0, 1500));
} else {
  console.log('Head not found. Snippet of HTML:');
  console.log(html.slice(0, 1000));
}
