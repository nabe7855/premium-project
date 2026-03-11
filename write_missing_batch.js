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
  const list = googleMissing
    .slice(0, 10)
    .map((h) => `${h.id}|${h.name}`)
    .join('\n');
  fs.writeFileSync('missing_batch.txt', list);
}
main().finally(() => prisma.$disconnect());
