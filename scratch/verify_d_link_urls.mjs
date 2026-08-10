import { execSync } from 'child_process';

function verifyLinkUrls() {
  console.log('=== VERIFYING TASK D INTERNAL LINK URLS ===\n');

  const urls = [
    'https://www.sutoroberrys.jp/store/fukuoka/price',
    'https://www.sutoroberrys.jp/store/fukuoka/cast',
    'https://www.sutoroberrys.jp/store/fukuoka/schedule'
  ];

  for (const url of urls) {
    const status = execSync(`curl.exe -o /dev/null -s -w "%{http_code}" "${url}"`, { encoding: 'utf8' });
    console.log(`URL: ${url} -> Status: ${status} (Expected: 200)`);
  }
}

verifyLinkUrls();
