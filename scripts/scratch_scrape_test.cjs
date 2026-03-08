const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getHotelData(name, address) {
  // 1. Google検索を介さず、Couples.jpのサイト内検索をシミュレート
  // Couples.jp の検索は GET /search?word=...
  const searchUrl = `https://couples.jp/search?word=${encodeURIComponent(name)}`;

  console.log(`🔍 検索中: ${name} (${searchUrl})`);

  try {
    const res = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
    });

    const $ = cheerio.load(res.data);

    // 検索結果から最も適切なリンクを探す
    let hotelUrl = '';
    $('.hotel-list-item-name a, a[href^="/hotel/"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('/hotel/')) {
        hotelUrl = 'https://couples.jp' + href;
        return false; // 最初に見つかったものを一旦採用
      }
    });

    if (!hotelUrl) return { error: 'URL not found' };

    console.log(`✨ 詳細ページ発見: ${hotelUrl}`);

    // 2. 詳細ページから情報を抜く
    const detailRes = await axios.get(hotelUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $$ = cheerio.load(detailRes.data);

    // アメニティ（設備）
    const amenities = [];
    $$('.facility-item-name, .amenity-item-name').each((i, el) => {
      amenities.push($$(el).text().trim());
    });

    // 口コミ
    const reviews = [];
    $$('.review-item-content, .review-body').each((i, el) => {
      reviews.push($$(el).text().trim());
    });

    return {
      url: hotelUrl,
      amenities: amenities.join(' / '),
      reviews: reviews.join(' | '),
    };
  } catch (e) {
    return { error: e.message };
  }
}

// テスト実行
getHotelData('HOTEL D 大宮', '埼玉県さいたま市').then(console.log);
