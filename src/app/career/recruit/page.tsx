import {
  BanknoteIcon,
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
  SparklesIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CareerRecruitPage() {
  const jobOpening = [
    {
      city: '福岡・博多/天神',
      title: 'Strawberry Boys 福岡店 セラピスト募集',
      pay: '月収 80万〜150万円以上可能',
      desc: '未経験からプロのセラピストへ。手厚い講習と、法令遵守のクリーンな環境で、人生最高の収入とやりがいを手に入れませんか？',
      slug: 'fukuoka',
      tags: ['本番禁止', '寮完備', '即日面接OK'],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-20 text-center">
        <h1 className="mb-6 font-serif text-4xl font-bold text-slate-900 md:text-5xl">
          募集要項・採用情報
        </h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-500">
          GENTLEMAN\'S CODEが提携するトップクラスの店舗で、あなたのポテンシャルを発揮しませんか。
          全店舗、法令遵守・本番行為一切なしのクリーンな環境をお約束します。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {jobOpening.map((job) => (
          <div
            key={job.slug}
            className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-xl shadow-slate-100/50 transition-all hover:shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000"
                  alt="Office"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-900/10"></div>
                <div className="absolute left-8 top-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-blue-600 shadow-sm backdrop-blur-md">
                    <MapPinIcon size={14} /> {job.city}
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="mb-6 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mb-6 font-serif text-2xl font-bold text-slate-900 md:text-3xl">
                  {job.title}
                </h2>
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-3 font-bold text-blue-600">
                    <BanknoteIcon size={20} />
                    <span>{job.pay}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-500">{job.desc}</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/store/${job.slug}/recruit`}
                    className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-700"
                  >
                    詳細・応募はこちら <ChevronRightIcon size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 採用の流れ */}
      <section className="mt-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900">デビューまでの流れ</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Entry to Debut Process
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            {
              step: '01',
              title: '応募・面接',
              desc: 'LINEまたはフォームから。まずはカジュアルにお話ししましょう。',
              icon: CalendarIcon,
            },
            {
              step: '02',
              title: '内定・講習',
              desc: 'プロの講師が技術から接客マインドまで丁寧に指導します。',
              icon: SparklesIcon,
            },
            {
              step: '03',
              title: 'プロフィール作成',
              desc: '提携スタジオであなたの魅力を最大限に引き出す撮影を行います。',
              icon: Image,
            },
            {
              step: '04',
              title: '実戦デビュー',
              desc: '万全のサポート体制のもと、セラピストとしての人生がスタート。',
              icon: ChevronRightIcon,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-[2rem] border border-white bg-slate-50 p-8 text-center"
            >
              <div className="mb-6 flex justify-center">
                <span className="font-serif text-4xl font-bold text-blue-100">{item.step}</span>
              </div>
              <h3 className="mb-4 text-sm font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs leading-loose text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-32 rounded-[3rem] bg-blue-50 p-10 text-center md:p-20">
        <h2 className="mb-8 font-serif text-2xl font-bold text-slate-900 md:text-3xl">
          不安なことは、コンシェルジュが解消します。
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-slate-500">
          「自分に向いているか不安」「副業でも大丈夫？」など、どんな些細な疑問も専属のコンサルタントが丁寧にお答えします。強引な勧誘は一切ございません。
        </p>
        <a
          href="https://line.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-10 py-5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:scale-105"
        >
          LINEで無料相談・質問する
        </a>
      </div>
    </div>
  );
}
