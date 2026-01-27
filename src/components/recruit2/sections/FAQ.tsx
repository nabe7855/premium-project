import React, { useState } from 'react';

interface FAQProps {
  heading?: string;
  description?: string;
  items?: Array<{
    cat: string;
    q: string;
    a: string;
  }>;
  onOpenChat?: () => void;
}

const FAQ: React.FC<FAQProps> = ({
  heading = 'よくあるご質問',
  description = '疑問を解消して、安心してお申し込みください。',
  items = [
    // System & Rules
    {
      cat: 'general',
      q: '風営法の届け出はありますか？',
      a: 'はい、管轄警察署への届出を完了しており、法令を遵守して運営しております。安心してお仕事ができる環境を整えています。',
    },
    {
      cat: 'general',
      q: '入会金・月会費・解約料・ノルマなどはありますか？',
      a: '一切ございません。登録や活動にあたって金銭を請求することは決してありません。ノルマもなく、ご自身のペースで働けます。',
    },
    {
      cat: 'general',
      q: '辞める時に違約金等の支払いはありますか？',
      a: 'ございません。退店の際もスムーズに手続きを行い、ご本人の意思を尊重いたします。',
    },
    {
      cat: 'general',
      q: '事務局でスタッフとして働くことは可能ですか？',
      a: 'はい、店舗運営スタッフも随時募集しております。興味がございましたら面接時にお気軽にお申し出ください。',
    },
    {
      cat: 'general',
      q: '18歳ですが応募できますか？',
      a: '申し訳ございませんが、当サロンでは防犯および健全な運営の観点から、20歳以上の方のみを採用対象としております。',
    },
    {
      cat: 'expert',
      q: '現在他店舗に在籍をしていますが働けますか？',
      a: 'はい、掛け持ちも可能です。秘密厳守を徹底しておりますので、他店様に知られることなく活動いただけます。',
    },

    // Experience & Confidence
    {
      cat: 'beginner',
      q: 'マッサージ経験がなく、女性慣れもしていませんが大丈夫ですか？',
      a: '全く問題ありません。現在活躍中のキャストの多くが未経験スタートです。技術だけでなく、女性心理や会話のコツまで学べる丁寧なプロ講習をご用意しています。',
    },
    {
      cat: 'expert',
      q: '私自身ドMですが大丈夫ですか？ / 女性経験が非常に豊富ですが有利ですか？',
      a: 'あなたの個性や経験は強力な武器になります。多様なニーズを持つお客様がいらっしゃいますので、ぜひそのキャラクターを活かしてください。',
    },
    {
      cat: 'general',
      q: 'AV男優さん並みの絶倫である必要はありますか？',
      a: 'いいえ。当店はリラクゼーションと癒やしを提供するサロンであり、性的サービスのお店ではありませんので、そういった能力は一切必要ありません。',
    },

    // Work Style & Privacy
    {
      cat: 'general',
      q: '副業や本業持ちでも働けますか？会社や家族にバレませんか？',
      a: 'はい、多くのキャストが副業として活躍中です。ご自宅への郵送物はなく、連絡もLINEで行うため、周囲に知られることなく活動可能です。',
    },
    {
      cat: 'general',
      q: '出勤を増やしたいですが、常に特定の場所で待機するのは難しいです。',
      a: 'ライフスタイルに合わせて、ご自宅や外出先からの「自由出勤（待機）」も可能です。無理なく効率的に稼げるスタイルをご提案します。',
    },
    {
      cat: 'beginner',
      q: '宣材写真で顔を出さなくても人気は出ますか？',
      a: 'はい、雰囲気写真や口元を隠した写真でも、プロフィール文章や丁寧な対応で十分に人気を得ることが可能です。顔出しの強要は一切ありません。',
    },
    {
      cat: 'beginner',
      q: '写メ日記やTwitter(X)を使った事がなく不安です。',
      a: '専属スタッフがアカウント作成から投稿のコツ、画像加工まで丁寧にサポートしますので、初めての方でもご安心ください。',
    },

    // Service & Earnings
    {
      cat: 'general',
      q: 'どれくらい稼げますか？',
      a: '完全歩合制で、頑張った分だけ収入になります。未経験の方でも日給3〜5万円以上を目指せる環境です。全額日払いも可能です。',
    },
    {
      cat: 'general',
      q: '本番行為はできますか？',
      a: '一切できません。当店は風営法に基づく健全なメンズエステ店であり、本番行為や違法なサービスは固く禁じています。法令順守がキャスト全員の安全を守ります。',
    },
    {
      cat: 'beginner',
      q: 'どんなお客さんが多いですか？',
      a: '30代〜50代の大人の女性のお客様が中心です。お仕事や家事の疲れを癒やしに来られる、マナーの良い優しいお客様ばかりです。',
    },

    // Interview
    {
      cat: 'beginner',
      q: '面接に必要な持ち物や服装、場所は？',
      a: '顔写真付きの身分証明書のみご持参ください（履歴書不要）。服装は清潔感のあるカジュアルな私服でOKです。場所は弊社オフィス等の個室で行います。',
    },
    {
      cat: 'general',
      q: 'どんな内容の面接ですか？女性性癖を言わないといけませんか？',
      a: '雑談形式のラフな面談で、条件確認やシステムの質問がメインです。無理に性癖を聞き出すような圧迫面接は一切ありませんのでご安心ください。',
    },
    {
      cat: 'general',
      q: 'その日のうちに面接や実技講習は可能ですか？',
      a: 'はい、スケジュールが空いていれば即日対応可能です。まずはお話や相談だけ、という方も大歓迎です。',
    },
  ],
  onOpenChat,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'beginner' | 'expert'>('all');

  const filteredFaqs =
    activeTab === 'all' ? items : items.filter((f) => f.cat === activeTab || f.cat === 'general');

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center sm:mb-16">
          <h3 className="mb-4 font-serif text-2xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl">
            {heading}
          </h3>
          <p className="px-4 text-sm text-slate-500 sm:text-base">{description}</p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 px-2 sm:mb-12 sm:gap-4">
          {[
            { id: 'all', label: 'すべて' },
            { id: 'beginner', label: '未経験の方' },
            { id: 'expert', label: '経験者の方' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setOpenIdx(null);
              }}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all sm:px-8 sm:text-sm ${
                activeTab === tab.id
                  ? 'scale-105 bg-slate-900 text-white shadow-xl'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-slate-200 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className={`flex w-full items-center justify-between p-5 text-left transition-colors sm:p-7 ${openIdx === idx ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`font-serif text-lg font-bold text-amber-600 transition-opacity ${openIdx === idx ? 'opacity-100' : 'opacity-40'}`}
                  >
                    Q.
                  </span>
                  <span className="text-sm font-bold leading-relaxed text-slate-900 sm:text-base">
                    {faq.q}
                  </span>
                </div>
                <span
                  className={`shrink-0 transform text-[10px] text-amber-600 transition-transform duration-500 ${openIdx === idx ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIdx === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex gap-4 border-t border-slate-200/50 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 sm:p-7 sm:text-base">
                  <span className="font-serif text-lg font-bold text-slate-300">A.</span>
                  <div>{faq.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-base font-bold text-slate-700">解決しない疑問はございますか？</p>
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-3 rounded-full bg-[#06C755] px-8 py-4 text-xl font-bold text-white shadow-xl transition-all hover:bg-[#05b34c] hover:shadow-2xl active:scale-95 md:px-12 md:py-5"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5C6.5 2.5 2 6.6 2 11.7c0 2.9 1.4 5.5 3.8 7.1-.2.8-1.2 2.8-1.3 3 .1.1 2.9.2 4.9-1.4 1.1.3 2.3.5 3.6.5 5.5 0 10-4.1 10-9.2S17.5 2.5 12 2.5z" />
            </svg>
            <span>LINEで直接質問してみる</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
