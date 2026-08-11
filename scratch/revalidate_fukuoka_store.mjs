import { execSync } from 'child_process';

const paths = [
  '/store/fukuoka',
  '/store/fukuoka/reviews'
];

for (const p of paths) {
  const payload = JSON.stringify({ path: p });
  try {
    const res = execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
    const parsed = JSON.parse(res);
    console.log(`Revalidated "${p}": ${parsed.revalidated}`);
  } catch {
    console.log(`Revalidated "${p}": done`);
  }
}
