import { execSync } from 'child_process';

function triggerRevalidatePOST() {
  console.log('=== TRIGGERING REVALIDATION VIA POST ===\n');

  const paths = [
    '/amolab/fukuoka-recruit-guide',
    '/amolab/yokohama-recruit-guide',
    '/amolab/[slug]',
    '/ikeo/fukuoka-recruit-guide',
    '/ikeo/yokohama-recruit-guide',
    '/ikeo/[slug]',
    '/sitemap.xml'
  ];

  for (const p of paths) {
    try {
      const payload = JSON.stringify({ path: p });
      const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
      const res = execSync(cmd, { encoding: 'utf8' });
      console.log(`Revalidated path "${p}":`, res);
    } catch (e) {
      console.error(`Error revalidating path "${p}":`, e.message);
    }
  }
}

triggerRevalidatePOST();
