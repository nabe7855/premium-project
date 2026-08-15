import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Unpublishing 3 AI Articles ---');
  const slugs = ['success-for-50s', 'nightwork-comparison', 'income-model-and-experience'];
  const updateResult = await prisma.mediaArticle.updateMany({
    where: { slug: { in: slugs } },
    data: { status: 'draft' }
  });
  console.log(`Updated ${updateResult.count} articles to draft.`);

  console.log('--- Finding "セイラの記録" ---');
  const seiraArticles = await prisma.mediaArticle.findMany({
    where: {
      OR: [
        { title: { contains: 'セイラ' } },
        { slug: { contains: 'seira' } }
      ]
    },
    include: { tags: { include: { tag: true } } }
  });
  
  if (seiraArticles.length === 0) {
    console.log('Could not find article for セイラ.');
  } else {
    for (const article of seiraArticles) {
      console.log(`Found: ${article.title} (${article.slug})`);
      const hasInterviewTag = article.tags.some((t: any) => t.tag.name === 'インタビュー');
      console.log(`Has "インタビュー" tag? ${hasInterviewTag}`);
      
      if (!hasInterviewTag) {
        console.log('Adding "インタビュー" tag...');
        // Find or create tag
        let tag = await prisma.mediaTag.findUnique({ where: { name: 'インタビュー' } });
        if (!tag) {
          tag = await prisma.mediaTag.create({ data: { name: 'インタビュー' } });
        }
        
        await prisma.mediaArticleTag.create({
          data: {
            article_id: article.id,
            tag_id: tag.id
          }
        });
        console.log('Tag added successfully.');
      }
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
