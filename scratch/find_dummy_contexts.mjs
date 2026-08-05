import { prisma } from '../src/lib/prisma.ts';

async function main() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  const lines = article.content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('href="#"') || line.includes('href="#cta-first"')) {
      console.log(`Line ${idx + 1}:`, line.trim());
    }
  });
}

main().catch(console.error);
