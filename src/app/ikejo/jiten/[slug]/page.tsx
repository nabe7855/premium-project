import NoteArticleUI from '@/components/media/NoteArticleUI';
import { getMediaArticleBySlug, getRelatedArticles } from '@/lib/actions/media';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getMediaArticleBySlug(params.slug);
  if (!result.success || !result.article) return { title: 'Not Found' };

  const article = result.article;
  return {
    title: `${article.title} | 女風辞典 | イケジョ・ラボ`,
    description: article.seo_description || article.excerpt || '',
  };
}

export default async function DictionaryGuidePage({ params }: Props) {
  const result = await getMediaArticleBySlug(params.slug);

  if (!result.success || !result.article) {
    notFound();
  }

  const article = result.article as any;

  // カテゴリが ikejo-jiten でない場合は 404
  if (article.category !== 'ikejo-jiten') {
    notFound();
  }

  const relatedResult = await getRelatedArticles(article.id, 'user', 6);
  const filteredRelated = (relatedResult.articles || []).filter(
    (a: any) => a.category === 'ikejo-jiten',
  );

  return (
    <NoteArticleUI
      article={article}
      relatedArticles={filteredRelated}
      category="ikejo-jiten"
      baseUrl="/ikejo/jiten/words"
    />
  );
}
