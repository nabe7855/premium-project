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

  const inDbNotInJson = allDb.filter((h) => !jsonContent[h.id] && h.place_id !== null);
  console.log('--- MISSING HOTELS ---');
  inDbNotInJson.slice(0, 20).forEach((h) => {
    console.log(
      `ID: ${h.id}, Name: ${h.name}, URL: https://couples.jp/hotel-details/${h.place_id}`,
    );
  });
  console.log('Total Missing:', inDbNotInJson.length);
}
main().finally(() => prisma.$disconnect());
