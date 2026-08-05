import { prisma } from '../src/lib/prisma.ts';

async function fixDbTitle() {
  const baseTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで';
  const fullTitle = `${baseTitle}｜体験談｜アモラボ`;

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      title: baseTitle,
      seo_title: fullTitle,
      updated_at: new Date(),
    },
  });

  console.log('✅ DB title updated to clean baseTitle and fullTitle!');
}

fixDbTitle().catch(console.error);
