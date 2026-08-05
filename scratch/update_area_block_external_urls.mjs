import { prisma } from '../src/lib/prisma.ts';

async function updateAreaBlockUrls() {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found');
    return;
  }

  let content = article.content;

  const newAreaBlockHtml = `<div class="area-select-block bg-pink-50/70 border border-pink-100 rounded-3xl p-6 md:p-8 my-12">
  <h2 class="text-lg md:text-xl font-bold font-serif text-gray-800 text-center mb-2">お住まいのエリアから店舗を選ぶ</h2>
  <p class="text-xs text-gray-500 text-center mb-6">ストロベリーボーイズは全国主要都市でサービスを展開しています。各店の詳細・セラピスト一覧はこちら。</p>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
    <a href="https://sutoroberrys.com/main/" target="_blank" rel="noopener noreferrer" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">東京店 ↗</span>
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
    <a href="https://sutoroberrys-aichi.com/main.html" target="_blank" rel="noopener noreferrer" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">名古屋店 ↗</span>
      <span class="block text-[10px] text-gray-400 mt-1">栄・名駅</span>
    </a>
    <a href="https://sutoroberrys-osaka.com/main.html" target="_blank" rel="noopener noreferrer" class="block bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 transition-colors">
      <span class="block text-sm font-bold text-gray-800">大阪店 ↗</span>
      <span class="block text-[10px] text-gray-400 mt-1">梅田・難波</span>
    </a>
  </div>
</div>`;

  // Replace existing area-select-block
  content = content.replace(/<div class="area-select-block[\s\S]*?<\/div>\s*<\/div>/g, newAreaBlockHtml);

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Updated area select block with exact external sister store URLs & rel="noopener noreferrer"!');
}

updateAreaBlockUrls().catch(console.error);
