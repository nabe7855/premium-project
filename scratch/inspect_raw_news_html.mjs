import { execSync } from 'child_process';

function inspectRawNewsHtml() {
  console.log('=== INSPECTING LIVE HTML RAW ===\n');

  try {
    const raw = execSync('curl.exe -i -s "https://www.sutoroberrys.jp/store/fukuoka/news/news-20260810-campaign"', { encoding: 'utf8' });
    console.log(raw.slice(0, 1500));
  } catch (e) {
    console.error(e);
  }
}

inspectRawNewsHtml();
