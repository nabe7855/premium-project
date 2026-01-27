import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const configs = await prisma.storeTopConfig.findMany({
    include: {
      store: true,
    },
  });

  console.log('--- Store Top Configs ---');
  for (const c of configs) {
    console.log(`Store: ${c.store.name} (${c.store.slug})`);
    console.log(`Config: ${JSON.stringify(c.config, null, 2).substring(0, 500)}...`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
