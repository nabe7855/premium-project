import { execSync } from 'child_process';

function revalidateSeiraPhotos() {
  const path = '/store/fukuoka/interview/-130642/seira-interview-vol4';
  const payload = JSON.stringify({ path });
  const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
  const res = execSync(cmd, { encoding: 'utf8' });
  console.log(`Revalidated "${path}":`, res);
}

revalidateSeiraPhotos();
