import { prisma } from '../src/lib/prisma.ts';

async function applyFixes() {
  console.log('=== APPLYING V2.1 PRODUCTION FIXES FOR VOICE-AYA ===');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found!');
    return;
  }

  let content = article.content;

  // (1) 修正: href="#" のダミーリンクを実URLへ全数差し替え (v2 §6-2)
  content = content.replace(/href="#cta-first"/g, 'href="/store/fukuoka/first-time"');
  content = content.replace(/href="#"(\s*>初めての方へ（安心ガイド）を見る<\/a>)/g, 'href="/store/fukuoka/first-time"$1');
  content = content.replace(/href="#"(\s*>当日の流れ<\/a>)/g, 'href="/store/fukuoka/first-time#flow"$1');
  content = content.replace(/href="#"(\s*>はじめての女性用風俗｜当日の流れ・料金・不安への答え<\/a>)/g, 'href="/store/fukuoka/first-time"$1');
  content = content.replace(/href="#"(\s*>料金・コース一覧｜初回におすすめのプラン<\/a>)/g, 'href="/store/fukuoka/price"$1');
  content = content.replace(/href="#"(\s*>利用者インタビュー一覧｜“予約ボタンを押すまで”の物語たち<\/a>)/g, 'href="/amolab?tag=体験談"$1');

  // Any remaining generic href="#" replace with /store/fukuoka/first-time
  content = content.replace(/href="#"/g, 'href="/store/fukuoka/first-time"');

  // (4) 修正: 「よくある質問」「編集部より」「あわせて読みたい」を h3 から h2 に変更 (v2 §5-4)
  content = content.replace(/<h3([^>]*)>\s*よくある質問\s*<\/h3>/g, '<h2$1>よくある質問</h2>');
  content = content.replace(/<h3([^>]*)>\s*編集部より\s*<\/h3>/g, '<h2$1>編集部より</h2>');
  content = content.replace(/<h3([^>]*)>\s*あわせて読みたい\s*<\/h3>/g, '<h2$1>あわせて読みたい</h2>');

  // (3) 修正: FAQ 5問目「どこで待ち合わせるの?家族にバレませんか?」を追加
  const faq5Html = `
<div class="faq-item mb-6 border-b border-pink-100 pb-6">
  <div class="q font-bold text-gray-800 text-base mb-2 flex items-start gap-2">
    <span class="text-pink-500 font-serif">Q.</span>
    <span>どこで待ち合わせるの？家族にバレませんか？</span>
  </div>
  <div class="a text-xs text-gray-600 leading-relaxed pl-6">
    ホテルのロビーや指定のお部屋で合流できます。ご家族や知人に知られることのないよう、店舗名やサービス内容がわかる形での連絡・通知は一切行いません。プライバシーを最優先に保護しておりますのでご安心ください。
  </div>
</div>`;

  if (!content.includes('どこで待ち合わせるの？家族にバレませんか？')) {
    // Insert FAQ 5 right before </div> of FAQ list or before <h2>編集部より</h2>
    if (content.includes('<h2>編集部より</h2>')) {
      content = content.replace('<h2>編集部より</h2>', faq5Html + '\n\n<h2>編集部より</h2>');
    } else {
      content += faq5Html;
    }
  }

  // (2) 修正: 記事末尾のエエリア選択ブロック (5拠点: 福岡/横浜/東京/大阪/名古屋) の追加 (v2 §6-3)
  const areaBlockHtml = `
<div class="area-select-block bg-pink-50/70 border border-pink-100 rounded-3xl p-6 md:p-8 my-12">
  <h2 class="text-lg md:text-xl font-bold font-serif text-gray-800 text-center mb-2">お住まいのエリアから店舗を選ぶ</h2>
  <p class="text-xs text-gray-500 text-center mb-6">ストロベリーボーイズは全国主要都市でサービスを展開しています。各店の詳細・セラピスト一覧はこちら。</p>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
    <a href="/store/tokyo" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">東京店</span>
      <span class="block text-[10px] text-gray-400 mt-1">新宿・渋谷・池袋</span>
    </a>
    <a href="/store/fukuoka" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">福岡店</span>
      <span class="block text-[10px] text-gray-400 mt-1">博多・天神・中洲</span>
    </a>
    <a href="/store/yokohama" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">横浜店</span>
      <span class="block text-[10px] text-gray-400 mt-1">みなとみらい・関内</span>
    </a>
    <a href="/store/nagoya" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">名古屋店</span>
      <span class="block text-[10px] text-gray-400 mt-1">栄・名駅</span>
    </a>
    <a href="/store/osaka" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">大阪店</span>
      <span class="block text-[10px] text-gray-400 mt-1">梅田・難波</span>
    </a>
  </div>
</div>`;

  if (!content.includes('お住まいのエリアから店舗を選ぶ')) {
    content += '\n' + areaBlockHtml;
  }

  // (5) 修正: titleの末尾を 「〜予約ボタンを押すまで｜体験談｜アモラボ」に変更
  const title = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで｜体験談｜アモラボ';
  const seoTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が予約ボタンを押すまで｜体験談｜アモラボ';

  // Update Prisma database
  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      title,
      seo_title: seoTitle,
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ DB updated with all v2.1 production fixes!');

  // Check href="#" remaining count
  const remainingHashes = content.match(/href="#"/g);
  console.log('Remaining href="#" count:', remainingHashes ? remainingHashes.length : 0);
}

applyFixes().catch(console.error);
