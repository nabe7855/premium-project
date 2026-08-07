import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/store/yokohama/news/mousho-wari-2026';
console.log(`Fetching fresh HTML with cache bypass from: ${url}`);
const html = execSync(`curl.exe -s -H "Cache-Control: no-cache" -H "Pragma: no-cache" "${url}"`, { encoding: 'utf8' });

const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
console.log('Canonical URL in Fresh HTML:', canonicalMatch ? canonicalMatch[1] : 'Not Found');
