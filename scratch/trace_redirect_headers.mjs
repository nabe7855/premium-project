import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/store/yokohama/news/news-1785225904472-copy-1785376605692';
console.log(`Tracing headers for GET request to: ${url}`);
try {
  const out = execSync(`curl.exe -s -i "${url}"`, { encoding: 'utf8' });
  console.log('--- Response Headers Snippet ---');
  console.log(out.slice(0, 1000));
} catch (err) {
  console.error(err);
}
