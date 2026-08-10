import { execSync } from 'child_process';

function revalidateSeiraProfile() {
  const paths = [
    '/store/fukuoka/cast/-130642',
    '/store/fukuoka/interview',
    '/store/fukuoka/interview/-130642/seira-interview-vol4'
  ];

  for (const p of paths) {
    const payload = JSON.stringify({ path: p });
    const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
    const res = execSync(cmd, { encoding: 'utf8' });
    console.log(`Revalidated "${p}":`, res);
  }
}

revalidateSeiraProfile();
