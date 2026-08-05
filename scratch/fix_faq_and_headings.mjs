import { prisma } from '../src/lib/prisma.ts';

async function fixHtml() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) return;

  let content = article.content;

  // Clean up any duplicated Q5 blocks placed outside
  content = content.replace(/<div class="faq-item mb-6 border-b border-pink-100 pb-6">[\s\S]*?<\/div>\s*<\/div>/g, '');

  // Ensure <h2>編集部より</h2>
  content = content.replace(/<h[23][^>]*>\s*編集部より\s*<\/h[23]>/g, '<h2>編集部より</h2>');

  // Ensure <h2>あわせて読みたい</h2>
  content = content.replace(/<h[23][^>]*>\s*あわせて読みたい\s*<\/h[23]>/g, '<h2>あわせて読みたい</h2>');

  // Build clean FAQ section with 5 Q&As under <h2>よくある質問</h2>
  const faqHtml = `
<section class="faq bg-pink-50/50 border border-pink-100 rounded-3xl p-6 md:p-8 my-10">
  <h2 class="text-xl font-bold font-serif text-gray-800 border-b-2 border-pink-400 pb-2 inline-block mb-6">よくある質問</h2>
  <dl class="faq-list space-y-6">
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q1.</span>
        <span>準備するものはありますか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        特に用意するものはありません。ホテルやご自宅でのシャワー・タオル等の環境があれば十分です。リラックスできる服装でお待ちください。
      </dd>
    </div>
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q2.</span>
        <span>本当に写真通りのセラピストが来ますか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        はい。掲載写真はすべて本人であり、指名いただいたキャストが必ず伺います。
      </dd>
    </div>
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q3.</span>
        <span>性的な行為を強制されませんか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        無理なスキンシップや同意のない行為は一切ありません。お客様のお気持ち・ペースを一番に考慮して進めます。
      </dd>
    </div>
    <div class="faq-item border-b border-pink-100/80 pb-4">
      <dt class="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-start gap-2">
        <span class="text-pink-500 font-serif">Q4.</span>
        <span>予約後のキャンセルはできますか？</span>
      </dt>
      <dd class="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
        所定のキャンセル規定に沿って対応しております。急な体調不良やご都合の変更の際は、LINEまたはお電話で早めにご相談ください。
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

  // Replace existing <section class="faq"> ... </section> or add it
  if (content.includes('<section class="faq">')) {
    content = content.replace(/<section class="faq">[\s\S]*?<\/section>/g, faqHtml);
  } else {
    content += faqHtml;
  }

  // Ensure <h2>あわせて読みたい</h2> section links are replaced
  content = content.replace(/href="#"/g, '/store/fukuoka/first-time');

  // Update DB
  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Updated FAQ section and headings in DB!');
}

fixHtml().catch(console.error);
