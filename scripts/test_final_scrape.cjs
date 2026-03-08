const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRealReviews(hotelId) {
  // 正しいURL形式に修正
  const url = `https://couples.jp/hotel/${hotelId}/kuchikomi`;
  console.log(`🔍 アクセス中: ${url}`);

  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000,
    });
    const $ = cheerio.load(res.data);

    // 口コミ本文のクラスを特定して抽出
    const comments = [];
    $('.hotel-kuchikomi-txt').each((i, el) => {
      comments.push($(el).text().trim());
    });

    console.log(`✅ 口コミ ${comments.length} 件を発見しました。`);
    return comments.join('\n\n---\n\n');
  } catch (e) {
    console.log(`❌ エラー: ${e.message}`);
    return null;
  }
}

// HOTEL D 大宮(1965)
scrapeRealReviews('1965').then((txt) => {
  if (txt) {
    console.log(`\n取得文字数: ${txt.length} 文字`);
    console.log('冒頭:');
    console.log(txt.substring(0, 300));
  }
});
