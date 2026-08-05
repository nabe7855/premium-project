import { prisma } from '../src/lib/prisma.ts';

async function fixDbTitleExact() {
  const fullTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで｜体験談｜アモラボ';

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      title: fullTitle,
      seo_title: fullTitle,
      updated_at: new Date(),
    },
  });

  console.log('✅ Updated DB title & seo_title to exact full string!');
}

fixDbTitleExact().catch(console.error);
