const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

const JIS_PREFECTURES = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

async function fetchPageWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.text();
      }
      console.log(`Error fetching ${url}: ${res.status}`);
    } catch (e) {
      console.error(`Fetch exception for ${url} on attempt ${i + 1}`);
    }
    // simple backoff
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  return null;
}

async function scrapePrefecture(jisId, dbPref, dbCities) {
  let page = 1;
  let hasNext = true;
  let newCount = 0;
  let bypassCount = 0;

  console.log(`--- Starting ${dbPref.name} ---`);

  while (hasNext) {
    const url = `https://couples.jp/hotels/search-by/prefectures/${jisId}?page=${page}`;
    const html = await fetchPageWithRetry(url);
    if (!html) break;

    const $ = cheerio.load(html);
    const hotelItems = $('.p-cassette__item');

    if (hotelItems.length === 0) {
      break;
    }

    for (let i = 0; i < hotelItems.length; i++) {
      const item = $(hotelItems[i]);
      const name = item.find('.p-cassette__name').text().trim();
      const addressMatch = item.find('p.p-cassette__address').text().trim();
      const phoneMatch = item.find('p.p-cassette__tell').text().trim();

      if (!name || !addressMatch) continue;

      let cityId = null;
      let addressWithoutPrefecture = addressMatch;
      const replacePref = /(都|道|府|県)$/;
      if (addressWithoutPrefecture.startsWith(dbPref.name)) {
        addressWithoutPrefecture = addressWithoutPrefecture.substring(dbPref.name.length);
      } else if (addressWithoutPrefecture.startsWith(dbPref.name.replace(replacePref, ''))) {
        addressWithoutPrefecture = addressWithoutPrefecture.substring(
          dbPref.name.replace(replacePref, '').length,
        );
      }

      for (const c of dbCities) {
        if (addressWithoutPrefecture.startsWith(c.name)) {
          cityId = c.id;
          break;
        }
      }

      const phone = phoneMatch ? phoneMatch : null;

      let existing = null;
      if (phone) {
        existing = await prisma.lh_hotels.findFirst({
          where: { OR: [{ name }, { phone }] },
        });
      } else {
        existing = await prisma.lh_hotels.findFirst({
          where: { name },
        });
      }

      if (!existing) {
        await prisma.lh_hotels.create({
          data: {
            id: uuidv4(),
            name: name,
            address: addressMatch,
            phone: phone,
            prefecture_id: dbPref.id,
            city_id: cityId,
            created_at: new Date(),
          },
        });
        newCount++;
      } else {
        bypassCount++;

        // update existing with city_id if missing and we found one
        if (!existing.city_id && cityId) {
          await prisma.lh_hotels.update({
            where: { id: existing.id },
            data: { city_id: cityId, address: addressMatch },
          });
        }
      }
    }

    const nextLink = $('link[rel="next"]').attr('href');
    if (!nextLink) {
      hasNext = false;
    } else {
      page++;
      // Small wait between requests
      console.log(`Page ${page} for ${dbPref.name}`);
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  console.log(`Finish ${dbPref.name} - Created: ${newCount}, Skipped: ${bypassCount}`);
}

async function main() {
  const allPrefs = await prisma.lh_prefectures.findMany();

  for (let i = 0; i < JIS_PREFECTURES.length; i++) {
    const jisId = i + 1;
    const prefName = JIS_PREFECTURES[i];

    let dbPref = allPrefs.find(
      (p) => p.name === prefName || p.name === prefName.replace(/(都|道|府|県)$/, ''),
    );

    if (!dbPref) {
      console.log(`Warn: Could not find equivalent of ${prefName} in DB.`);
      continue;
    }

    const dbCities = await prisma.lh_cities.findMany({
      where: { prefecture_id: dbPref.id },
    });
    dbCities.sort((a, b) => (b.name ? b.name.length : 0) - (a.name ? a.name.length : 0));

    await scrapePrefecture(jisId, dbPref, dbCities);

    // give server a breather between prefectures
    await new Promise((res) => setTimeout(res, 1000));
  }

  console.log('Job completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
