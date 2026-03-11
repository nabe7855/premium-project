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
  const output = filtered
    .slice(0, 15)
    .map((h) => `${h.id} | ${h.name} | ${h.address} | ${h.place_id}`)
    .join('\n');
  fs.writeFileSync('missing_batch_3.txt', output);
  console.log('Batch 3 list created.');
}
main().finally(() => prisma.$disconnect());
