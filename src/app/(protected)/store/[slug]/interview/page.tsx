import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getInterviewArticles } from '@/lib/actions/interview';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = getStoreData(params.slug);
  return {
    title: `${store?.name || params.slug} キャストインタビュー一覧 | Strawberry Boys`,
    description: `${store?.name || params.slug}で活躍するキャストたちの素顔に迫る独占インタビュー。プロフィールだけでは伝わらない彼らの魅力をライターがお届けします。`,
  };
}

export default async function StoreInterviewListPage({ params }: Props) {
  // 1. そのエリアのインタビュー記事を一覧取得
  const { articles, success } = await getInterviewArticles({ area: params.slug });
  
  // 2. 店舗設定の取得
  const store = getStoreData(params.slug);
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* ヘッダー */}
      {store?.template === 'yokohama' ? (
        <>
          <YokohamaHeader config={topConfig.header} />
          <div className="h-[54px] md:h-[65px]" />
        </>
      ) : (
        <>
          <FukuokaHeader config={topConfig.header} />
          <div className="h-[54px] md:h-[65px]" />
        </>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] mb-4">
            CAST INTERVIEW
          </h1>
          <p className="text-sm text-[#888] max-w-2xl mx-auto leading-relaxed">
            {store?.name || params.slug}のキャストたちをライターが徹底取材。<br className="hidden md:block" />
            普段の接客だけでは見えない、彼らの「素顔」と「想い」に迫ります。
          </p>
        </div>

        {!success || !articles || articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#E8E5DE]">
            <p className="text-[#888]">現在、公開されているインタビュー記事はありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => {
              const meta = article.interview_meta;
              const castLink = meta?.cast_links?.[0];
              // リンク先URLを新構造に合わせる
              const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
              const detailUrl = `/store/${params.slug}/interview/${castSlug}/${article.slug}`;

              return (
                <Link key={article.id} href={detailUrl} className="group">
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#E8E5DE] h-full flex flex-col">
                    {/* サムネイル */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.thumbnail_url || '/images/placeholder-interview.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#E8567A] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                          Vol.{meta?.vol_number || 1}
                        </span>
                      </div>
                    </div>

                    {/* テキスト内容 */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h2 className="text-lg font-bold text-[#1a1a1a] mb-3 line-clamp-2 leading-snug group-hover:text-[#E8567A] transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-xs text-[#666] line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#F5F3F0]">
                        <span className="text-[11px] font-medium text-[#E8567A]">
                          {castLink?.cast_name || 'CAST'}
                        </span>
                        <span className="text-[10px] text-[#999]">
                          {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* フッター */}
      {store?.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </div>
  );
}
