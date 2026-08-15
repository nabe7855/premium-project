import { execSync } from 'child_process';

function verifyBubbleNameLive() {
  console.log('=== VERIFYING BUBBLE AVATAR DISPLAY NAME LIVE ===\n');

  const url = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';

  try {
    const payload = JSON.stringify({ path: '/store/fukuoka/interview/-130642/seira-interview-vol4' });
    execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
  } catch (e) {}

  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

  const hasAozoraName = html.includes('青空（せいら）');
  console.log('Has "青空（せいら）" in live HTML (Expected: true):', hasAozoraName);

  // Check how many times 青空（せいら） appears in the dialogue HTML
  const bubbleMatches = html.match(/青空（せいら）/g) || [];
  console.log('Total occurrences of "青空（せいら）" in HTML:', bubbleMatches.length);
}

verifyBubbleNameLive();
