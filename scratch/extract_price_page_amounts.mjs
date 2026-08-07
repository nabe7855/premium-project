import fs from 'fs';

function extractPriceAmounts() {
  console.log('=== EXTRACTING EXACT PRICE TAGS FROM FUKUOKA & YOKOHAMA PRICE PAGES ===\n');

  const fukuokaRaw = fs.readFileSync('scratch/fukuoka_price_raw.html', 'utf8');
  const yokohamaRaw = fs.readFileSync('scratch/yokohama_price_raw.html', 'utf8');

  console.log('【Fukuoka Price Page (/store/fukuoka/price) Amount Snippets】');
  const fMatches = fukuokaRaw.match(/<span[^>]*>[^<]*¥[^<]*<\/span>/g) || [];
  console.log(fMatches.slice(0, 10));

  console.log('\n【Yokohama Price Page (/store/yokohama/price) Amount Snippets】');
  const yMatches = yokohamaRaw.match(/<span[^>]*>[^<]*¥[^<]*<\/span>/g) || [];
  console.log(yMatches.slice(0, 10));
}

extractPriceAmounts();
