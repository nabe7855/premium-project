const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const cheerio = require('cheerio');

// Note: Use manual fetch since we are in Node 18+ or using a compatible environment
const prisma = new PrismaClient();
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });
      if (res.ok) return await res.text();
      if (res.status === 404) return null;
      console.log(`Fetch failed: ${url} - Status: ${res.status}`);
    } catch (e) {
      console.log(`Fetch error: ${url} - ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 1500 * (i + 1))); // Backoff
  }
  return null;
}

async function scrapeHotelDetail(hotel) {
  const url = `https://couples.jp/hotel-details/${hotel.place_id}`;
  const html = await fetchPage(url);
  if (!html) return null;

  const $ = cheerio.load(html);

  // Basic Info
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
  if (reviewHtml) {
    const $rev = cheerio.load(reviewHtml);
    $rev('.hd-reviewItem').each((i, el) => {
      if (i >= 15) return; // Get a few more than Phase 2
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
  console.log('🚀 Loading existing JSON...');
  let jsonContent = {};
  if (fs.existsSync(JSON_PATH)) {
    jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  }
  const existingKeys = new Set(Object.keys(jsonContent));
  console.log(`✅ Loaded ${existingKeys.size} records from JSON.`);

  console.log('🔍 Fetching all hotels from DB...');
  const allHotels = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    select: { id: true, name: true, place_id: true },
  });

  const missingHotels = allHotels.filter((h) => !existingKeys.has(h.id));
  console.log(`🎯 Found ${missingHotels.length} missing hotels to scrape.`);

  if (missingHotels.length === 0) {
    console.log('✨ All hotels already present in JSON. Nothing to do.');
    return;
  }

  let count = 0;
  let successCount = 0;

  try {
    for (const hotel of missingHotels) {
      count++;
      const startTime = Date.now();

      const data = await scrapeHotelDetail(hotel);
      if (data) {
        jsonContent[hotel.id] = data;
        successCount++;
        const elapsed = (Date.now() - startTime) / 1000;
        console.log(
          `[${count}/${missingHotels.length}] ✅ Scraped: ${hotel.name} (${elapsed.toFixed(1)}s)`,
        );
      } else {
        console.log(`[${count}/${missingHotels.length}] ❌ Failed: ${hotel.name}`);
      }

      // Speed: 300ms delay between requests
      await new Promise((r) => setTimeout(r, 300));

      // Periodic save
      if (count % 20 === 0) {
        fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
        console.log(`💾 Progress saved (${successCount} new items)`);
      }
    }
  } catch (error) {
    console.error('💥 Fatal error in loop:', error);
  } finally {
    console.log('🏁 Finalizing and saving...');
    fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
    console.log(
      `🎊 Done! Scraped ${successCount} hotels. Total in JSON: ${Object.keys(jsonContent).length}`,
    );
  }
}

main().finally(() => prisma.$disconnect());
