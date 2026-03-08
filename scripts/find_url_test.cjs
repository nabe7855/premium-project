const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function findHotelUrl(hotelName, address) {
  const query = encodeURIComponent(`${hotelName} ${address} couples.jp`);
  const searchUrl = `https://www.google.com/search?q=${query}`;

  console.log(`🔍 Google検索中: ${hotelName}`);

  try {
    const res = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(res.data);
    let targetUrl = '';

    // Googleの検索結果に含まれるcouples.jpのリンクを探す
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('couples.jp/hotel/')) {
        const match = href.match(/https:\/\/couples\.jp\/hotel\/\d+/);
        if (match) {
          targetUrl = match[0];
          return false;
        }
      }
    });

    return targetUrl;
  } catch (e) {
    return '';
  }
}

// HOTEL D 大宮 でテスト
findHotelUrl('HOTEL D 大宮', '埼玉県さいたま市').then((url) => {
  console.log(`✅ URL発見: ${url}`);
});
