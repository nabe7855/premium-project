import { prisma } from '../src/lib/prisma.ts';

async function cleanArticleJsonLd() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) return;

  // Remove any hardcoded <script type="application/ld+json"> ... </script> inside article.content
  let content = article.content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Removed hardcoded JSON-LD scripts from article.content!');
}

cleanArticleJsonLd().catch(console.error);
