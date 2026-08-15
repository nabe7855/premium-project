import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  storeSlug: string;
}

export default async function TopColumnVoiceSection({ storeSlug }: Props) {
  // タグ「体験談」を持つ公開記事を取得
  const voiceTag = await prisma.mediaTag.findFirst({
    where: { name: '体験談' },
  });

  if (!voiceTag) return null;

  const articles = await prisma.mediaArticle.findMany({
    where: {
      status: 'published',
      published_at: { lte: new Date() },
      category: 'amolab',
      tags: {
        some: {
          tag_id: voiceTag.id,
        },
      },
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { published_at: 'desc' },
  });

  // 【改訂3】「体験談」タグの公開記事が2本以上の場合のみ表示（1本以下はnullを返しDOM未出力）
  if (articles.length < 2) {
    return null;
  }

  return (
    <section className="bg-pink-50/50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-400">
            Real Customer Voices
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-800 md:text-3xl">
            女性用風俗を初めて利用した方のリアルな体験談
          </h2>
          <p className="mt-3 text-xs text-gray-500 md:text-sm">
            予約前の不安から当日の流れまで、実際にご利用いただいた方の声をご紹介します。
          </p>
          <div className="mx-auto mt-4 h-1 w-10 bg-pink-200"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/amolab/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-pink-100/60"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-pink-50">
                {article.thumbnail_url ? (
                  <Image
                    src={article.thumbnail_url}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-pink-200">
                    AmoLab Voice
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-pink-500 shadow-sm backdrop-blur-sm">
                  体験談
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 line-clamp-2 font-serif text-base font-bold text-gray-800 transition-colors group-hover:text-pink-500">
                  {article.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex items-center text-xs font-bold text-pink-400">
                  <span>詳しく読む</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
