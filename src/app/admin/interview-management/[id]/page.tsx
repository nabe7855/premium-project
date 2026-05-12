import InterviewEditor from '@/components/admin/interview/InterviewEditor';
import { getInterviewArticleBySlug } from '@/lib/actions/interview';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditInterviewPage({ params }: { params: { id: string } }) {
  // Try finding by ID first
  const article = await prisma.mediaArticle.findUnique({
    where: { id: params.id },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    notFound();
  }

  // Get interview meta
  const meta = await prisma.interviewMeta.findUnique({
    where: { article_id: article.id },
    include: {
      cast_links: { orderBy: { display_order: 'asc' } },
    },
  });

  const fullData = {
    ...article,
    interview_meta: meta
  };

  return <InterviewEditor initialData={fullData} articleId={params.id} />;
}
