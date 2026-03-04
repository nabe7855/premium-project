import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const names = ['HOTEL ME', 'ホテル 舞', 'HOTEL SOL', 'ホテル 雅', 'HOTEL SKY'];
  for (const name of names) {
    const results = await prisma.lh_hotels.findMany({
      where: { name: { contains: name } },
      select: { name: true },
    });
    console.log(
      `Results for "${name}":`,
      results.map((r) => r.name),
    );
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
