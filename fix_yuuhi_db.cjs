const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'yuuhi-interview-vol3';
  
  // 1. MediaArticle のカテゴリを 'interview' に修正
  const article = await prisma.mediaArticle.update({
    where: { slug },
    data: { category: 'interview' }
  });

  // 2. InterviewMeta に area を追加
  const meta = await prisma.interviewMeta.findUnique({
    where: { article_id: article.id }
  });

  if (meta) {
    await prisma.interviewMeta.update({
      where: { id: meta.id },
      data: { area: 'fukuoka' }
    });

    // 3. キャストリンク（ゆうひ、イトウ）を追加
    await prisma.interviewCastLink.deleteMany({
      where: { interview_meta_id: meta.id }
    });

    await prisma.interviewCastLink.createMany({
      data: [
        {
          interview_meta_id: meta.id,
          cast_name: 'ゆうひ',
          role: 'interviewee',
          display_order: 1
        },
        {
          interview_meta_id: meta.id,
          cast_name: 'イトウ',
          role: 'host',
          display_order: 2
        }
      ]
    });
    
    console.log('Fixed DB entries for Yuuhi. Category, area, and cast_links updated.');
  } else {
    console.log('InterviewMeta not found for article:', article.id);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
