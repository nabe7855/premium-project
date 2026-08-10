import { execSync } from 'child_process';

function verifyFaviconProduction() {
  console.log('=== VERIFYING PRODUCTION FAVICON RESPONSE ===\n');

  const faviconUrl = 'https://www.sutoroberrys.jp/favicon.png';
  const status = execSync(`curl.exe -s -o NUL -w "%{http_code}" "${faviconUrl}"`, { encoding: 'utf8' });
  console.log(`Favicon URL: ${faviconUrl}`);
  console.log(`HTTP Status: ${status}`);

  const headers = execSync(`curl.exe -sI "${faviconUrl}"`, { encoding: 'utf8' });
  const clMatch = headers.match(/content-length:\s*(\d+)/i);
  console.log(`Content-Length:`, clMatch ? `${clMatch[1]} bytes` : 'NOT FOUND');
}

verifyFaviconProduction();
