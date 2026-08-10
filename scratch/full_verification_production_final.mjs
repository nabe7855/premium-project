import { execSync } from 'child_process';

function runProductionVerification() {
  console.log('================================================================');
  console.log('=== FULL PRODUCTION VERIFICATION (CURL EVIDENCE RETRIEVAL) ===');
  console.log('================================================================\n');

  // 1. Fukuoka Store Top Page
  console.log('--- 1. FUKUOKA STORE TOP PAGE (REVIEW STATS & CARDS) ---');
  const fukuokaHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka"', { encoding: 'utf8' });

  // Review stats
  const fukuokaStatsMatch = fukuokaHtml.match(/<div class="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">([^<]+)<\/div>/g) || [];
  console.log('Fukuoka Review Stats Elements (CURL Raw HTML):');
  fukuokaStatsMatch.forEach(m => console.log('   ', m));

  // Fukuoka Diary Card Fallback Title
  const fukuokaDiaryMatches = fukuokaHtml.match(/青空（せいら）の日記（\d+年\d+月\d+日）/g) || [];
  console.log('\nFukuoka Diary Card Title Matches (CURL Raw HTML):');
  fukuokaDiaryMatches.forEach(m => console.log('   ', m));

  // 2. Yokohama Store Top Page
  console.log('\n--- 2. YOKOHAMA STORE TOP PAGE (REVIEW STATS) ---');
  const yokohamaHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/yokohama"', { encoding: 'utf8' });

  const yokohamaStatsMatch = yokohamaHtml.match(/<div class="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">([^<]+)<\/div>/g) || [];
  console.log('Yokohama Review Stats Elements (CURL Raw HTML):');
  yokohamaStatsMatch.forEach(m => console.log('   ', m));

  // 3. Fukuoka Diary List Page
  console.log('\n--- 3. FUKUOKA DIARY LIST PAGE (FALLBACK TITLE) ---');
  const diaryListHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/diary"', { encoding: 'utf8' });
  const diaryListMatches = diaryListHtml.match(/青空（せいら）の日記（\d+年\d+月\d+日）/g) || [];
  console.log('Fukuoka Diary List Title Matches (CURL Raw HTML):');
  diaryListMatches.forEach(m => console.log('   ', m));

  // 4. Fukuoka Diary Detail Page
  console.log('\n--- 4. FUKUOKA DIARY DETAIL PAGE (FALLBACK TITLE & H1) ---');
  const diaryDetailHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/diary/post/73111ada-641e-4d80-80b0-e9d791e6a1fa"', { encoding: 'utf8' });
  const diaryDetailMatches = diaryDetailHtml.match(/青空（せいら）の日記（\d+年\d+月\d+日）/g) || [];
  console.log('Fukuoka Diary Detail Title Matches (CURL Raw HTML):');
  diaryDetailMatches.forEach(m => console.log('   ', m));
}

runProductionVerification();
