import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectFireworksNews() {
  console.log('=== INSPECTING FIREWORKS NEWS DATA ===\n');

  const article = await prisma.pageRequest.findUnique({
    where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' }
  });

  if (!article) {
    console.error('Article not found!');
    return;
  }

  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Thumbnail URL:', article.thumbnailUrl);
  console.log('Sections:', JSON.stringify(article.sections, null, 2));
  console.log('Reference URLs (Misc):', JSON.stringify(article.referenceUrls, null, 2));
}

inspectFireworksNews().catch(console.error);
