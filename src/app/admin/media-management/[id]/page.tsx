import MediaEditor from '@/components/admin/media/MediaEditor';
import { getMediaArticleById } from '@/lib/actions/media';
import { notFound } from 'next/navigation';

export default async function EditMediaArticlePage({ params }: { params: { id: string } }) {
  const result = await getMediaArticleById(params.id);

  if (!result.success || !result.article) {
    notFound();
  }

  return <MediaEditor initialData={result.article} articleId={params.id} />;
}
