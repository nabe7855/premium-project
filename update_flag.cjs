const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const article = await prisma.mediaArticle.findFirst({ where: { slug: 'fukuoka-recruit-guide' } });
  if (!article) return;
  
  const addition = `\n<div class="my-6 rounded-xl border border-amber-200 bg-amber-50/50 p-4"><p class="text-xs font-bold text-amber-900">💡 23歳・国家資格持ちの挑戦事例</p><p class="mt-1 text-xs text-amber-700">昼は治療院で働く鍼灸師のりくさんが応募した実体験ルポは<a href="https://www.sutoroberrys.jp/ikeo/riku-shikaku-recruit-story" class="font-bold text-amber-600 underline">国家資格を持つ23歳が応募した記録を読む</a>をご覧ください。</p></div>`;
  
  await prisma.mediaArticle.update({
    where: { id: article.id },
    data: { content: article.content + addition }
  });
  console.log('updated fukuoka-recruit-guide');
}
main().catch(console.error).finally(() => prisma.$disconnect());
