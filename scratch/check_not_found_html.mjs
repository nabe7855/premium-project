import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1773289329952';
console.log(`Checking HTML body for: ${url}`);
const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
console.log('Title tag in HTML:', titleMatch ? titleMatch[1] : 'No Title');
console.log('HTML includes "Not Found" or "見つかりません"?:', html.includes('404') || html.includes('Not Found') || html.includes('見つかりません'));
