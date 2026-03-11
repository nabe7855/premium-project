import DictionarySearch from '@/components/media/DictionarySearch';
import { getMediaArticles } from '@/lib/actions/media';
import { ArrowRight, Book, Shield, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

export default async function DictionaryTopPage() {
  const result = await getMediaArticles('ikejo-jiten', 'user');
  const articles = result.success ? result.articles || [] : [];

  // カテゴリ分けのロジック（実際にはタグなどで分けるのが理想だが、一旦モック的に整理）
  const categories = [
    { title: 'はじめて読む', icon: <Star className="text-yellow-400" />, desc: '女風の基礎知識' },
    {
      title: '利用の流れ',
      icon: <ArrowRight className="text-blue-400" />,
      desc: '予約から当日まで',
    },
    {
      title: '料金と見積もり',
      icon: <Book className="text-emerald-400" />,
      desc: '総額・内訳・指名料',
    },
    {
      title: '安心・ルール',
      icon: <Shield className="text-rose-400" />,
      desc: '安全面・身バレ対策',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-[#fdfaf8] py-20 md:py-32">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-pink-100/50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl"></div>

        <div className="container mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-400 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-pink-400"></span>
            初心者向け解説メディア
          </div>
          <h1 className="mb-8 text-[32px] font-black leading-tight text-gray-900 md:text-[48px]">
            イケジョ辞典 <span className="text-pink-500">Jiten</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            怖さや恥ずかしさをあおらず、分からない言葉や流れをやさしく整理し、
            自分で安心して判断できるようになるための辞典。
          </p>

          <DictionarySearch articles={articles} />
        </div>
      </section>

      {/* カテゴリセクション */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800">カテゴリから探す</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-pink-100 hover:shadow-xl hover:shadow-pink-50"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-pink-50">
                  {cat.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-800">{cat.title}</h3>
                <p className="text-[13px] text-gray-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 注目記事（まず読む3本） */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">まず読むべき3本</h2>
            <div className="mx-8 hidden h-[1px] flex-1 bg-gray-200 sm:block"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {articles.slice(0, 3).map((article: any) => (
              <Link
                key={article.id}
                href={`/ikejo/jiten/words/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {article.thumbnail_url && (
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-[10px] font-bold text-gray-800 backdrop-blur-sm">
                    MUST READ
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-gray-800 group-hover:text-pink-500">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-[13px] leading-relaxed text-gray-500">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 用語一覧 */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800">用語索引</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {articles.map((article: any) => (
              <Link
                key={article.id}
                href={`/ikejo/jiten/words/${article.slug}`}
                className="flex items-center gap-2 py-2 text-[15px] font-medium text-gray-600 transition-colors hover:text-pink-500"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gray-200 group-hover:bg-pink-400"></div>
                {article.title}
              </Link>
            ))}
            {articles.length === 0 && (
              <p className="col-span-full py-10 text-center italic text-gray-400">
                現在、用語を準備中です。
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 編集方針 */}
      <section className="border-t border-gray-100 bg-white py-20">
        <div className="container mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-8 text-xl font-bold text-gray-800">イケジョ辞典の編集方針</h2>
          <p className="mb-10 text-sm leading-relaxed text-gray-500">
            当辞典は、業界の専門用語を分かりやすく解説し、利用者が自分自身の意志で
            納得して判断できることを目的としています。誇張した表現や不安を煽る記載は行いません。
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/ikejo/jiten/policy"
              className="text-xs font-bold text-gray-400 underline underline-offset-4 hover:text-gray-600"
            >
              編集方針について
            </Link>
            <Link
              href="/ikejo/jiten/contacts"
              className="text-xs font-bold text-gray-400 underline underline-offset-4 hover:text-gray-600"
            >
              トラブル・相談先
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
