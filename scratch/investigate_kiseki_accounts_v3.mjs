import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function investigateKiseki() {
  console.log('=== INVESTIGATING KISEKI ACCOUNTS IN DB ===\n');

  // 横浜店所属のキセキ
  const kisekiCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.slug, c.is_active, c.created_at, c.profile, c.catch_copy, c.image_url, c.main_image_url
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'yokohama' AND c.name LIKE '%キセキ%'
  `;

  console.log(`Found ${kisekiCasts.length} Kiseki accounts in Yokohama store:\n`);

  const details = [];

  for (const k of kisekiCasts) {
    const castId = k.id;
    const blogs = await prisma.$queryRawUnsafe(`SELECT count(*)::int as count FROM blogs WHERE cast_id = '${castId}'`);
    const reviews = await prisma.$queryRawUnsafe(`SELECT count(*)::int as count FROM reviews WHERE cast_id = '${castId}'`);
    const schedules = await prisma.$queryRawUnsafe(`SELECT count(*)::int as count FROM schedules WHERE cast_id = '${castId}'`);
    const reservations = await prisma.$queryRawUnsafe(`SELECT count(*)::int as count FROM reservations WHERE cast_id = '${castId}'::uuid`);

    const info = {
      id: k.id,
      name: k.name,
      age: k.age,
      slug: k.slug,
      is_active: k.is_active,
      created_at: k.created_at,
      catch_copy: k.catch_copy,
      profile: k.profile ? k.profile.substring(0, 50) + '...' : '(空欄)',
      hasMainImage: Boolean(k.main_image_url || k.image_url),
      counts: {
        blogs: Number(blogs[0]?.count || 0),
        reviews: Number(reviews[0]?.count || 0),
        schedules: Number(schedules[0]?.count || 0),
        reservations: Number(reservations[0]?.count || 0)
      }
    };
    details.push(info);
    console.log(JSON.stringify(info, null, 2));
  }

  fs.writeFileSync('scratch/kiseki_investigation.json', JSON.stringify(details, null, 2));
}

investigateKiseki().catch(console.error);
