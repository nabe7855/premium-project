import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany();

  for (const store of stores) {
    console.log(`Resetting config for store: ${store.slug}...`);

    const defaultConfig = {
      banner: { imageUrl: '/初めてのお客様へバナー.png', isVisible: true },
      hero: {
        badge: 'FOR FIRST TIME VISITORS',
        mainHeading: '頑張るあなたの心に、',
        subHeading: '一粒のご褒美を。',
        subHeadingAccent: '一粒のご褒美を。',
        priceBadgeTitle: '＼ 初回限定特典 ／',
        priceBadgeCourse: '120分コース',
        priceBadgeOldPrice: '¥20,000',
        priceBadgeNewPrice: '¥16,000',
        priceBadgeDescription: '一番人気の満足プラン。',
        isVisible: true
      },
      welcome: {
        heading: 'ストロベリーボーイズへ、ようこそ。',
        subHeading: 'ABOUT STRAWBERRY BOYS',
        content: ['日々、忙しく働く女性の皆様。'],
        isVisible: true
      },
      forbidden: {
        heading: '安心・安全のために',
        subHeading: 'FORBIDDEN ITEMS',
        items: [
          { id: '1', title: '性的サービスの要求', description: '固くお断りしております。', icon: 'Ban' }
        ],
        isVisible: true
      },
      sectionOrder: [
        'banner', 'hero', 'anchorNav', 'welcome', 'threePoints', 'casts', 'sevenReasons', 'reservationFlow', 'dayFlow', 'pricing', 'forbidden', 'faq', 'cta'
      ]
    };

    // firstTimeConfig の初期化
    await prisma.firstTimeConfig.upsert({
      where: { store_id: store.id },
      create: { store_id: store.id, config: defaultConfig },
      update: { config: defaultConfig },
    });

    // storeTopConfig (Header/Footer/Banners) の初期化
    // ※ ここが全ページ共通の崩れ（横幅爆発）の主因である可能性が高い
    const defaultTopConfig = {
      header: {
        isVisible: true,
        logoText: '🍓',
        navLinks: [
           { name: 'HOME', href: '/store/{slug}', isVisible: true },
           { name: 'CAST一覧', href: '/store/{slug}/casts', isVisible: true }
        ]
      },
      footer: { isVisible: true },
    };

    await prisma.storeTopConfig.upsert({
      where: { store_id: store.id },
      create: { store_id: store.id, config: defaultTopConfig },
      update: { config: defaultTopConfig },
    });
  }

  console.log('SUCCESS: All stores configs reset to safe defaults.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
