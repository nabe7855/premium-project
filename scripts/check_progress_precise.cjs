const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const totalHotels = await prisma.lh_hotels.count();

    // AI紹介文（ai_description が null でないもの）
    const withDesc = await prisma.lh_hotels.count({
      where: {
        ai_description: { not: null, not: '' },
      },
    });

    // AI口コミ（is_verified: true の口コミを持つホテル）
    const hotelsWithReviews = await prisma.lh_hotels.count({
      where: {
        reviews_list: {
          some: { is_verified: true, is_cast: false },
        },
      },
    });

    // 口コミの総件数
    const totalAiReviews = await prisma.lh_reviews.count({
      where: { is_verified: true, is_cast: false },
    });

    console.log('\n===== 📊 AI生成進捗レポート =====');
    console.log(`全ホテル数: ${totalHotels}件`);
    console.log('-----------------------------------');
    console.log(
      `🤖 AI紹介文 完了済み: ${withDesc}件 (${((withDesc / totalHotels) * 100).toFixed(1)}%)`,
    );
    console.log(
      `📝 AI口コミ 完了済み(ホテル数): ${hotelsWithReviews}件 (${((hotelsWithReviews / totalHotels) * 100).toFixed(1)}%)`,
    );
    console.log(`💬 生成済み口コミ総数: ${totalAiReviews}件`);
    console.log('===================================\n');
  } catch (error) {
    console.error('進捗確認エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
