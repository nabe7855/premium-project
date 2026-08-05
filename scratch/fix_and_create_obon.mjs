import { PrismaClient } from '@prisma/client';
import { generateAutoNewsSlug } from '../src/lib/actions/news-pages.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('=== STEP 1: RESTRICT EXISTING FUKUOKA OBON ARTICLE TO FUKUOKA ONLY ===');
  const fukuokaArticle = await prisma.pageRequest.update({
    where: { id: '2ead2c96-017e-4628-9aab-990a0c7e1839' },
    data: {
      targetStoreSlugs: ['fukuoka'],
      referenceUrls: {
        category: 'info',
        shortDescription: 'お盆期間中も休まず営業いたします。\n例年、この5日間は最も予約が集中する期間です。特に夕方以降のお時間は、直前のご連絡では、ご予約を取れない場合がございます。\n日程が読める方は、8月上旬までにご相談いただけますと、ご希望のセラピスト・お時間を確保しやすくなります。',
        storeSettings: {
          fukuoka: {
            status: 'published',
            publishedAt: '2026-07-30T01:57:33.083Z',
          },
        },
      },
    },
  });
  console.log(`✅ Fixed Fukuoka Obon Article ID: ${fukuokaArticle.id} | targetStoreSlugs: ${JSON.stringify(fukuokaArticle.targetStoreSlugs)}`);

  console.log('\n=== STEP 2: CREATE YOKOHAMA OBON ARTICLE ===');
  const yokohamaObonSlug = await generateAutoNewsSlug('info', '20260803');
  console.log(`Generated Yokohama Obon Slug: ${yokohamaObonSlug}`);

  const yokohamaArticle = await prisma.pageRequest.create({
    data: {
      title: '【横浜店】お盆期間(8月13日〜17日)も通常営業｜ご予約はお早めに',
      slug: yokohamaObonSlug,
      status: 'published',
      targetStoreSlugs: ['yokohama'],
      sections: [
        {
          id: `sec-${Date.now()}-hero`,
          type: 'hero',
          content: {
            title: '',
            imageUrl: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/2ead2c96-017e-4628-9aab-990a0c7e1839/1785376762962.webp',
            subtitle: 'お盆期間中も休まず営業いたします。',
            buttonText: '詳しく見る',
            description: 'ストロベリーボーイズ横浜店は、お盆期間(8月13日〜17日)も休まず通常営業いたします。受付時間も通常どおりです。\n\n例年この5日間は、1年で最もご予約が集中する期間です。特に8月13日〜15日の夕方以降は、直前のご連絡ではご希望に添えない場合がございます。帰省やご旅行で横浜(みなとみらい・関内・桜木町・新横浜エリア)にお越しの方のご利用も多く、ホテルへの出張のご依頼が増えるのもこの時期です。\n\n日程が決まっている方は、8月上旬までにご相談いただけますと、ご希望のセラピスト・お時間を確保しやすくなります。ご予約はWEB予約・公式LINE・お電話にて承っています。\n\n期間中の出勤状況は[出勤スケジュール](/store/yokohama/schedule)にて随時更新します。はじめてのご利用をご検討中の方は[初めての方へのご案内](/store/yokohama/first-time)を、コースと料金は[料金システム](/store/yokohama/price)をご覧ください。',
          },
        },
      ],
      referenceUrls: {
        category: 'info',
        shortDescription: 'お盆期間中も休まず営業いたします。\n例年、この5日間は最も予約が集中する期間です。特に夕方以降のお時間は、直前のご連絡では、ご予約を取れない場合がございます。\n日程が読める方は、8月上旬までにご相談いただけますと、ご希望のセラピスト・お時間を確保しやすくなります。',
        storeSettings: {
          yokohama: {
            status: 'published',
            publishedAt: new Date().toISOString(),
          },
        },
      },
    },
  });

  console.log(`✅ Created Yokohama Obon Article ID: ${yokohamaArticle.id} | Slug: ${yokohamaArticle.slug}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
