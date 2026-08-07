import https from 'https';
import fs from 'fs';

function fetchProdHtml() {
  console.log('=== FETCHING PRODUCTION HTML FROM https://www.sutoroberrys.jp/ ===\n');

  https.get('https://www.sutoroberrys.jp/', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      fs.writeFileSync('scratch/prod_ssr_output.html', data, 'utf8');
      console.log(`✅ Production HTML fetched. Length: ${data.length} bytes.`);

      // 1. キーワード女性用風俗
      const fuzokuMatches = data.match(/女性用風俗/g) || [];
      console.log(`\n1. Keyword "女性用風俗" occurrences: ${fuzokuMatches.length}`);

      // 2. 信頼バッジ
      const badgeText = data.includes('グループ累計 口コミ4,000件以上');
      console.log(`2. Trust badge "グループ累計 口コミ4,000件以上": ${badgeText}`);

      // 3. 料金表示
      const fukuokaPrice = data.includes('福岡店の料金プラン') && data.includes('12,000');
      const yokohamaPrice = data.includes('横浜店の料金プラン') && data.includes('12,000');
      console.log(`3. Fukuoka Price (12,000): ${fukuokaPrice}`);
      console.log(`4. Yokohama Price (12,000): ${yokohamaPrice}`);

      // 現物行の抽出
      console.log('\n--- EXTRACTED PRODUCTION HTML LINES ---');
      const lines = data.split('\n');
      for (const line of lines) {
        if (line.includes('女性用風俗') || line.includes('グループ累計') || line.includes('福岡店の料金プラン') || line.includes('12,000')) {
          console.log(line.trim());
        }
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching production HTML:', err);
  });
}

fetchProdHtml();
