const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HEURISTIC_MAP = [
  { name: 'Wi-Fi', keywords: ['Wi-Fi', 'ワイファイ', '無線LAN', 'WiFi'] },
  { name: '大型TV', keywords: ['大型テレビ', '大型TV', '50インチ', '60インチ', '70インチ'] },
  { name: '浴室TV', keywords: ['浴室テレビ', '浴室TV', 'バスルームテレビ'] },
  { name: '露天風呂', keywords: ['露天風呂', '露天'] },
  { name: 'VOD', keywords: ['VOD', 'ビデオオンデマンド', '見放題'] },
  { name: '人工温泉', keywords: ['人工温泉', '温泉', '大浴場'] },
  { name: 'ジェットバス', keywords: ['ジェットバス', 'ブロアバス', 'バブルバス'] },
  { name: '電子レンジ', keywords: ['電子レンジ', 'レンジ'] },
  { name: '持込用冷蔵庫', keywords: ['持込用冷蔵庫', '持ち込み冷蔵庫', '空の冷蔵庫'] },
  { name: '1名利用可', keywords: ['1名', '一人', 'シングル'] },
  { name: '3名以上利用可', keywords: ['3名', '三人', 'パーティー', '女子会'] },
];

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: {
      OR: [{ description: { not: null } }, { raw_description: { not: null } }],
    },
    select: {
      id: true,
      name: true,
      description: true,
      raw_description: true,
    },
  });

  console.log(`Analyzing ${hotels.length} hotels for missing amenities...`);

  const amenitiesMaster = await prisma.lh_amenities.findMany();
  let updateCount = 0;

  for (const hotel of hotels) {
    const combinedText = `${hotel.description || ''} ${hotel.raw_description || ''}`;
    const foundAmenities = [];

    for (const h of HEURISTIC_MAP) {
      if (h.keywords.some((k) => combinedText.includes(k))) {
        let amenity = amenitiesMaster.find((a) => a.name === h.name);
        if (!amenity) {
          amenity = await prisma.lh_amenities.create({ data: { name: h.name } });
          amenitiesMaster.push(amenity);
        }
        foundAmenities.push(amenity.id);
      }
    }

    if (foundAmenities.length > 0) {
      for (const amenityId of foundAmenities) {
        await prisma.lh_hotel_amenities.upsert({
          where: {
            hotel_id_amenity_id: {
              hotel_id: hotel.id,
              amenity_id: amenityId,
            },
          },
          update: {},
          create: {
            hotel_id: hotel.id,
            amenity_id: amenityId,
          },
        });
      }
      updateCount++;
    }
  }

  console.log(`Heuristic fill completed. Updated/Verified ${updateCount} hotels.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
