const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('tmp_hotel_detail.html', 'utf-8');

// Save a clean readable snippet
const start = html.indexOf('hd-');
const excerpt = html.substring(Math.max(0, start - 50), start + 5000);
fs.writeFileSync('tmp_html_excerpt.txt', excerpt, 'utf-8');
console.log('Saved excerpt around hd- classes');

// Also search for key Japanese keywords line by line
const lines = html.split('\n');
const keywords = [
  '室',
  '部屋',
  '徒歩',
  '分',
  '休憩',
  '宿泊',
  '料金',
  'アメニティ',
  'サービス',
  '設備',
];
const matchedLines = lines
  .filter((l, i) => {
    const has = keywords.some((k) => l.includes(k));
    return has && l.includes('class=');
  })
  .slice(0, 40);
console.log('\n--- Lines with Japanese keywords and class ---');
matchedLines.forEach((l) => console.log(l.substring(0, 200)));
