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
  const distText = $('.hd-header__train').text().trim().replace(/\s+/g, ' ');

  // PR text / Raw description for AI seed
  const prText = $('.hd-pr').text().trim();
  const msgText = $('#premium_msg').text().trim() || $('.hd-message__text').text().trim();
  const rawDescription = (prText + '\n' + msgText).trim();

  let roomCount = null;
  const roomMatch = prText.match(/全(\d+)室/);
  if (roomMatch) roomCount = parseInt(roomMatch[1]);

  // 2. Prices
  const priceDetails = [];
  let minPriceRest = null;
  let minPriceStay = null;

  $('.hd-tablePrice tr').each((_, tr) => {
    const category = $(tr).find('.hd-tablePrice__category').text().trim();
    const categoryPlans = [];
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

        categoryPlans.push({ title, price: priceRange, stay: timezone, time: '', note: '' });
      });
    priceDetails.push({ category, plans: categoryPlans });
  });

  // 3. Reviews & Ratings
  let ratingExterior = null;
  let ratingPrice = null;
  let ratingCleanliness = null;
  let ratingBath = null;
  let ratingService = null;
  let reviewCount = null;
  const reviewSnippets = [];

  const reviewUrl = `${url}/review`;
  const reviewHtml = await fetchPage(reviewUrl);
  if (reviewHtml) {
    const $rev = cheerio.load(reviewHtml);

    // Score breakdown
    const scoreText = $rev('.hd-reviewStarDetail__text').text();
    const parseScore = (label) => {
      const match = scoreText.match(new RegExp(`${label}：([\\d.]+)`));
      return match ? parseFloat(match[1]) : null;
    };

    ratingExterior = parseScore('外観');
    ratingPrice = parseScore('料金');
    ratingCleanliness = parseScore('清潔感');
    ratingBath = parseScore('お風呂');
    ratingService = parseScore('接客');

    // Review Count
    const countText = $rev('.p-resultNumber .p-resultNumber__all').text();
    if (countText) reviewCount = parseInt(countText.replace(/,/g, ''));

    // Snippets (First 10)
    $rev('.hd-reviewItem').each((i, el) => {
      if (i >= 10) return;
      const title = $rev(el).find('.hd-reviewItem__commentTitle').text().trim();
      const body = $rev(el).find('.hd-reviewItem__commentText').first().text().trim();
      if (title || body) {
        reviewSnippets.push({ title, body });
      }
    });
  }

  // 4. Update lh_hotels
  await prisma.lh_hotels.update({
    where: { id: hotel.id },
    data: {
      website,
      distance_from_station: distText || hotel.distance_from_station,
      room_count: roomCount || hotel.room_count,
      min_price_rest: minPriceRest || hotel.min_price_rest,
      min_price_stay: minPriceStay || hotel.min_price_stay,
      rest_price_min_weekday: minPriceRest || hotel.rest_price_min_weekday,
      stay_price_min_weekday: minPriceStay || hotel.stay_price_min_weekday,
      price_details: priceDetails,
      review_count: reviewCount || hotel.review_count,
      raw_description: rawDescription || hotel.raw_description,
      review_snippets: reviewSnippets.length > 0 ? reviewSnippets : hotel.review_snippets,
      rating_exterior: ratingExterior,
      rating_price: ratingPrice,
      rating_cleanliness: ratingCleanliness,
      rating_bath: ratingBath,
      rating_service: ratingService,
    },
  });

  // 4. Amenities & Services (Standard list)
  const facilityItems = [];
  $('.hd-facility__list li').each((_, li) => {
    facilityItems.push(
      $(li)
        .text()
        .trim()
        .replace(/※一部$/, ''),
    );
  });

  // 5. Heuristic Amenity Detection (NEW: Search within rawDescription for missing tags)
  const heuristicMap = [
    { name: 'Wi-Fi', keywords: ['Wi-Fi', 'ワイファイ', '無線LAN'] },
    { name: '大型TV', keywords: ['大型テレビ', '大型TV', '50インチ', '60インチ', '70インチ'] },
    { name: '浴室TV', keywords: ['浴室テレビ', '浴室TV', 'バスルームテレビ'] },
    { name: '露天風呂', keywords: ['露天風呂', '露天'] },
    { name: 'VOD', keywords: ['VOD', 'ビデオオンデマンド', '見放題'] },
    { name: '人工温泉', keywords: ['人工温泉', '温泉'] },
    { name: 'ジェットバス', keywords: ['ジェットバス', 'ブロアバス'] },
    { name: '電子レンジ', keywords: ['電子レンジ', 'レンジ'] },
    { name: '持込用冷蔵庫', keywords: ['持込用冷蔵庫', '持ち込み冷蔵庫'] },
  ];

  for (const h of heuristicMap) {
    if (h.keywords.some((k) => rawDescription.includes(k))) {
      if (!facilityItems.includes(h.name)) {
        facilityItems.push(h.name);
      }
    }
  }

  for (const itemName of facilityItems) {
    let amenity = await prisma.lh_amenities.findFirst({ where: { name: itemName } });
    if (!amenity) {
      amenity = await prisma.lh_amenities.create({ data: { name: itemName } });
    }

    // Upsert link
    await prisma.lh_hotel_amenities.upsert({
      where: {
        hotel_id_amenity_id: {
          hotel_id: hotel.id,
          amenity_id: amenity.id,
        },
      },
      update: {},
      create: {
        hotel_id: hotel.id,
        amenity_id: amenity.id,
      },
    });
  }
}

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: {
      place_id: { not: null },
      website: null, // Only those not processed yet
    },
    take: 100, // Process in chunks
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
