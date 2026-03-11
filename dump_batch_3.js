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
  const filtered = missing.filter((h) => !jsonContent[h.id]).slice(0, 10);
  process.stdout.write(JSON.stringify(filtered, null, 2));
}
main().finally(() => prisma.$disconnect());
