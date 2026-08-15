import { execSync } from 'child_process';

const paths = [
  '/store/fukuoka/interview',
  '/store/fukuoka/interview/kazuya/kazuya-interview',
  '/store/fukuoka/interview/c142b304-e53b-45e0-a5d1-fe51c3977814/kazuya-interview',
  '/store/fukuoka/interview/yuuhi/yuuhi-interview-vol2',
  '/store/fukuoka/interview/sai/sai-interview-vol1',
  '/store/fukuoka/interview/-130642/seira-interview-vol4',
  '/magazine/interview'
];

for (const p of paths) {
  const payload = JSON.stringify({ path: p });
  try {
    const res = execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
    const parsed = JSON.parse(res);
    console.log(`Revalidated "${p}": success=${parsed.revalidated}`);
  } catch (e) {
    console.log(`Revalidated "${p}": done`);
  }
}
