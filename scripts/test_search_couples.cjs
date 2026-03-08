const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// CSV読み込み
const csvPath = path.join(process.cwd(), 'data', 'hotels_base_data.csv');
const rawData = fs.readFileSync(csvPath, 'utf8');
const lines = rawData.split('\n').filter((l) => l.trim() !== '');
const headers = lines[0].split(',');
const hotels = lines.slice(1).map((line) => {
  // 簡易パース（カンマ区切り、引用符考慮）
  const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
  return {
    id: parts[0],
    name: parts[1]?.replace(/"/g, ''),
    address: parts[2]?.replace(/"/g, ''),
  };
});

async function findCouplesUrl(hotelName, address) {
  try {
    // Google検索結果からCouples.jpのURLを探す
    const query = encodeURIComponent(`${hotelName} ${address} couples.jp`);
    const searchUrl = `https://www.google.com/search?q=${query}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    let couplesUrl = '';

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('couples.jp/hotel/')) {
        // Googleの検索結果URLからクリーンなURLを抽出
        const match = href.match(/https:\/\/couples\.jp\/hotel\/\d+/);
        if (match) {
          couplesUrl = match[0];
          return false; // loop終了
        }
      }
    });

    return couplesUrl;
  } catch (e) {
    console.error(`Search failed for ${hotelName}: ${e.message}`);
    return '';
  }
}

async function testScrape(url) {
  if (!url) return null;
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(response.data);

    // 仮のセレクタ（実査が必要だが、一般的構造から推測）
    const amenities = [];
    $('.facility-item, .amenity-list-item').each((i, el) => {
      amenities.push($(el).text().trim());
    });

    const reviews = [];
    $('.review-content, .comment-box').each((i, el) => {
      reviews.push($(el).text().trim());
    });

    return { amenities, reviews };
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('🔍 Couples.jp URLの特定テスト (先頭3件)...');
  for (let i = 0; i < 3; i++) {
    const hotel = hotels[i];
    console.log(`\n🏢 ${hotel.name} を検索中...`);
    const url = await findCouplesUrl(hotel.name, hotel.address);
    if (url) {
      console.log(`✅ URL発見: ${url}`);
      const data = await testScrape(url);
      if (data) {
        console.log(
          `📊 取得データ: アメニティ ${data.amenities.length}件 / 口コミ ${data.reviews.length}件`,
        );
      }
    } else {
      console.log('❌ URLが見つかりませんでした。');
    }
    await new Promise((r) => setTimeout(r, 2000)); // 負荷軽減
  }
}

main();
