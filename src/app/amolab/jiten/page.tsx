import { getMediaArticles } from '@/lib/actions/media';
import { BookOpenIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '女性用風俗・用語集 | アモラボ',
  description: '女性用風俗に関する専門用語や業界用語をわかりやすく解説する用語集です。',
};

export const revalidate = 3600;

// 五十音順のインデックス
const kanaRows = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', null, 'ゆ', null, 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', null, 'を', null, 'ん'],
];

export default async function AmolabJitenTop() {
  // getMediaArticles('amolab-jiten', 'category') or 'user'? 
  // Existing page used ('amolab-jiten', 'user'). I'll use that to fetch the dictionary articles.
  const result = await getMediaArticles('amolab-jiten', 'user');
  const allArticles = result.success
    ? result.articles?.filter((a: any) => a.status === 'published') || []
    : [];

  // 記事を最初の文字（ひらがな/カタカナ等）でグループ化する簡易ロジック
  const groupedArticles = allArticles.reduce((acc: any, article: any) => {
    let firstChar = article.title.charAt(0);
    // カタカナをひらがなに変換（簡易的）
    firstChar = firstChar.replace(/[\u30a1-\u30f6]/g, (match: string) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );
    // 濁点・半濁点の除去（簡易的）
    const normalizedChar = firstChar.normalize('NFD').replace(/[\u3099\u309A]/g, '');
    
    if (!acc[normalizedChar]) {
      acc[normalizedChar] = [];
    }
    acc[normalizedChar].push(article);
    return acc;
  }, {});

  // 見出しとして存在する文字のリスト
  const availableChars = new Set(Object.keys(groupedArticles));

  return (
    <div className="min-h-screen bg-[#fcfdff] font-sans text-slate-800">
      <div className="bg-pink-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
            <BookOpenIcon size={32} />
          </div>
          <h1 className="mb-4 font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            女風・用語集
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            女性用風俗の世界をより深く知るための専門用語・業界用語辞典。
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* 五十音インデックス（ナビゲーション） */}
        <section className="mb-20 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-10">
          <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
            Index
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {kanaRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-between">
                {row.map((char, colIndex) => {
                  if (!char) return <div key={colIndex} className="w-10" />;
                  const isActive = availableChars.has(char);
                  return isActive ? (
                    <a
                      key={char}
                      href={`#char-${char}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 font-bold text-pink-600 transition-colors hover:bg-pink-500 hover:text-white"
                    >
                      {char}
                    </a>
                  ) : (
                    <div
                      key={char}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300"
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* 用語一覧（五十音順） */}
        <section className="space-y-16">
          {Object.keys(groupedArticles).sort().map((char) => (
            <div key={char} id={`char-${char}`} className="scroll-mt-24">
              <h3 className="mb-6 border-b-2 border-pink-100 pb-2 text-2xl font-bold text-slate-800">
                {char}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {groupedArticles[char].map((article: any) => (
                  <Link
                    key={article.id}
                    // The existing page used /amolab/jiten/words/[slug], let's maintain that if it exists
                    href={`/amolab/jiten/words/${article.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-pink-200 hover:shadow-md"
                  >
                    <span className="font-bold text-slate-700 transition-colors group-hover:text-pink-600">
                      {article.title}
                    </span>
                    <ChevronRightIcon
                      size={18}
                      className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-pink-400"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-24 text-center">
          <Link
            href="/amolab/jyosei-fuzoku-guide"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-8 py-3 text-sm font-bold text-pink-500 transition-colors hover:bg-pink-50"
          >
            女性用風俗のご利用ガイドに戻る
          </Link>
        </section>
      </main>
    </div>
  );
}
