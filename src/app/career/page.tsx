import { getMediaArticles, getMediaTags } from '@/lib/actions/media';
import { ArrowRightIcon, BookOpenIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function CareerMediaTopPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const selectedTag = searchParams.tag;

  // 求職者向け・公開済みの記事のみをサーバー側で取得
  const result = await getMediaArticles('recruit');
  let allArticles = result.success
    ? result.articles?.filter((a: any) => a.status === 'published') || []
    : [];

  // タグを取得
  const tagsResult = await getMediaTags('recruit');
  const allTags = tagsResult.success ? tagsResult.tags || [] : [];

  // フィルタリング
  if (selectedTag) {
    allArticles = allArticles.filter((article: any) =>
      article.tags.some((t: any) => t.tag.name === selectedTag),
    );
  }

  // デモ用（まだ記事がない場合に表示するダミー情報）
  const renderEmptyState = () => (
    <div className="mt-8 rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-sm">
      <BookOpenIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-2 text-xl font-bold text-gray-800">ただいま準備中です</h3>
      <p>管理画面から「対象：求職者向け」「ステータス：公開」で記事を書いてみてください。</p>
    </div>
  );

  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* メディア ヒーローセクション */}
        <div>
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            未経験からの成功ガイド
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:leading-tight">
            高収入セラピストとして
            <br />
            自由に生きる<span className="text-blue-600">新しいキャリア</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            ストロベリーボーイズでは、女性用風俗の「不安」「法律のリアル」「稼げる仕組み」をすべて透明化しています。未経験の男性がプロとして自立し、圧倒的な収入と自由を手にするためのノウハウをお届けします。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/store/fukuoka/recruit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700"
            >
              福岡店 採用LPを見る
            </Link>
          </div>
        </div>

        {/* ヒーロー画像 (福岡市の夜景等をイメージしたプレースホルダー) */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
          <div className="absolute inset-0 bg-blue-900/10"></div>
          {/* 実際には画像がここに挿入されます */}
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="font-bold text-gray-400">Image: 福岡 天神 夜景</span>
          </div>
        </div>
      </div>

      {/* 記事一覧セクション */}
      <section>
        <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">新着・おすすめ記事</h2>
        </div>

        {/* タグフィルター */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <Link
            href="/career"
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
              !selectedTag
                ? 'bg-blue-600 text-white shadow-md'
                : 'border border-gray-200 bg-white text-gray-500 hover:bg-blue-50'
            }`}
          >
            すべて
          </Link>
          {allTags.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/career/?tag=${tag.name}`}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                selectedTag === tag.name
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-500 hover:bg-blue-50'
              }`}
            >
              {tag.name}
            </Link>
          ))}
        </div>

        {allArticles.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allArticles.map((article: any) => (
              <Link
                key={article.id}
                href={`/career/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* 記事サムネイル */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-200">
                  {article.thumbnail_url ? (
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-blue-50">
                      <BookOpenIcon className="h-8 w-8 text-blue-200" />
                    </div>
                  )}
                  {/* カテゴリタグ */}
                  {article.tags && article.tags.length > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-800 shadow-sm backdrop-blur-sm">
                      {article.tags[0].tag.name}
                    </span>
                  )}
                </div>

                {/* 記事情報 */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon size={14} />
                    <span>
                      {new Date(article.published_at || article.created_at).toLocaleDateString(
                        'ja-JP',
                      )}
                    </span>
                  </div>
                  <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-blue-600">
                    {article.title}
                  </h3>
                  <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600">
                    {article.excerpt ||
                      '記事の一部を要約して表示します。この内容は管理画面から自由に変更・執筆することができます。'}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                        編
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {article.author_name}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-transform group-hover:translate-x-1">
                      読む <ArrowRightIcon size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
