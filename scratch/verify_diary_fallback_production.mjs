import { execSync } from 'child_process';

function verifyDiaryFallback() {
  console.log('=== VERIFYING DIARY FALLBACK TITLE IN PRODUCTION ===\n');

  const fukuokaTopHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka"', { encoding: 'utf8' });
  const titleMatches = fukuokaTopHtml.match(/青空（せいら）の日記（\d+年\d+月\d+日）/g) || [];

  console.log(`Found ${titleMatches.length} fallback title matches in Fukuoka store front:`);
  titleMatches.forEach(t => console.log('   ', t));

  const postDetailHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/diary/post/73111ada-641e-4d80-80b0-e9d791e6a1fa"', { encoding: 'utf8' });
  const detailTitleMatches = postDetailHtml.match(/青空（せいら）の日記（\d+年\d+月\d+日）/g) || [];
  console.log(`\nFound ${detailTitleMatches.length} fallback title matches in Post Detail page:`);
  detailTitleMatches.forEach(t => console.log('   ', t));
}

verifyDiaryFallback();
