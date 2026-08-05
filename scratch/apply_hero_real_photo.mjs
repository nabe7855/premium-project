import { prisma } from '../src/lib/prisma.ts';

async function applyHeroRealPhoto() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found');
    return;
  }

  let content = article.content;

  // 冒頭のヒーロー画像（aya-photo-top.webp）を実写写真（aya-real-profile.webp）へ変更
  content = content.replace(
    /src="\/images\/amolab\/aya\/aya-photo-top\.webp"/g,
    'src="/images/amolab/aya/aya-real-profile.webp"'
  );

  // キャプションも実写写真にふさわしい洗練された文言に更新
  content = content.replace(
    /<figcaption>あやさん（仮名）／ 30代・既婚<\/figcaption>/g,
    '<figcaption class="text-[12px] text-gray-500 font-medium">【取材時のご本人ショット】あやさん（仮名）／ 30代・既婚 ※プライバシー保護のためアングルに配慮して撮影しております</figcaption>'
  );

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Successfully updated the hero image to the real photo (aya-real-profile.webp)!');
}

applyHeroRealPhoto().catch(console.error);
