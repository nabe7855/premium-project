import { execSync } from 'child_process';

function checkSeiraLocation() {
  console.log('=== CHECKING SEIRA INTERVIEW LOCATION LIVE ===\n');

  const targetUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';
  const castUrl = 'https://www.sutoroberrys.jp/store/fukuoka/cast/-130642';

  const status1 = execSync(`curl.exe -o /dev/null -s -w "%{http_code}" "${targetUrl}"`, { encoding: 'utf8' });
  console.log(`Interview Article URL: ${targetUrl} -> HTTP ${status1}`);

  const status2 = execSync(`curl.exe -o /dev/null -s -w "%{http_code}" "${castUrl}"`, { encoding: 'utf8' });
  console.log(`Cast Profile URL: ${castUrl} -> HTTP ${status2}`);

  const castHtml = execSync(`curl.exe -s "${castUrl}"`, { encoding: 'utf8' });
  const hasLinkInProfile = castHtml.includes('seira-interview-vol4');
  console.log(`Link in Seira's profile page (Expected: true):`, hasLinkInProfile);
}

checkSeiraLocation();
