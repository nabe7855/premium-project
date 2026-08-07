import { prisma } from '../src/lib/prisma.ts';

async function investigate() {
  console.log('=== STORES IN DB ===');
  const stores = await prisma.store.findMany();
  console.log(stores.map(s => ({ id: s.id, name: s.name, slug: s.slug, use_external_url: s.use_external_url, external_url: s.external_url })));

  console.log('\n=== CASTS IN DB ===');
  const casts = await prisma.cast.findMany({
    include: {
      memberships: {
        include: {
          store: true
        }
      }
    }
  });

  console.log(`Total Casts in DB: ${casts.length}`);

  const yokohamaCasts = [];
  const tokyoCasts = [];

  for (const c of casts) {
    const storeSlugs = c.memberships.map(m => m.store.slug);
    const storeNames = c.memberships.map(m => m.store.name);

    if (storeSlugs.includes('yokohama') || storeNames.some(n => n.includes('横浜'))) {
      yokohamaCasts.push(c);
    }
    if (storeSlugs.includes('tokyo') || storeNames.some(n => n.includes('東京'))) {
      tokyoCasts.push(c);
    }
  }

  console.log(`Yokohama DB Casts (${yokohamaCasts.length}):`, yokohamaCasts.map(c => c.name));
  console.log(`Tokyo DB Casts (${tokyoCasts.length}):`, tokyoCasts.map(c => c.name));
}

investigate().catch(console.error);
