import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
async function main() {
  const allDb = await prisma.lh_hotels.findMany({ select: { id: true, place_id: true } });
  const jsonContent = JSON.parse(
    fs.readFileSync('data/raw_hotel_data/hotels_raw_data.json', 'utf8'),
  );
  const jsonKeys = Object.keys(jsonContent);

  console.log('--- DETAILED COMPARISON ---');
  console.log('Total in DB:', allDb.length);
  console.log('Total in JSON:', jsonKeys.length);

  const inDbNotInJson = allDb.filter((h) => !jsonContent[h.id]);
  console.log('In DB but NOT in JSON:', inDbNotInJson.length);

  const inJsonNotInDb = jsonKeys.filter((k) => !allDb.find((h) => h.id === k));
  console.log('In JSON but NOT in DB:', inJsonNotInDb.length);

  const hasPlaceId = allDb.filter((h) => h.place_id !== null).length;
  console.log('DB Hotels with place_id:', hasPlaceId);
}
main().finally(() => prisma.$disconnect());
