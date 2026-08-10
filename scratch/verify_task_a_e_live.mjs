import { execSync } from 'child_process';

function verifyTaskAE() {
  console.log('=== VERIFYING TASK A & E LIVE HTML ===\n');

  const html = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/news/news-20260810-campaign"', { encoding: 'utf8' });

  // 1. Task A evidence line (8月13日(木))
  const thursdayMatch = html.match(/.*8月13日\(木\).*/g);
  console.log('Task A Evidence Lines (8月13日(木)):', thursdayMatch);

  // Check if any 8月13日(水) remains
  const wednesdayMatch = html.match(/.*8月13日\(水\).*/g);
  console.log('Remaining 8月13日(水) count (Expected: 0):', wednesdayMatch ? wednesdayMatch.length : 0);

  // 2. Task E evidence line (alt)
  const altMatch = html.match(/alt="関門海峡花火大会の夜空に打ち上がる花火"/g);
  console.log('Task E Alt Match Line:', altMatch);
}

verifyTaskAE();
