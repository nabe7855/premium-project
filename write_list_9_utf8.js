import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
async function main() {
  const jsonPath =
    'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\data\\raw_hotel_data\\hotels_raw_data.json';
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const missing = await prisma.lh_hotels.findMany({
    where: { place_id: { startsWith: 'ChIJ' } },
    select: { id: true, name: true, address: true, place_id: true },
  });
  const filtered = missing.filter((h) => !jsonContent[h.id]);
  const list = filtered
    .slice(0, 15)
    .map((h) => `${h.id}|${h.name}|${h.address}|${h.place_id}`)
    .join('\n');
  fs.writeFileSync(
    'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\batch_9_list_utf8.txt',
    list,
    'utf8',
  );
}
main().finally(() => prisma.$disconnect());
