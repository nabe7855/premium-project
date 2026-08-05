import { prisma } from '../src/lib/prisma.ts';

async function main() {
  const a = await prisma.mediaArticle.findUnique({ where: { slug: 'voice-aya' } });
  if (!a) return;
  const p = a.content.indexOf('<div class="profile">');
  console.log(a.content.substring(p, p + 1500));
}

main().catch(console.error);
