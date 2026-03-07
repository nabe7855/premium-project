const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

// 1-47 is standard JIS order, mapping carefully to typical prefecture names
// that we can find in the database.
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

// Couples.jp uses custom prefecture IDs sometimes, but standard is 1-47.
// However, the page URLs on Couples.jp:
// [北海道](.../prefectures/1...)
// [青森](.../prefectures/2...) -> yes, it is exactly 1-indexed JIS.

async function fetchPage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Error fetching ${url}: ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.error(`Fetch exception for ${url}`, e);
    return null;
  }
}

async function scrapePrefecture(jisId, dbPref, dbCities) {
  let page = 1;
  let hasNext = true;
  let newCount = 0;
  let bypassCount = 0;

  console.log(`--- Starting ${dbPref.name} ---`);

  while (hasNext) {
    const url = `https://couples.jp/hotels/search-by/prefectures/${jisId}?page=${page}`;
    const html = await fetchPage(url);
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
      const phone = item.find('p.p-cassette__tell').text().trim() || null;

      if (!name || !addressMatch) continue;

      // Try to identify city ID by looking for the city name in the address
      let cityId = null;
      // The address normally looks like "東京都新宿区歌舞伎町..."
      let addressWithoutPrefecture = addressMatch;
      // Remove pref name
      if (addressWithoutPrefecture.startsWith(dbPref.name)) {
        addressWithoutPrefecture = addressWithoutPrefecture.substring(dbPref.name.length);
      } else if (addressWithoutPrefecture.startsWith(dbPref.name.replace(/(都|道|府|県)$/, ''))) {
        addressWithoutPrefecture = addressWithoutPrefecture.substring(
          dbPref.name.replace(/(都|道|府|県)$/, '').length,
        );
      }

      for (const c of dbCities) {
        if (addressWithoutPrefecture.startsWith(c.name)) {
          cityId = c.id;
          break;
        }
      }

      // Check for duplicates in DB
      const existing = await prisma.lh_hotels.findFirst({
        where: {
          OR: [{ name: name }, phone ? { phone: phone } : null].filter(Boolean),
        },
      });

      if (!existing) {
        // INSERT
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
      }
    }

    // Check if there is a next page
    const nextLink = $('link[rel="next"]').attr('href');
    if (!nextLink) {
      hasNext = false;
    } else {
      page++;
      // Small wait between requests
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  console.log(`Finish ${dbPref.name} - Created: ${newCount}, Skipped: ${bypassCount}`);
}

async function main() {
  const allPrefs = await prisma.lh_prefectures.findMany();
  let totalCreated = 0;

  for (let i = 0; i < JIS_PREFECTURES.length; i++) {
    const jisId = i + 1;
    const prefName = JIS_PREFECTURES[i];

    // Find matching pref in DB. Some db names might not have "県", e.g. "福岡" vs "福岡県"
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
    // Sort cities by length descending to match longer specific names first (e.g. "市川市" vs "市川")
    dbCities.sort((a, b) => (b.name ? b.name.length : 0) - (a.name ? a.name.length : 0));

    await scrapePrefecture(jisId, dbPref, dbCities);
  }

  console.log('Job completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
