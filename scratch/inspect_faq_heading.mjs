import { prisma } from '../src/lib/prisma.ts';

async function checkFaqHeading() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  const match = article.content.match(/<h[23][^>]*>[\s\S]*?よくある質問[\s\S]*?<\/h[23]>/gi);
  console.log('FAQ Heading match:', match);
}

checkFaqHeading().catch(console.error);
