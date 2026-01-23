import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// .env.local を明示的に読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function main() {
  const slug: string = 'fukuoka'; // ユーザーが作業していたのは福岡店? デフォルトはtokyoだが、アップロードしてたのは福岡かも
  console.log(`🔍 Checking data for slug: ${slug}`);

  // 環境変数の確認 (値は隠す)
  console.log(`🌍 DATABASE_URL loaded: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      recruit_pages: true,
    },
  });

  if (!store) {
    console.log('❌ Store not found');
    return;
  }

  console.log(`✅ Store found: ${store.name} (${store.id})`);
  console.log(`📄 Recruit Pages count: ${store.recruit_pages.length}`);

  store.recruit_pages.forEach((p) => {
    console.log(`   - [${p.section_key}] Content keys: ${Object.keys(p.content as object)}`);
    // 特定のキー（comicなど）の中身も少し出す
    if (p.section_key === 'comic') {
      console.log(
        '     Comic content:',
        JSON.stringify(p.content, null, 2).substring(0, 200) + '...',
      );
    }
  });

  // Tokyoもチェック
  if (slug !== 'tokyo') {
    const tokyo = await prisma.store.findUnique({
      where: { slug: 'tokyo' },
      include: { recruit_pages: true },
    });
    console.log(`\n🔍 Checking data for tokyo:`);
    if (tokyo) {
      console.log(`✅ Tokyo found. Pages: ${tokyo.recruit_pages.length}`);
      tokyo.recruit_pages.forEach((p) => {
        console.log(`   - [${p.section_key}]`);
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
