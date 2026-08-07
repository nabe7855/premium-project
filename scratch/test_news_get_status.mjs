import { execSync } from 'child_process';

function getHttpStatusViaGet(url) {
  try {
    const code = execSync(`curl.exe -s -o NUL -w "%{http_code}" "${url}"`, { encoding: 'utf8' });
    return code;
  } catch (err) {
    return 'Error';
  }
}

console.log('--- Checking News HTTP Status Codes via GET Request ---');
console.log('1. Deactivated Recruit News (news-1773289329952):', getHttpStatusViaGet('https://www.sutoroberrys.jp/store/fukuoka/news/news-1773289329952'));
console.log('2. Fukuoka News accessed via Yokohama URL (301 expected):', getHttpStatusViaGet('https://www.sutoroberrys.jp/store/yokohama/news/news-1785225904472-copy-1785376605692'));
console.log('3. Valid Yokohama News (200 expected):', getHttpStatusViaGet('https://www.sutoroberrys.jp/store/yokohama/news/news-20260803-info'));
