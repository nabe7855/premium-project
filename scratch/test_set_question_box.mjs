import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cast = await prisma.cast.findFirst({
    where: { is_active: true },
    select: { id: true, name: true, slug: true, question_box_url: true },
  });

  console.log('現行キャスト例:', cast);

  if (cast) {
    const updated = await prisma.cast.update({
      where: { id: cast.id },
      data: {
        question_box_url: 'https://peing.net/ja/test_therapist_qbox',
      },
    });
    console.log('✅ テスト用質問箱URL設定完了:', updated.name, updated.slug, updated.question_box_url);
  }
}

main().finally(() => prisma.$disconnect());
