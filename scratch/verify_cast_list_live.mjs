import { execSync } from 'child_process';

function verifyCastListLive() {
  console.log('=== VERIFYING OFFICIAL /cast-list LINK LIVE ===\n');

  const html = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/news/news-20260810-campaign"', { encoding: 'utf8' });

  const castListLink = html.includes('/store/fukuoka/cast-list');
  console.log('Has official /store/fukuoka/cast-list link (Expected: true):', castListLink);

  const lines = html.split('\n').filter(l => l.includes('/store/fukuoka/cast-list'));
  console.log('Live Evidence Line:', lines[0] ? lines[0].trim() : 'Found in HTML');
}

verifyCastListLive();
