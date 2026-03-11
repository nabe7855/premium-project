import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
async function main() {
  const allDb = await prisma.lh_hotels.findMany({
    select: { id: true, name: true, place_id: true },
  });
  const jsonContent = JSON.parse(
    fs.readFileSync('data/raw_hotel_data/hotels_raw_data.json', 'utf8'),
  );

  const missing = allDb.filter((h) => !jsonContent[h.id] && h.place_id !== null);
  const googleIds = missing.filter((h) => h.place_id.startsWith('ChIJ')).length;
  const numericIds = missing.filter((h) => /^\d+$/.test(h.place_id)).length;

  console.log('--- MISSING ANALYSIS ---');
  console.log('Total Missing:', missing.length);
  console.log('Google IDs (ChIJ...):', googleIds);
  console.log('Numeric IDs:', numericIds);

  if (numericIds > 0) {
    console.log('Numeric Missing Sample:');
    missing
      .filter((h) => /^\d+$/.test(h.place_id))
      .slice(0, 5)
      .forEach((h) => {
        console.log(`${h.name}: ${h.place_id}`);
      });
  }
}
main().finally(() => prisma.$disconnect());
