import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateLinks() {
  const formUrl = '/amolab/interview-apply';

  // 1. Update voice-aya
  const ayaArticle = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' }
  });

  if (ayaArticle) {
    const ctaHtml = `
<div class="mt-12 rounded-2xl bg-rose-50 p-6 md:p-8 border border-rose-100">
  <h3 class="mb-4 text-xl font-bold text-slate-900">あなたの体験も、聞かせてください</h3>
  <p class="mb-6 text-slate-700 leading-relaxed">
    この記事を読んで「自分にも話せることがあるかも」と思った方へ。ライターのイトウがインタビューさせていただきます（テキストのやり取りでOK・匿名OK）。あなたの体験が、いま迷っている誰かの背中をそっと支えます。
  </p>
  <a href="${formUrl}" class="inline-block rounded-full bg-rose-500 px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105">
    ▶ インタビューに応募する
  </a>
</div>`;

    if (!ayaArticle.content.includes('あなたの体験も、聞かせてください')) {
      await prisma.mediaArticle.update({
        where: { slug: 'voice-aya' },
        data: {
          content: ayaArticle.content + '\n' + ctaHtml
        }
      });
      console.log('✅ Updated voice-aya');
    } else {
      console.log('⚠️ voice-aya already updated');
    }
  }

  // 2. Update news-20260816-info
  const news = await prisma.pageRequest.findUnique({
    where: { slug: 'news-20260816-info' }
  });

  if (news) {
    const sections = Array.isArray(news.sections) ? [...news.sections] : [];
    let updated = false;

    for (const section of sections) {
      if (section.type === 'text_block') {
        if (!section.content.description.includes('インタビューに応募する') && !section.content.description.includes(formUrl)) {
          section.content.description += `\n\n※<a href="${formUrl}" class="text-blue-600 underline">体験談は随時募集しています。あなたの体験を聞かせてください(匿名OK)</a>`;
          updated = true;
        }
      }
    }

    if (updated) {
      await prisma.pageRequest.update({
        where: { slug: 'news-20260816-info' },
        data: {
          sections: sections
        }
      });
      console.log('✅ Updated news-20260816-info');
    } else {
      console.log('⚠️ news-20260816-info already updated');
    }
  }

}

updateLinks().catch(console.error).finally(() => prisma.$disconnect());
