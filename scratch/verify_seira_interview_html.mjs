import { execSync } from 'child_process';

function verifySeiraHtml() {
  console.log('=== VERIFYING SEIRA INTERVIEW HTML BODY LIVE ===\n');

  const url = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';
  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

  const hasHeading1 = html.includes('35歳で一歩を踏み出した理由');
  const hasHeading2 = html.includes('徹底した自分磨きと気配り');
  const hasItouText = html.includes('セイラさん、本日はよろしくお願いします！');

  console.log('Has Heading 1 (Expected: true):', hasHeading1);
  console.log('Has Heading 2 (Expected: true):', hasHeading2);
  console.log('Has Interviewer Dialogue Text (Expected: true):', hasItouText);
}

verifySeiraHtml();
