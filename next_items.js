import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
async function main() {
  const jsonContent = JSON.parse(
    fs.readFileSync('data/raw_hotel_data/hotels_raw_data.json', 'utf8'),
  );
  const missing = await prisma.lh_hotels.findMany({
    where: { place_id: { startsWith: 'ChIJ' } },
    select: { id: true, name: true, address: true, place_id: true },
  });
  const filtered = missing.filter((h) => !jsonContent[h.id]);
  console.log('ID LIST FOR BATCH 3:');
  filtered.slice(0, 10).forEach((h) => {
    console.log(`${h.id}|${h.name}|${h.address}|${h.place_id}`);
  });
}
main().finally(() => prisma.$disconnect());
