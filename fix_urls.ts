import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting URL fix...');
  const configs = await prisma.storeTopConfig.findMany();

  for (const row of configs) {
    let configStr = JSON.stringify(row.config);
    let changed = false;

    const replacements = [
      { from: '/diary/diary-list', to: '/diary' },
      { from: '/reviews/reviews', to: '/reviews' },
      { from: '/schedule/schedule', to: '/schedule' },
      { from: '/videos/videos', to: '/videos' }
    ];

    for (const rep of replacements) {
      if (configStr.includes(rep.from)) {
        configStr = configStr.split(rep.from).join(rep.to);
        changed = true;
      }
    }

    if (changed) {
      console.log(`Updating store_id: ${row.store_id}`);
      await prisma.storeTopConfig.update({
        where: { id: row.id },
        data: { config: JSON.parse(configStr) }
      });
    }
  }

  // Also fix StoreLinksConfig if they have it
  const links = await prisma.storeLinksConfig.findMany();
  for (const row of links) {
    let configStr = JSON.stringify(row.config);
    let changed = false;

    const replacements = [
      { from: '/diary/diary-list', to: '/diary' },
      { from: '/reviews/reviews', to: '/reviews' },
      { from: '/schedule/schedule', to: '/schedule' },
      { from: '/videos/videos', to: '/videos' }
    ];

    for (const rep of replacements) {
      if (configStr.includes(rep.from)) {
        configStr = configStr.split(rep.from).join(rep.to);
        changed = true;
      }
    }

    if (changed) {
      console.log(`Updating links for store_id: ${row.store_id}`);
      await prisma.storeLinksConfig.update({
        where: { id: row.id },
        data: { config: JSON.parse(configStr) }
      });
    }
  }

  console.log('Finished URL fix.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
