import { execSync } from 'child_process';

function triggerRevalidate() {
  const paths = [
    '/store/fukuoka/news/news-20260810-campaign',
    '/store/fukuoka/news',
    '/store/fukuoka'
  ];

  for (const path of paths) {
    const payload = JSON.stringify({ path });
    const cmd = `curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`;
    const res = execSync(cmd, { encoding: 'utf8' });
    console.log(`Revalidated "${path}":`, res);
  }
}

triggerRevalidate();
