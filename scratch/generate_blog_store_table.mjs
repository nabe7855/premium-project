import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function generateTable() {
  const blogs = await prisma.$queryRaw`
    SELECT b.id, b.title, b.created_at, b.published_at, b.status,
           c.name AS cast_name, c.slug AS cast_slug,
           STRING_AGG(DISTINCT s.slug, ', ') AS store_slugs
    FROM blogs b
    LEFT JOIN casts c ON b.cast_id = c.id
    LEFT JOIN cast_store_memberships csm ON c.id = csm.cast_id
    LEFT JOIN stores s ON csm.store_id = s.id
    GROUP BY b.id, b.title, b.created_at, b.published_at, b.status, c.name, c.slug
    ORDER BY b.created_at DESC
  `;

  console.log(`Total blogs: ${blogs.length}`);

  const summary = {
    fukuoka: 0,
    yokohama: 0,
    osaka: 0,
    tokyo: 0,
    multipleStores: 0,
    noStore: 0
  };

  blogs.forEach(b => {
    const stores = b.store_slugs ? b.store_slugs.split(', ') : [];
    if (stores.length === 0) summary.noStore++;
    else if (stores.length > 1) summary.multipleStores++;
    else {
      if (stores[0] === 'fukuoka') summary.fukuoka++;
      if (stores[0] === 'yokohama') summary.yokohama++;
      if (stores[0] === 'osaka') summary.osaka++;
      if (stores[0] === 'tokyo') summary.tokyo++;
    }
  });

  console.log('\n--- 日記の店舗別所属サマリー ---');
  console.log(summary);

  await prisma.$disconnect();
}

generateTable().catch(console.error);
