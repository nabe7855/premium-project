import { prisma } from '../src/lib/prisma.ts';

async function executeTriage() {
  console.log('=== TASK A: Draft 5 articles ===');
  const slugsToDraft = [
    'self-pleasure-guide',
    'couple-sex-communication',
    'women-orgasm-science',
    'femtech-sex-health',
    'self-care-tonight'
  ];

  for (const slug of slugsToDraft) {
    await prisma.mediaArticle.update({
      where: { slug },
      data: {
        status: 'draft',
        updated_at: new Date(),
      }
    });
    console.log(`- Updated ${slug} status -> draft`);
  }

  console.log('\n=== TASK B: Fix jyosei-fuzoku-guide ===');
  const guide = await prisma.mediaArticle.findUnique({ where: { slug: 'jyosei-fuzoku-guide' } });
  if (guide) {
    let content = guide.content;

    // 1. 医療断定文の削除
    content = content.replace(/ホルモン分泌が活性化し、ストレス軽減や美肌効果、睡眠の質向上が期待できます。?/g, '');
    content = content.replace(/ホルモン分泌が活性化し、ストレス軽減や美肌効果、睡眠の質向上が期待できます/g, '');

    // 2. 末尾に運営者明記と内部リンク2本を追加（重複追加を防ぐチェック付き）
    if (!content.includes('本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています')) {
      const appendHtml = `
<div class="article-footer-blocks mt-12 pt-8 border-t border-gray-100">
  <div class="operator-note p-4 bg-pink-50/50 rounded-xl text-xs text-gray-500 border border-pink-100 mb-6">
    ※本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています。
  </div>
  <div class="related-recommendations bg-gray-50 p-6 rounded-2xl">
    <h3 class="text-sm font-bold text-gray-800 mb-3">あわせて読みたい</h3>
    <ul class="space-y-2 text-sm">
      <li>
        <a href="/store/fukuoka/first-time" class="text-pink-600 font-bold hover:underline">▶ はじめての女性用風俗｜当日の流れ・料金・不安への答え</a>
      </li>
      <li>
        <a href="/amolab/voice-aya" class="text-pink-600 font-bold hover:underline">▶ 実際に利用した方の体験談も参考にしてください（30代既婚あやさんの物語）</a>
      </li>
    </ul>
  </div>
</div>`;
      content += appendHtml;
    }

    await prisma.mediaArticle.update({
      where: { slug: 'jyosei-fuzoku-guide' },
      data: {
        content,
        updated_at: new Date(),
      }
    });
    console.log('✅ Updated jyosei-fuzoku-guide (medical sentence removed, operator note & 2 internal links appended)');
  }

  console.log('\n=== TASK C-1: Fix self-care-and-jofuu ===');
  const dictionaryItem = await prisma.mediaArticle.findUnique({ where: { slug: 'self-care-and-jofuu' } });
  if (dictionaryItem) {
    let content = dictionaryItem.content;
    const oldSentenceRegex = /女風を利用することで[、,]?\s*エストロゲン[\(（]美のホルモン[\)）]が分泌され[、,]?\s*肌が綺麗になったり表情が明るくなる女性は多いです。?/g;
    
    content = content.replace(oldSentenceRegex, '利用をきっかけに、自分の外見や生活を大切にする気持ちが生まれたという声は多く聞かれます。');
    // 直接文字列でのフォールバック
    content = content.replace('女風を利用することで、エストロゲン（美のホルモン）が分泌され、肌が綺麗になったり表情が明るくなる女性は多いです。', '利用をきっかけに、自分の外見や生活を大切にする気持ちが生まれたという声は多く聞かれます。');
    content = content.replace('女風を利用することで、エストロゲン(美のホルモン)が分泌され、肌が綺麗になったり表情が明るくなる女性は多いです。', '利用をきっかけに、自分の外見や生活を大切にする気持ちが生まれたという声は多く聞かれます。');
    content = content.replace('女風を利用することで、エストロゲン(美のホルモン)が分泌され、肌が綺麗になったり表情が明るくなる女性は多いです', '利用をきっかけに、自分の外見や生活を大切にする気持ちが生まれたという声は多く聞かれます。');

    await prisma.mediaArticle.update({
      where: { slug: 'self-care-and-jofuu' },
      data: {
        content,
        updated_at: new Date(),
      }
    });
    console.log('✅ Updated self-care-and-jofuu sentence');
  }
}

executeTriage().catch(console.error);
