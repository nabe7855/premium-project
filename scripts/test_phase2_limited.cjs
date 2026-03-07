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
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
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

  const website = $('#officialsite').attr('href') || null;
  const distText = $('.hd-header__train').first().text().trim().replace(/\s+/g, ' ');

  const prText = $('.hd-pr').text().trim();
  let roomCount = null;
  const roomMatch = prText.match(/全(\d+)室/);
  if (roomMatch) roomCount = parseInt(roomMatch[1]);

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

  const facilityItems = [];
  $('.hd-facility__list li').each((_, li) => {
    facilityItems.push(
      $(li)
        .text()
        .trim()
        .replace(/※一部$/, ''),
    );
  });

  for (const itemName of facilityItems) {
    let amenity = await prisma.lh_amenities.findFirst({ where: { name: itemName } });
    if (!amenity) {
      amenity = await prisma.lh_amenities.create({ data: { name: itemName } });
    }
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
    take: 5,
  });

  for (const hotel of hotels) {
    await scrapeHotelDetail(hotel);
    await new Promise((r) => setTimeout(r, 1000));
  }
}

main().finally(() => prisma.$disconnect());
