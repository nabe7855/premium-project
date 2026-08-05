import { prisma } from '../src/lib/prisma.ts';

async function fixDbTitleClean() {
  const baseTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで';

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      title: baseTitle,
      seo_title: baseTitle,
      updated_at: new Date(),
    },
  });

  console.log('✅ DB title clean reset!');
}

fixDbTitleClean().catch(console.error);
