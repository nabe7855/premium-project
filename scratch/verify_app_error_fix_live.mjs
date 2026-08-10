import { execSync } from 'child_process';

function verifyAppErrorFix() {
  console.log('=== VERIFYING APPLICATION ERROR FIX LIVE ===\n');

  const slugUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';
  const uuidUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/8df77013-ed2c-435f-8f9e-83f1cb60f41f/seira-interview-vol4';

  for (const url of [slugUrl, uuidUrl]) {
    const payload = JSON.stringify({ path: url.replace('https://www.sutoroberrys.jp', '') });
    execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });

    const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });
    const hasAppError = html.includes('Application error');
    const hasContent = html.includes('35歳で一歩を踏み出した理由');

    console.log(`URL: ${url}`);
    console.log(`  Has Application error (Expected: false): ${hasAppError}`);
    console.log(`  Has Full Article Content (Expected: true): ${hasContent}`);
    console.log('---');
  }
}

verifyAppErrorFix();
