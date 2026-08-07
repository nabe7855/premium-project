import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectUnassigned() {
  const blogs = await prisma.$queryRaw`
    SELECT b.id, b.title, b.content, b.status, b.created_at, b.cast_id,
           c.name AS cast_name, c.slug AS cast_slug,
           STRING_AGG(DISTINCT s.slug, ', ') AS store_slugs
    FROM blogs b
    LEFT JOIN casts c ON b.cast_id = c.id
    LEFT JOIN cast_store_memberships csm ON c.id = csm.cast_id
    LEFT JOIN stores s ON csm.store_id = s.id
    GROUP BY b.id, b.title, b.content, b.status, b.created_at, b.cast_id, c.name, c.slug
    HAVING COUNT(s.id) = 0 OR STRING_AGG(DISTINCT s.slug, ', ') IS NULL
    ORDER BY b.created_at DESC
  `;

  console.log('=== (Task 2-③) 所属店舗なし日記 2件の調査 ===');
  console.log(JSON.stringify(blogs, null, 2));

  const multiStoreBlogs = await prisma.$queryRaw`
    SELECT b.id, b.title, b.created_at, b.cast_id,
           c.name AS cast_name, c.slug AS cast_slug,
           STRING_AGG(DISTINCT s.slug, ', ') AS store_slugs
    FROM blogs b
    LEFT JOIN casts c ON b.cast_id = c.id
    LEFT JOIN cast_store_memberships csm ON c.id = csm.cast_id
    LEFT JOIN stores s ON csm.store_id = s.id
    GROUP BY b.id, b.title, b.created_at, b.cast_id, c.name, c.slug
    HAVING COUNT(DISTINCT s.id) > 1
    ORDER BY b.created_at DESC
  `;

  console.log('\n=== (Task 2-②) 複数店舗兼任キャスト日記 2件の調査 ===');
  console.log(JSON.stringify(multiStoreBlogs, null, 2));

  await prisma.$disconnect();
}

inspectUnassigned().catch(console.error);
