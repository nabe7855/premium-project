import { prisma } from '../src/lib/prisma.ts';

async function checkStorePricingData() {
  console.log('=== (2) PRICING DATA DB & PAGE VERIFICATION ===\n');

  // 1. DBからprice_configsおよびコース、プランを取得
  const stores = await prisma.store.findMany({
    where: { slug: { in: ['fukuoka', 'yokohama'] } },
    select: {
      id: true,
      name: true,
      slug: true,
      price_config: {
        select: {
          id: true,
          courses: {
            select: {
              id: true,
              name: true,
              plans: {
                select: {
                  minutes: true,
                  price: true,
                  display_order: true,
                },
                orderBy: { display_order: 'asc' }
              }
            }
          }
        }
      }
    }
  });

  console.log('DB Stores Pricing Query Result:');
  console.log(JSON.stringify(stores, null, 2));

  // 2. /store/fukuoka/price と /store/yokohama/price の実データ
  for (const s of stores) {
    console.log(`\n--- Store: ${s.name} (${s.slug}) ---`);
    const courses = s.price_config?.courses || [];
    for (const c of courses) {
      console.log(`  Course: ${c.name}`);
      for (const p of c.plans) {
        console.log(`    - ${p.minutes}分: ¥${p.price.toLocaleString()}`);
      }
    }
  }
}

checkStorePricingData().catch(console.error);
