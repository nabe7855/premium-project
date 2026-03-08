const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Couples.jp の特定のホテルページからすべての口コミを抜き出す
 */
async function scrapeAllReviews(hotelId) {
  const reviews = [];
  let page = 1;

  while (true) {
    const url = `https://couples.jp/hotel/${hotelId}/review?page=${page}`;
    console.log(`      📄 Scraping page ${page}...`);

    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      const $ = cheerio.load(res.data);
      const items = $('.hotel-review-item, .review-body'); // 実際のセレクタに合わせる

      if (items.length === 0) break;

      items.each((i, el) => {
        reviews.push($(el).text().trim().replace(/\s+/g, ' '));
      });

      // 次のページがあるか判定 (とりあえず最大10ページ程度に制限)
      if (page >= 10) break;
      page++;
      await new Promise((r) => setTimeout(r, 2000)); // 負荷軽減
    } catch (e) {
      console.error(`      Error: ${e.message}`);
      break;
    }
  }
  return reviews;
}

// HOTEL D 大宮(52296) でテスト
// scrapeAllReviews('52296').then(res => console.log(`Total Reviews: ${res.length}`));
