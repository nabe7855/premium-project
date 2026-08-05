import { prisma } from '../src/lib/prisma.ts';

async function main() {
  const article = await prisma.mediaArticle.findUnique({ where: { slug: 'voice-aya' } });
  if (!article) return;
  console.log('--- ALL CLASS NAMES & TAGS IN VOICE-AYA CONTENT ---');
  const classes = new Set(article.content.match(/class="[^"]+"/g));
  console.log(Array.from(classes));
}

main().catch(console.error);
