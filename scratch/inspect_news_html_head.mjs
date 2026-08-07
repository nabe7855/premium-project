import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/store/yokohama/news/news-1784964648172';
const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

const canonicalMatches = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/gi);
console.log('Canonical matches:', canonicalMatches);

const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No Title');
