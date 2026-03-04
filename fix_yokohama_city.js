import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Detecting and updating city_id for Yokohama hotels...');

  const hotels = await prisma.lh_hotels.findMany({
    where: {
      prefecture_id: 'Kanagawa',
      city_id: null,
    },
  });

  let count = 0;
  for (const hotel of hotels) {
    // Simple heuristic: if address or name contains Yokohama-related keywords
    const keywords = [
      '横浜',
      '港北',
      '鶴見',
      '都筑',
      '港南',
      '保土ヶ谷',
      '中区',
      '西区',
      '金沢',
      '栄',
      '磯子',
      '旭',
      '緑',
      '瀬谷',
      '泉',
      '青葉',
    ];
    const isYokohama = keywords.some(
      (k) => hotel.name.includes(k) || (hotel.address && hotel.address.includes(k)),
    );

    if (isYokohama) {
      await prisma.lh_hotels.update({
        where: { id: hotel.id },
        data: { city_id: 'Yokohama-shi' },
      });
      console.log(`✅ Updated: ${hotel.name}`);
      count++;
    }
  }

  console.log(`\n🎉 Total updated: ${count}`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
