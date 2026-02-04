import { PageData } from '@/components/admin/news/types';
import NewsPageRenderer from '@/components/templates/news/NewsPageRenderer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface NewsDetailPageProps {
  params: {
    slug: string;
    newsSlug: string;
  };
}

async function getNewsPage(newsSlug: string, storeSlug: string) {
  const record = await prisma.pageRequest.findUnique({
    where: { slug: newsSlug },
  });

  if (!record || record.status !== 'published') {
    return null;
  }

  // 対象店舗に含まれているか確認
  const targetStoreSlugs = record.targetStoreSlugs as string[];
  if (!targetStoreSlugs.includes(storeSlug)) {
    return null;
  }

  const page: PageData = {
    id: record.id,
    slug: record.slug,
    title: record.title,
    status: record.status as 'published' | 'private',
    updatedAt: record.updatedAt.getTime(),
    sections: JSON.parse(JSON.stringify(record.sections || [])),
    thumbnailUrl: record.thumbnailUrl || undefined,
    targetStoreSlugs: targetStoreSlugs,
  };

  return page;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug, newsSlug } = params;

  const page = await getNewsPage(newsSlug, slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 md:pt-24">
      <NewsPageRenderer page={page} />
    </main>
  );
}
