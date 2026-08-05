import fs from 'fs';
import { prisma } from '../src/lib/prisma.ts';

async function checkDummyLinks() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.log('Article not found');
    return;
  }

  const matches = article.content.match(/href="[^"]*"/g);
  console.log('=== ALL HREF ATTRIBUTES IN ARTICLE CONTENT ===');
  console.log(matches);

  const hashes = article.content.match(/href="#"/g);
  console.log('Count of href="#" :', hashes ? hashes.length : 0);
}

checkDummyLinks().catch(console.error);
