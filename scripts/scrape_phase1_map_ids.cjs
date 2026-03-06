/**
 * Phase 1: 47都道府県一覧ページを再スクレイピングし、
 * Couples.jpのhotel_id（detail URLのID）をDBのplace_idに保存する
 */
const { PrismaClient } = require('@prisma/client');
const cheerio = require('cheerio');
const prisma = new PrismaClient();

const JIS_PREF_IDS = Array.from({ length: 47 }, (_, i) => i + 1);

async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
      if (res.ok) return await res.text();
    } catch {}
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  return null;
}

async function main() {
  let mapped = 0;
  let notFound = 0;

  for (const jisId of JIS_PREF_IDS) {
    let page = 1;
    let hasNext = true;
    console.log(`  Scanning prefecture ${jisId}...`);

    while (hasNext) {
      const html = await fetchPage(
        `https://couples.jp/hotels/search-by/prefectures/${jisId}?page=${page}`,
      );
      if (!html) break;
      const $ = cheerio.load(html);
      const items = $('.p-cassette__item');
      if (items.length === 0) break;

      for (let i = 0; i < items.length; i++) {
        const item = $(items[i]);
        const detailHref = item.find('a.p-cassette__headBox').attr('href') || '';
        const coupleId = detailHref.match(/\/hotel-details\/(\d+)/)?.[1];
        if (!coupleId) continue;

        const phone = item.find('p.p-cassette__tell').text().trim();
        const name = item.find('.p-cassette__name').text().trim();
        if (!phone && !name) continue;

        // DBでphone or nameで検索し place_id を更新
        let dbHotel = null;
        if (phone) {
          dbHotel = await prisma.lh_hotels.findFirst({
            where: { phone },
            select: { id: true, place_id: true },
          });
        }
        if (!dbHotel && name) {
          dbHotel = await prisma.lh_hotels.findFirst({
            where: { name },
            select: { id: true, place_id: true },
          });
        }

        if (dbHotel && dbHotel.place_id !== coupleId) {
          await prisma.lh_hotels.update({
            where: { id: dbHotel.id },
            data: { place_id: coupleId },
          });
          mapped++;
        } else if (!dbHotel) {
          notFound++;
        }
      }

      const nextLink = $('link[rel="next"]').attr('href');
      hasNext = !!nextLink;
      page++;
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const withPlaceId = await prisma.lh_hotels.count({ where: { place_id: { not: null } } });
  console.log(`\nPhase 1 Done.`);
  console.log(`  Mapped this run: ${mapped}`);
  console.log(`  Not in DB: ${notFound}`);
  console.log(`  DB hotels with place_id: ${withPlaceId}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
