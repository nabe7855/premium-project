import { prisma } from '../src/lib/prisma.ts';

async function main() {
  console.log('=== RAW PRISMA QUERY FOR FUKUOKA & YOKOHAMA PRICING DATA ===\n');

  const configs = await prisma.priceConfig.findMany({
    include: {
      store: true,
      courses: {
        include: {
          plans: {
            orderBy: { minutes: 'asc' }
          }
        },
        orderBy: { display_order: 'asc' }
      }
    }
  });

  for (const cfg of configs) {
    console.log(`Store: ${cfg.store.name} (slug: ${cfg.store.slug})`);
    for (const c of cfg.courses) {
      console.log(`  Course: ${c.name}`);
      for (const p of c.plans) {
        console.log(`    - ${p.minutes}分: ¥${p.price.toLocaleString()}`);
      }
    }
    console.log('');
  }
}

main().catch(console.error);
