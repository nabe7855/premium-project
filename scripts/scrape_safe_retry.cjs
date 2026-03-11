const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const cheerio = require('cheerio');

const prisma = new PrismaClient();
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (res.ok) return await res.text();
      if (res.status === 404) {
        return { error: '404' };
      }
      console.log(`Fetch failed: ${url} - Status: ${res.status}`);
    } catch (e) {
      console.log(`Fetch error: ${url} - ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 3000 * (i + 1))); // Slower backoff
  }
  return null;
}

async function scrapeHotelDetail(hotel) {
  // If it's a Google ID, we know the direct URL pattern won't work on Couples
  // but we'll try once just to be sure as per user request for "safe" retry.
  const url = `https://couples.jp/hotel-details/${hotel.place_id}`;
  const response = await fetchPage(url);

  if (!response || response.error) {
    return response?.error === '404' ? { error: '404' } : null;
  }

  const html = response;
  const $ = cheerio.load(html);

  const prText = $('.hd-pr').text().trim();
  const msgText = $('#premium_msg').text().trim() || $('.hd-message__text').text().trim();
  const rawDescription = (prText + '\n' + msgText).trim();

  const prices = {};
  $('.hd-tablePrice tr').each((_, tr) => {
    const category = $(tr).find('.hd-tablePrice__category').text().trim();
    if (!category) return;
    const categoryPlans = [];
    $(tr)
      .find('.hd-pricePlan li')
      .each((_, li) => {
        const title = $(li).find('.hd-pricePlan__title').text().trim();
        const priceRange = $(li).find('.hd-priceRange__price').text().trim();
        const timezone = $(li).find('.hd-timezone').text().trim().replace(/\s+/g, ' ');
        categoryPlans.push({ title, price: priceRange, time: timezone });
      });
    prices[category] = categoryPlans;
  });

  const amenities = [];
  $('.hd-facility__list li').each((_, li) => {
    amenities.push(
      $(li)
        .text()
        .trim()
        .replace(/※一部$/, ''),
    );
  });

  const reviews = [];
  const reviewUrl = `${url}/review`;
  const reviewHtml = await fetchPage(reviewUrl);
  if (reviewHtml && typeof reviewHtml === 'string') {
    const $rev = cheerio.load(reviewHtml);
    $rev('.hd-reviewItem').each((i, el) => {
      if (i >= 10) return;
      const title = $rev(el).find('.hd-reviewItem__commentTitle').text().trim();
      const body = $rev(el).find('.hd-reviewItem__commentText').first().text().trim();
      const score = $rev(el).find('.hd-reviewStar__text').text().trim();
      const date = $rev(el).find('.hd-reviewItem__date').text().trim();
      if (title || body) reviews.push({ title, body, score, date });
    });
  }

  return {
    hotel_name: hotel.name,
    url: url,
    description: rawDescription,
    amenities: amenities,
    prices: prices,
    reviews: reviews,
    detailed_reviews_v3: true,
    timestamp: new Date().toISOString(),
  };
}

async function main() {
  console.log('🛡️ Starting SAFE Scrape Retry...');
  let jsonContent = {};
  if (fs.existsSync(JSON_PATH)) {
    jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  }

  const allHotels = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    select: { id: true, name: true, place_id: true },
  });

  const missingHotels = allHotels.filter((h) => !jsonContent[h.id]);
  console.log(`🎯 Need to retry ${missingHotels.length} hotels.`);

  let count = 0;
  let successCount = 0;
  let error404Count = 0;

  for (const hotel of missingHotels) {
    count++;
    console.log(
      `[${count}/${missingHotels.length}] Checking: ${hotel.name} (ID Form: ${hotel.place_id.startsWith('ChIJ') ? 'Google' : 'Other'})`,
    );

    const result = await scrapeHotelDetail(hotel);

    if (result && !result.error) {
      jsonContent[hotel.id] = result;
      successCount++;
      console.log(`  ✅ Recovered!`);
    } else if (result?.error === '404') {
      error404Count++;
      console.log(`  ❌ Not Found (404) at the expected URL.`);
    } else {
      console.log(`  ⚠️ Still failing (Timeout/Error).`);
    }

    // SAFE delay: 1500ms
    await new Promise((r) => setTimeout(r, 1500));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
  console.log(`\n🏁 Retry Finished.`);
  console.log(`  - Total processed: ${missingHotels.length}`);
  console.log(`  - Successfully recovered: ${successCount}`);
  console.log(`  - Verified as 404 (Doesn't exist on site): ${error404Count}`);
  console.log(`  - Still unknown failures: ${missingHotels.length - successCount - error404Count}`);
}

main().finally(() => prisma.$disconnect());
