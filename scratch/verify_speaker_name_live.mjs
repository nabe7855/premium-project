import { execSync } from 'child_process';

function verifySpeakerNameLive() {
  console.log('=== VERIFYING SPEAKER NAME UNDER AVATAR LIVE ===\n');

  const url = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';

  try {
    const payload = JSON.stringify({ path: '/store/fukuoka/interview/-130642/seira-interview-vol4' });
    execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
  } catch (e) {}

  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

  const hasAozoraName = html.includes('青空（せいら）');
  console.log('Has "青空（せいら）" in live HTML (Expected: true):', hasAozoraName);

  const lines = html.split('\n').filter(l => l.includes('青空（せいら）'));
  console.log('Sample line snippet with 青空（せいら）:\n', lines[0] ? lines[0].trim().slice(0, 200) : 'None');
}

verifySpeakerNameLive();
