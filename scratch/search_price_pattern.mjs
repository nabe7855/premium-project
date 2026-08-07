import fs from 'fs';

function searchPattern() {
  const fRaw = fs.readFileSync('scratch/fukuoka_price_raw.html', 'utf8');
  console.log('=== SEARCHING FOR NUMERIC AMOUNTS IN FUKUOKA PRICE PAGE ===\n');

  const matches = fRaw.match(/¥[0-9,]+/g) || fRaw.match(/12,000|16,000|20,000/g) || [];
  console.log('Matches:', matches.slice(0, 20));

  // 「60分」の周辺テキストを100文字抽出
  const idx60 = fRaw.indexOf('60分');
  if (idx60 !== -1) {
    console.log('\nSnippet around "60分":');
    console.log(fRaw.substring(idx60 - 50, idx60 + 200));
  }
}

searchPattern();
