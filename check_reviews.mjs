import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'fukuoka' },
    select: { id: true },
  });

  if (!store) {
    console.log('Store not found: fukuoka');
    return;
  }

  const membership = await prisma.castStoreMembership.findMany({
    where: { store_id: store.id },
    select: { cast_id: true },
  });

  const castIds = membership.map((m) => m.cast_id);
  console.log('Casts in Fukuoka:', castIds.length);

  const reviews = await prisma.review.findMany({
    where: { cast_id: { in: castIds } },
    select: { cast_id: true, rating: true },
  });

  console.log('Total reviews for Fukuoka casts:', reviews.length);

  if (reviews.length > 0) {
    const stats = {};
    reviews.forEach((r) => {
      if (!stats[r.cast_id]) stats[r.cast_id] = { sum: 0, count: 0 };
      stats[r.cast_id].sum += r.rating;
      stats[r.cast_id].count += 1;
    });
    console.log(
      'Average ratings sample:',
      Object.entries(stats)
        .slice(0, 3)
        .map(([id, s]) => `${id}: ${(s.sum / s.count).toFixed(1)} (${s.count})`),
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
