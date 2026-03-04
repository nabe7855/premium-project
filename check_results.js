import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe('SELECT count(*) as count FROM lh_hotel_amenities');
  const result2 = await prisma.$queryRawUnsafe('SELECT count(*) as count FROM lh_hotel_services');

  console.log(`\n📊 進捗報告:`);
  console.log(`- アメニティ紐付け数: ${result[0].count} 件`);
  console.log(`- サービス紐付け数: ${result2[0].count} 件`);

  // Fetch samples for amenities
  const amenSamples = await prisma.$queryRawUnsafe(`
    SELECT h.name, array_agg(a.name) as labels
    FROM lh_hotels h
    JOIN lh_hotel_amenities ha ON h.id = ha.hotel_id
    JOIN lh_amenities a ON ha.amenity_id = a.id
    GROUP BY h.name
    LIMIT 3
  `);

  console.log('\n💎 アメニティのサンプリング結果:');
  amenSamples.forEach((s) => {
    console.log(`  🏠 ${s.name}: ${s.labels.join(', ')}`);
  });

  // Fetch samples for services
  const servSamples = await prisma.$queryRawUnsafe(`
    SELECT h.name, array_agg(s.name) as labels
    FROM lh_hotels h
    JOIN lh_hotel_services hs ON h.id = hs.hotel_id
    JOIN lh_services s ON hs.service_id = s.id
    GROUP BY h.name
    LIMIT 3
  `);

  console.log('\n⚙️ サービスのサンプリング結果:');
  servSamples.forEach((s) => {
    console.log(`  🏠 ${s.name}: ${s.labels.join(', ')}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
