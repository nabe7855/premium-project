import { prisma } from '../src/lib/prisma.ts';

async function updateArticleAndFaq() {
  const baseTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで';

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found');
    return;
  }

  let content = article.content;

  // Clean up existing FAQ section
  content = content.replace(/<section class="faq[\s\S]*?<\/section>/g, '');

  const exactFaqHtml = `
<section class="faq bg-pink-50/50 border border-pink-100 rounded-3xl p-6 md:p-8 my-10">
  <h2 class="text-xl font-bold font-serif text-gray-800 border-b-2 border-pink-400 pb-2 inline-block mb-6">よくある質問</h2>
  <dl class="faq-list space-y-6">
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q1.</span>
        <span>既婚で子どももいますが、女性用風俗を利用していいのでしょうか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        はい。既婚・子育て中の利用者も多くいます。家庭がある方ほど自分を後回しにしがちで、心のメンテナンスとして利用される方が多くいらっしゃいます。
      </dd>
    </div>
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q2.</span>
        <span>初めてで、何をされるのか分からず怖いです。</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        「分からないこと」が不安の正体です。まずは当日の流れを知るところから始めるのがおすすめです。多くのセラピストは、初めての方にこそ丁寧に説明しながら進めてくれます。
      </dd>
    </div>
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q3.</span>
        <span>どうやって予約すれば、ハードルが低いですか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        気になるセラピストとSNSなどで少し会話を重ねてから予約に進む方が、心理的なハードルは下がります。会話の延長で進める方が初めての方には自然です。もちろん通常の予約フォームも利用できます。
      </dd>
    </div>
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q4.</span>
        <span>容姿やスタイルに自信がありません。</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        自信のなさは利用を止める理由にはなりません。自己肯定感が低かった利用者も「ちゃんと大事にしてもらえた」と感じ、少しずつ前を向けるようになっています。
      </dd>
    </div>
    <div class="faq-item pb-2">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q5.</span>
        <span>どこで待ち合わせるの？家族にバレませんか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        ホテルのロビーや指定のお部屋で合流できます。ご家族や知人に知られることのないよう、店舗名やサービス内容がわかる形での連絡・通知は一切行いません。プライバシーを最優先に保護しておりますのでご安心ください。
      </dd>
    </div>
  </dl>
</section>`;

  // Append clean FAQ section right before area selection block or at the end
  if (content.includes('area-select-block')) {
    content = content.replace(/<div class="area-select-block[\s\S]*/, exactFaqHtml + '\n\n$&');
  } else {
    content += exactFaqHtml;
  }

  // Update DB article
  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      title: baseTitle,
      seo_title: `${baseTitle}｜体験談`,
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Article DB title and FAQ section updated successfully!');
}

updateArticleAndFaq().catch(console.error);
