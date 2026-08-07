import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkArticle() {
  const article = await prisma.mediaArticle.findFirst({
    where: { slug: 'jyosei-fuzoku-guide' }
  });

  if (!article) {
    console.log('Article jyosei-fuzoku-guide NOT found in DB. Checking all articles in amolab...');
    const all = await prisma.mediaArticle.findMany({
      where: { category: 'amolab' },
      select: { id: true, slug: true, title: true }
    });
    console.log(all);
  } else {
    console.log('Found article jyosei-fuzoku-guide:');
    console.log('ID:', article.id);
    console.log('Title:', article.title);
    console.log('Category:', article.category);
    console.log('Length:', article.content?.length);
    console.log('\nCurrent Content:\n', article.content);
  }

  await prisma.$disconnect();
}

checkArticle();
