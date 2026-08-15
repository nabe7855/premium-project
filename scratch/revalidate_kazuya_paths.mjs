import { execSync } from 'child_process';

function revalidateKazuyaPaths() {
  console.log('=== REVALIDATING KAZUYA INTERVIEW PATHS ===\n');

  const paths = [
    '/store/fukuoka/interview/c142b304-e53b-45e0-a5d1-fe51c3977814/kazuya-interview',
    '/store/fukuoka/interview/kazuya/kazuya-interview',
    '/store/fukuoka/interview',
    '/magazine/interview'
  ];

  for (const p of paths) {
    const payload = JSON.stringify({ path: p });
    const res = execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
    console.log(`Revalidated "${p}":`, res);
  }
}

revalidateKazuyaPaths();
