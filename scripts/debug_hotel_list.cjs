const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    select: { id: true, name: true, website: true, price_details: true },
    take: 20,
  });

  hotels.forEach((h) => {
    const hasPrice = Array.isArray(h.price_details) && h.price_details.length > 0;
    console.log(
      `ID: ${h.id} | Name: ${h.name.padEnd(30)} | Web: ${h.website ? 'YES' : 'NO '} | Price: ${hasPrice ? 'YES' : 'NO '}`,
    );
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
