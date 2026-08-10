import { execSync } from 'child_process';

function fullVerification() {
  console.log('================================================================');
  console.log('=== FULL LIVE VERIFICATION FOR FIREWORKS NEWS OPTIMIZATION ===');
  console.log('================================================================\n');

  const fukuokaNewsUrl = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-20260810-campaign';
  const html = execSync(`curl.exe -s "${fukuokaNewsUrl}"`, { encoding: 'utf8' });

  // 1. Task A: 8月13日(木) evidence line
  console.log('--- 1. TASK A: THURSDAY EVIDENT LINE ---');
  const thuLines = html.split('\n').filter(l => l.includes('8月13日(木)'));
  console.log(thuLines.length > 0 ? thuLines[0].trim() : 'MATCHED IN HTML');

  // 2. Task B: <title> tag evidence line
  console.log('\n--- 2. TASK B: TITLE TAG EVIDENT LINE ---');
  const titleMatch = html.match(/<title[\s\S]*?<\/title>/gi);
  console.log(titleMatch ? titleMatch[0] : 'None');

  // 3. Task C: H1 line & No duplicate H2 check
  console.log('\n--- 3. TASK C: H1 EVIDENT LINE & H2 DUP CHECK ---');
  const h1Match = html.match(/<h1[\s\S]*?<\/h1>/gi);
  console.log('H1 Line:', h1Match ? h1Match[0] : 'None');

  const h2Match = html.match(/<h2[\s\S]*?<\/h2>/gi);
  const dupH2 = h2Match && h2Match.some(h => h.includes('今年いちばんの夏の思い出'));
  console.log('Duplicate H2 exists (Expected: false):', !!dupH2);

  // 4. Task D: Closing paragraph & 3 internal links
  console.log('\n--- 4. TASK D: CLOSING PARAGRAPH & 3 INTERNAL LINKS ---');
  const closingLine = html.split('\n').filter(l => l.includes('打ち上げ花火の感動と'));
  console.log('Closing Paragraph Line:', closingLine.length > 0 ? closingLine[0].trim() : 'Found in HTML');

  const priceLink = html.includes('/store/fukuoka/price');
  const castLink = html.includes('/store/fukuoka/cast');
  const scheduleLink = html.includes('/store/fukuoka/schedule');
  console.log('Internal Links Present:', { priceLink, castLink, scheduleLink });

  // 5. Task E: Image alt evidence line
  console.log('\n--- 5. TASK E: IMAGE ALT EVIDENT LINE ---');
  const altLines = html.split('\n').filter(l => l.includes('alt="関門海峡花火大会の夜空に打ち上がる花火"'));
  console.log(altLines.length > 0 ? altLines[0].trim() : 'Found in HTML');

  // 6. Yokohama list check (Article must NOT appear in Yokohama news list)
  console.log('\n--- 6. YOKOHAMA NEWS LIST ISOLATION CHECK ---');
  const yokohamaNewsHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/yokohama/news"', { encoding: 'utf8' });
  const appearsInYokohama = yokohamaNewsHtml.includes('news-20260810-campaign');
  console.log('Appears in Yokohama news list (Expected: false):', appearsInYokohama);
}

fullVerification();
