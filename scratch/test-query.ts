import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DB QUERY TEST ---');
  
  // Simulated CastDetailPage values
  const castId = "762f9a23-6851-4a7e-bc9e-9e97f22ce53b";
  const castName = "采（サイ）";
  const castSlug = "-2d6f1b";
  const areaSlug = "fukuoka";
  
  const areaQuery = areaSlug === 'fukuoka' ? { in: ['fukuoka', '福岡'] } : areaSlug === 'yokohama' ? { in: ['yokohama', '横浜'] } : areaSlug;

  console.log(`Searching for InterviewCastLink with castId: ${castId}, castSlug: ${castSlug}, castName: ${castName}, area:`, areaQuery);
  
  const castInterviewLink = await prisma.interviewCastLink.findFirst({
    where: {
      OR: [
        { cast_id: castId },
        { cast_name_romaji: castSlug },
        { cast_name: castName }
      ],
      interview_meta: {
        area: areaQuery
      }
    },
    include: {
      interview_meta: true
    }
  });
  
  console.log('QueryResult castInterviewLink:', JSON.stringify(castInterviewLink, null, 2));

  if (castInterviewLink && castInterviewLink.interview_meta) {
    const article = await prisma.mediaArticle.findUnique({
      where: {
        id: castInterviewLink.interview_meta.article_id,
      }
    });
    console.log('QueryResult article status:', article?.status);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
