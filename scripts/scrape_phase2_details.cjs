const { PrismaClient } = require('@prisma/client');
const cheerio = require('cheerio');
const prisma = new PrismaClient();

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
      console.log(`Fetch failed: ${url} - Status: ${res.status}`);
    } catch (e) {
      console.log(`Fetch error: ${url} - ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
  return null;
}

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

async function scrapeHotelDetail(hotel) {
  const url = `https://couples.jp/hotel-details/${hotel.place_id}`;
  console.log(`Scraping: ${hotel.name} (${url})`);

  const html = await fetchPage(url);
  if (!html) return;

  const $ = cheerio.load(html);

  // 1. Basic Info
  const website = $('#officialsite').attr('href') || null;

  // Station distance (taking the first one)
  const distText = $('.hd-header__train').text().trim().replace(/\s+/g, ' ');

  // Room count from PR section or message
  const prText = $('.hd-pr').text().trim();
  let roomCount = null;
  const roomMatch = prText.match(/全(\d+)室/);
  if (roomMatch) roomCount = parseInt(roomMatch[1]);

  // 2. Prices
  const priceDetails = [];
  let minPriceRest = null;
  let minPriceStay = null;

  $('.hd-tablePrice tr').each((_, tr) => {
    const category = $(tr).find('.hd-tablePrice__category').text().trim();
    $(tr)
      .find('.hd-pricePlan li')
      .each((_, li) => {
        const title = $(li).find('.hd-pricePlan__title').text().trim();
        const priceRange = $(li).find('.hd-priceRange__price').text().trim();
        const timezone = $(li).find('.hd-timezone').text().trim().replace(/\s+/g, ' ');

        const p = parsePrice(priceRange);
        if (category.includes('休憩')) {
          if (minPriceRest === null || (p !== null && p < minPriceRest)) minPriceRest = p;
        } else if (category.includes('宿泊')) {
          if (minPriceStay === null || (p !== null && p < minPriceStay)) minPriceStay = p;
        }

        priceDetails.push({ category, title, priceRange, timezone });
      });
  });

  // 3. Update lh_hotels
  await prisma.lh_hotels.update({
    where: { id: hotel.id },
    data: {
      website,
      distance_from_station: distText || hotel.distance_from_station,
      room_count: roomCount || hotel.room_count,
      min_price_rest: minPriceRest || hotel.min_price_rest,
      min_price_stay: minPriceStay || hotel.min_price_stay,
      price_details: priceDetails,
    },
  });

  // 4. Amenities & Services
  const facilityItems = [];
  $('.hd-facility__list li').each((_, li) => {
    facilityItems.push(
      $(li)
        .text()
        .trim()
        .replace(/※一部$/, ''),
    );
  });

  // Simple classification: if it's in the first section it might be amenity, else service
  // But usually we just want to match existing masters
  for (const itemName of facilityItems) {
    // Try to find in lh_amenities
    let amenity = await prisma.lh_amenities.findFirst({ where: { name: itemName } });
    if (!amenity) {
      amenity = await prisma.lh_amenities.create({ data: { name: itemName } });
    }

    // Link if not exists
    const exists = await prisma.lh_hotel_amenities.findFirst({
      where: { hotel_id: hotel.id, amenity_id: amenity.id },
    });
    if (!exists) {
      await prisma.lh_hotel_amenities.create({
        data: { hotel_id: hotel.id, amenity_id: amenity.id },
      });
    }
  }
}

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    // Optionally filter for those not yet processed
    // where: { website: null }
  });

  console.log(`Starting Phase 2 for ${hotels.length} hotels...`);

  for (let i = 0; i < hotels.length; i++) {
    await scrapeHotelDetail(hotels[i]);
    // Safety delay
    await new Promise((r) => setTimeout(r, 1000));

    if ((i + 1) % 10 === 0) {
      console.log(`Processed ${i + 1} / ${hotels.length}`);
    }
  }

  console.log('Phase 2 Completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
