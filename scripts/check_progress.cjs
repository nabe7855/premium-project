const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const totalHotels = await prisma.hotel.count();
    const withDesc = await prisma.hotel.count({
      where: {
        ai_description: { not: null },
      },
    });
    const totalReviews = await prisma.hotelReview.count();
    const hotelsWithReviews = await prisma.hotel.count({
      where: {
        reviews: { some: {} },
      },
    });

    console.log('--- AI Content Generation Status ---');
    console.log(`Total Hotels: ${totalHotels}`);
    console.log(
      `Hotels with AI Description: ${withDesc} (${((withDesc / totalHotels) * 100).toFixed(1)}%)`,
    );
    console.log(`Total Reviews generated: ${totalReviews}`);
    console.log(
      `Hotels with Reviews: ${hotelsWithReviews} (${((hotelsWithReviews / totalHotels) * 100).toFixed(1)}%)`,
    );
    console.log('-----------------------------------');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
