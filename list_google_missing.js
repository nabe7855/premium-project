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

  const googleMissing = allDb.filter((h) => !jsonContent[h.id] && h.place_id?.startsWith('ChIJ'));
  console.log('--- GOOGLE ID MISSING HOTELS ---');
  googleMissing.slice(0, 10).forEach((h) => {
    console.log(`ID: ${h.id}, Name: ${h.name}`);
  });
  console.log('Total Google Missing:', googleMissing.length);
}
main().finally(() => prisma.$disconnect());
