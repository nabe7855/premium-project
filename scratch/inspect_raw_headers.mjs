import { execSync } from 'child_process';

function inspectRawHeaders() {
  console.log('=== RAW HEADERS FOR /amolab/fukuoka-recruit-guide ===\n');

  try {
    const raw = execSync('curl.exe -i -s "https://www.sutoroberrys.jp/amolab/fukuoka-recruit-guide"', { encoding: 'utf8' });
    console.log(raw.slice(0, 1000));
  } catch (e) {
    console.error(e.message);
  }
}

inspectRawHeaders();
