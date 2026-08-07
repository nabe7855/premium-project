import fs from 'fs';

function verifySSR() {
  console.log('=== VERIFYING SSR HTML OUTPUT (FINAL) ===\n');

  const html = fs.readFileSync('scratch/test_ssr.html', 'utf8');

  // 1. 女性用風俗のキーワードカウント
  const fuzokuMatch = html.match(/女性用風俗/g) || [];
  console.log(`1. "女性用風俗" Keyword Count: ${fuzokuMatch.length} (Expected >= 1) -> ${fuzokuMatch.length >= 1 ? '✅ PASS' : '❌ FAIL'}`);

  // 2. 信頼バッジ (グループ累計 口コミ4,000件以上)
  const badgeMatch = html.includes('グループ累計 口コミ4,000件以上');
  console.log(`2. Trust Badge "グループ累計 口コミ4,000件以上": ${badgeMatch ? '✅ PASS' : '❌ FAIL'}`);

  // 3. 福岡店・横浜店の料金テキスト
  const fukuokaPriceMatch = html.includes('福岡店の料金プラン') && html.includes('12,000');
  const yokohamaPriceMatch = html.includes('横浜店の料金プラン') && html.includes('12,000');
  console.log(`3. Fukuoka Price in SSR HTML: ${fukuokaPriceMatch ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`4. Yokohama Price in SSR HTML: ${yokohamaPriceMatch ? '✅ PASS' : '❌ FAIL'}`);

  // 現物HTMLスニペット出力
  console.log('\n--- SSR HTML Snippets ---');
  const fuzokuIdx = html.indexOf('女性用風俗');
  if (fuzokuIdx !== -1) {
    console.log('FV Text Snippet:', html.substring(fuzokuIdx - 50, fuzokuIdx + 150).replace(/\s+/g, ' '));
  }
}

verifySSR();
