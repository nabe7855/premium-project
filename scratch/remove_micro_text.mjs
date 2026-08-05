import { prisma } from '../src/lib/prisma.ts';

async function removeMicroText() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found');
    return;
  }

  let content = article.content;

  console.log('Includes micro text:', content.includes('※ リンク先は'));

  // 該当文言および class="micro" の開発メモ用注記を削除
  content = content.replace(/<span class="micro">[\s\S]*?<\/span>/g, '');
  content = content.replace(/※\s*リンク先は「初めての方へ」ページ／料金ページに差し替えてください/g, '');

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Successfully removed the internal developer note from DB content!');
}

removeMicroText().catch(console.error);
