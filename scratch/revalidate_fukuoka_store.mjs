import { execSync } from 'child_process';

function revalidateStorePages() {
  console.log('=== REVALIDATING STORE PAGES ===\n');

  const paths = [
    '/store/fukuoka',
    '/store/yokohama',
    '/store/fukuoka/news',
    '/store/yokohama/news'
  ];

  for (const p of paths) {
    try {
      const payload = JSON.stringify({ path: p });
      const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
      const res = execSync(cmd, { encoding: 'utf8' });
      console.log(`Revalidated "${p}":`, res);
    } catch (e) {
      console.error(`Error revalidating "${p}":`, e.message);
    }
  }
}

revalidateStorePages();
