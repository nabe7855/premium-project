import { prisma } from '../src/lib/prisma.ts';

async function applyCleanArticleAndPhoto() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found');
    return;
  }

  let content = article.content;

  // 1. プレビュー注記ブロックを削除
  content = content.replace(/<div class="editor-note">[\s\S]*?<\/div>/g, '');

  // 2. ヒーロー画像（イラスト）の注釈を「ご本人の写真」からイラストにふさわしい注釈に更新
  content = content.replace(
    /あやさん（仮名）――顔が写らない形で、ご本人の写真を掲載しています。/g,
    'あやさん（仮名）／ 30代・既婚'
  );

  // 3. プロフィール欄内の実写写真ブロックを美しく整える
  const realPhotoHtml = `<div class="profile-photo-wrapper my-6 text-center">
      <figure class="inline-block max-w-full">
        <img src="/images/amolab/aya/aya-real-profile.webp" alt="取材時のあやさん（ご本人ショット）" width="800" height="600" loading="lazy" class="rounded-2xl mx-auto shadow-md border border-pink-100 max-w-full h-auto" />
        <figcaption class="text-[11px] text-gray-500 mt-2 font-sans font-medium">【取材時のご本人ショット】※プライバシー保護のためアングルに配慮して撮影しております</figcaption>
      </figure>
    </div>`;

  // 既に profile-photo-wrapper があれば置き換え、無ければ追加
  if (content.includes('profile-photo-wrapper')) {
    content = content.replace(/<div class="profile-photo-wrapper[\s\S]*?<\/div>\s*<\/figure>\s*<\/div>/g, realPhotoHtml);
    content = content.replace(/<div class="profile-photo-wrapper[\s\S]*?<\/figcaption>\s*<\/figure>\s*<\/div>/g, realPhotoHtml);
  } else if (content.includes('<div class="profile">')) {
    content = content.replace(/<div class="profile">/, `<div class="profile">\n${realPhotoHtml}`);
  }

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      thumbnail_url: '/images/amolab/aya/aya-photo-top.webp',
      updated_at: new Date(),
    },
  });

  console.log('✅ Cleaned up article content and set hybrid photo layout in DB!');
}

applyCleanArticleAndPhoto().catch(console.error);
