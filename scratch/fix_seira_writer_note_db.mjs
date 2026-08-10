import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixSeiraWriterNoteDb() {
  console.log('=== STANDARDIZING WRITER_NOTE IN DB FOR SEIRA INTERVIEW ===\n');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'seira-interview-vol4' }
  });

  if (!article) return;

  const meta = await prisma.interviewMeta.findFirst({
    where: { article_id: article.id }
  });

  if (meta) {
    await prisma.interviewMeta.update({
      where: { id: meta.id },
      data: {
        writer_note: ['35歳で挑戦したセイラさんの誠実で優しい人柄が、一人でも多くのお客様に伝われば幸いです。（イトウ）']
      }
    });
    console.log('✅ Standardized writer_note to string array in DB!');
  }
}

fixSeiraWriterNoteDb().catch(console.error);
