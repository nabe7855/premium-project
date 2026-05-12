import { getInterviewArticles } from '@/lib/actions/interview';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'キャストインタビュー一覧 | ストロベリーボーイズ',
  description:
    'ストロベリーボーイズのキャストへのインタビュー記事一覧。キャストの素顔や想いを深掘りします。',
};

export const revalidate = 3600; // 1時間キャッシュ

export default async function InterviewIndexPage() {
  const result = await getInterviewArticles({ limit: 20 });
  const articles = result.success ? result.articles : [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* ページヘッダー */}
      <div className="mb-12 text-center">
        <p
          className="mb-2 text-[11px] font-bold tracking-[0.3em]"
          style={{ color: '#E8567A' }}
        >
          CAST INTERVIEW
        </p>
        <h1
          className="font-serif text-3xl font-bold"
          style={{ color: '#1a1a1a' }}
        >
          キャストインタビュー
        </h1>
        <div
          className="mx-auto mt-4 h-px w-16"
          style={{ background: '#E8567A' }}
        />
        <p className="mt-4 text-sm leading-loose" style={{ color: '#555' }}>
          ストロベリーボーイズのキャストが語る、
          <br className="sm:hidden" />
          素顔と想い。
        </p>
      </div>

      {/* 記事一覧 */}
      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            現在公開中のインタビュー記事はありません。
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            if (!article) return null;
            const meta = article.interview_meta;
            return (
              <Link
                key={article.slug}
                href={`/magazine/interview/${article.slug}`}
                className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: '#F9D1DA' }}
              >
                {/* サムネイル */}
                {article.thumbnail_url ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-[4/3] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #FFF0F3, #F9D1DA)',
                    }}
                  >
                    <span className="text-4xl">♡</span>
                  </div>
                )}

                {/* カード情報 */}
                <div className="p-4">
                  {/* バッジ */}
                  <div className="mb-2 flex flex-wrap gap-1">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: '#E8567A' }}
                    >
                      {meta?.article_type === 'roundtable'
                        ? '座談会'
                        : meta?.article_type === 'feature'
                        ? '特集'
                        : 'インタビュー'}
                      {meta?.vol_number != null && ` vol.${meta.vol_number}`}
                    </span>
                    {meta?.area && (
                      <span
                        className="rounded-full border px-2 py-0.5 text-[10px]"
                        style={{ borderColor: '#F9D1DA', color: '#E8567A' }}
                      >
                        {meta.area}
                      </span>
                    )}
                  </div>

                  <h2
                    className="mb-1 font-serif text-base font-bold leading-snug"
                    style={{ color: '#1a1a1a' }}
                  >
                    {article.title}
                  </h2>

                  {article.excerpt && (
                    <p
                      className="line-clamp-2 text-xs leading-relaxed"
                      style={{ color: '#888' }}
                    >
                      {article.excerpt}
                    </p>
                  )}

                  <p
                    className="mt-3 text-[10px] tracking-widest"
                    style={{ color: '#bbb' }}
                  >
                    {(article.published_at ?? article.created_at).toLocaleDateString(
                      'ja-JP',
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
