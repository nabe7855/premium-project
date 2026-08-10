import { execSync } from 'child_process';

function revalidateCastListFix() {
  const path = '/store/fukuoka/news/news-20260810-campaign';
  const payload = JSON.stringify({ path });
  const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
  const res = execSync(cmd, { encoding: 'utf8' });
  console.log(`Revalidated "${path}":`, res);
}

revalidateCastListFix();
