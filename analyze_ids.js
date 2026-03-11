import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const all = await prisma.lh_hotels.findMany({ select: { place_id: true } });
  const googleIds = all.filter((h) => h.place_id?.startsWith('ChIJ')).length;
  const numericIds = all.filter((h) => h.place_id && /^\d+$/.test(h.place_id)).length;
  const others = all.filter(
    (h) => h.place_id && !h.place_id.startsWith('ChIJ') && !/^\d+$/.test(h.place_id),
  ).length;

  console.log('Total:', all.length);
  console.log('Google IDs (ChIJ...):', googleIds);
  console.log('Numeric IDs:', numericIds);
  console.log('Others:', others);

  const sampleMissing = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    select: { id: true, name: true, place_id: true },
    take: 10,
  });
  console.log('Samples:', JSON.stringify(sampleMissing, null, 2));
}
main().finally(() => prisma.$disconnect());
