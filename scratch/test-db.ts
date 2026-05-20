import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- START INTERVIEW DB INSPECTION ---');
  
  const metas = await prisma.interviewMeta.findMany({
    include: {
      cast_links: true
    }
  });
  
  console.log(`Found ${metas.length} interview metas.`);
  
  for (const meta of metas) {
    const article = await prisma.mediaArticle.findUnique({
      where: { id: meta.article_id }
    });
    
    console.log(`\n[Meta & Article]`);
    console.log(`Article ID: ${meta.article_id}`);
    console.log(`Title: ${article?.title}`);
    console.log(`Slug: ${article?.slug}`);
    console.log(`Status: ${article?.status}`);
    console.log(`Area: ${meta.area}`);
    console.log(`Cast Links:`, JSON.stringify(meta.cast_links, null, 2));
  }

  const casts = await prisma.cast.findMany({
    select: {
      id: true,
      name: true,
      slug: true
    }
  });
  console.log('\n--- ALL PRISMA CASTS ---');
  console.log(JSON.stringify(casts, null, 2));
  
  console.log('--- END INTERVIEW DB INSPECTION ---');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
