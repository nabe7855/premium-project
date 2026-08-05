import { prisma } from '../src/lib/prisma.ts';

async function main() {
  const a = await prisma.mediaArticle.findUnique({ where: { slug: 'voice-aya' } });
  if (!a) return;
  console.log(a.content.substring(0, 1500));
}

main().catch(console.error);
