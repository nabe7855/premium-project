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
    openGraph: {
      title: article.title,
      description: article.seo_description || article.excerpt || '',
      images: article.thumbnail_url ? [{ url: article.thumbnail_url }] : [],
    },
  };
}

export default async function DictionaryWordPage({ params }: Props) {
  const result = await getMediaArticleBySlug(params.slug);

  if (!result.success || !result.article) {
    notFound();
  }

  const article = result.article;

  // 関連記事を取得（同じカテゴリのもの）
  const relatedResult = await getRelatedArticles(article.id, 'user', 6);
  // カテゴリでフィルタリング（辞典カテゴリのみ）
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
