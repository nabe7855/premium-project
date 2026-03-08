const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAllReviews(couplesId) {
  let allText = '';
  let page = 1;
  console.log(`🚀 ホテルID: ${couplesId} の全口コミページを巡回中...`);

  while (true) {
    const url = `https://couples.jp/hotel/${couplesId}/review?page=${page}`;
    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000,
      });
      const $ = cheerio.load(res.data);

      const reviews = $('.hotel-review-item-main-comment, .hotel-review-item');
      if (reviews.length === 0) break;

      reviews.each((i, el) => {
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        if (text) allText += '【口コミ】' + text + '\n\n';
      });

      console.log(`   📄 ページ ${page} 完了 (${reviews.length}件取得)`);
      if (page >= 10) break; // テストのため10ページまでに制限
      page++;
      await new Promise((r) => setTimeout(r, 1000));
    } catch (e) {
      console.log(`   ⚠️ ページ ${page} で終了 (またはエラー: ${e.message})`);
      break;
    }
  }
  return allText;
}

// HOTEL D 大宮(52296)
scrapeAllReviews('52296').then((content) => {
  console.log(`\n✅ 最終取得文字数: ${content.length} 文字`);
  if (content.length > 0) {
    console.log('--- 取得データの冒頭100文字 ---');
    console.log(content.substring(0, 100) + '...');
  }
});
