import { execSync } from 'child_process';

function revalidateSeiraThumb() {
  const paths = [
    '/store/fukuoka/interview/-130642/seira-interview-vol4',
    '/store/fukuoka/interview',
    '/magazine/interview'
  ];

  for (const p of paths) {
    const payload = JSON.stringify({ path: p });
    const res = execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
    console.log(`Revalidated "${p}":`, res);
  }
}

revalidateSeiraThumb();
