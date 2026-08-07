import { execSync } from 'child_process';

function getHttpStatusViaGet(url) {
  try {
    const code = execSync(`curl.exe -s -o NUL -w "%{http_code}" "${url}"`, { encoding: 'utf8' });
    return code;
  } catch (err) {
    return 'Error';
  }
}

console.log('--- Checking HTTP Status Codes via GET Request ---');
console.log('1. Deactivated Test Blog (574c9b2c):', getHttpStatusViaGet('https://www.sutoroberrys.jp/store/fukuoka/diary/post/574c9b2c-c8f3-4957-a336-7a58c5c6517c'));
console.log('2. Fukuoka Blog accessed via Yokohama URL (301 expected):', getHttpStatusViaGet('https://www.sutoroberrys.jp/store/yokohama/diary/post/26b90d63-4f34-4bb9-8af7-6c37f1e9f6ad'));
