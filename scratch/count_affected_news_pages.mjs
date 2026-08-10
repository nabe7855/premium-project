import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function countAffectedNewsPages() {
  console.log('=== COUNTING AFFECTED NEWS PAGES FOR TEMPLATE FIX ===\n');

  const pages = await prisma.pageRequest.findMany({
    where: { status: 'published' },
    orderBy: { updatedAt: 'desc' }
  });

  console.log(`Total Published News Pages: ${pages.length}\n`);

  pages.forEach((p, idx) => {
    const hasHeroTitle = p.sections && p.sections.some((s) => s.type === 'hero' && s.content?.title);
    console.log(`[${idx + 1}] ID: ${p.id}`);
    console.log(`     Title: "${p.title}"`);
    console.log(`     Slug: "${p.slug}"`);
    console.log(`     Has Hero section with title (causes Duplicate H2): ${hasHeroTitle}`);
    console.log('---');
  });
}

countAffectedNewsPages().catch(console.error);
