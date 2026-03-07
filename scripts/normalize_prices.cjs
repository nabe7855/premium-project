const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function extractPriceIntegers(priceStr) {
  if (!priceStr) return { min: null, max: null };
  const matches = priceStr.match(/\d{1,3}(,\d{3})*|\d+/g);
  if (!matches || matches.length === 0) return { min: null, max: null };
  const numbers = matches.map((m) => parseInt(m.replace(/,/g, ''), 10)).filter((n) => !isNaN(n));
  if (numbers.length === 0) return { min: null, max: null };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

function isWeekend(title) {
  if (!title) return false;
  return /土|日|祝/.test(title);
}

function normalizeHotelPrices(hotel) {
  if (!hotel.price_details || !Array.isArray(hotel.price_details)) return null;

  let restMinWd = Infinity,
    restMaxWd = -Infinity;
  let restMinWe = Infinity,
    restMaxWe = -Infinity;
  let stayMinWd = Infinity,
    stayMaxWd = -Infinity;
  let stayMinWe = Infinity,
    stayMaxWe = -Infinity;

  for (const group of hotel.price_details) {
    if (!group.category || !group.plans) continue;

    // 休憩 (Rest) or サービスタイム (Free Time / Service Time - often counts as rest)
    if (
      group.category.includes('休憩') ||
      group.category.includes('ショート') ||
      group.category.includes('サービス')
    ) {
      for (const plan of group.plans) {
        const { min, max } = extractPriceIntegers(plan.price);
        if (min !== null) {
          if (isWeekend(plan.title)) {
            restMinWe = Math.min(restMinWe, min);
            restMaxWe = Math.max(restMaxWe, max);
          } else {
            // 平日または全日
            restMinWd = Math.min(restMinWd, min);
            restMaxWd = Math.max(restMaxWd, max);
            if (plan.title && plan.title.includes('全日')) {
              restMinWe = Math.min(restMinWe, min);
              restMaxWe = Math.max(restMaxWe, max);
            }
          }
        }
      }
    }

    // 宿泊 (Stay)
    if (group.category.includes('宿泊')) {
      for (const plan of group.plans) {
        const { min, max } = extractPriceIntegers(plan.price);
        if (min !== null) {
          if (isWeekend(plan.title)) {
            stayMinWe = Math.min(stayMinWe, min);
            stayMaxWe = Math.max(stayMaxWe, max);
          } else {
            // 平日または全日
            stayMinWd = Math.min(stayMinWd, min);
            stayMaxWd = Math.max(stayMaxWd, max);
            if (plan.title && plan.title.includes('全日')) {
              stayMinWe = Math.min(stayMinWe, min);
              stayMaxWe = Math.max(stayMaxWe, max);
            }
          }
        }
      }
    }
  }

  const updates = {};
  if (restMinWd !== Infinity) updates.rest_price_min_weekday = restMinWd;
  if (restMaxWd !== -Infinity) updates.rest_price_max_weekday = restMaxWd;
  if (restMinWe !== Infinity) updates.rest_price_min_weekend = restMinWe;
  if (restMaxWe !== -Infinity) updates.rest_price_max_weekend = restMaxWe;

  if (stayMinWd !== Infinity) updates.stay_price_min_weekday = stayMinWd;
  if (stayMaxWd !== -Infinity) updates.stay_price_max_weekday = stayMaxWd;
  if (stayMinWe !== Infinity) updates.stay_price_min_weekend = stayMinWe;
  if (stayMaxWe !== -Infinity) updates.stay_price_max_weekend = stayMaxWe;

  return Object.keys(updates).length > 0 ? updates : null;
}

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { price_details: { not: null } },
    select: { id: true, name: true, price_details: true },
  });

  console.log(`Found ${hotels.length} hotels with price details. Processing...`);

  let updateCount = 0;
  for (const hotel of hotels) {
    const prices = normalizeHotelPrices(hotel);
    if (prices) {
      await prisma.lh_hotels.update({
        where: { id: hotel.id },
        data: prices,
      });
      updateCount++;
    }
  }

  console.log(`Successfully normalized prices for ${updateCount} hotels.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
