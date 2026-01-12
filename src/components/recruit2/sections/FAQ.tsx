
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'beginner' | 'expert'>('all');

  const faqs = [
    // Existing Items
    { cat: 'beginner', q: '全くの未経験ですが大丈夫ですか？', a: 'もちろんです。現在活躍中のキャストの9割が未経験からのスタートです。充実した研修制度があるのでご安心ください。' },
    { cat: 'beginner', q: '週に何回くらい働く必要がありますか？', a: '週1回、3時間からでもOKです。本業や学業の合間に無理なく働ける完全自由シフト制を採用しています。' },
    { cat: 'general', q: '身バレが怖いのですが対策はありますか？', a: '業界最高水準のプライバシー対策を行っています。SNSの露出制限や、特定エリア外での活動など、個別の事情に合わせた柔軟な運用が可能です。' },
    { cat: 'expert', q: '経験者ですが、バック率の交渉は可能ですか？', a: 'はい。過去の実績や現在の知名度に応じて、個別に優遇条件を提示させていただきます。面接時に詳しくお聞かせください。' },
    { cat: 'general', q: '年齢制限はありますか？', a: '20歳〜45歳までの方を幅広く募集しています。年齢を重ねたからこそ出せる落ち着きや包容力も、私たちは高く評価しています。' },
    { cat: 'beginner', q: 'お酒が飲めないのですが…', a: '当店はお酒を飲むことを目的とした店舗ではありません。接客スキルそのものを重視しているため、お酒が苦手な方も大歓迎です。' },
    
    // New Items Added Based on Request
    { cat: 'general', q: '問い合せたその日に面接はできますか？', a: 'はい、スケジュールの空き状況によりますが、即日面接も可能です。お急ぎの場合はLINE相談窓口よりその旨をお伝えいただければスムーズに調整いたします。' },
    { cat: 'general', q: '反社会勢力との繋がりはありますか？', a: '一切ございません。私たちは創業8年の実績を持つ、法令を遵守したクリーンな運営を行っている企業です。健全な環境で安心して働いていただけます。' },
    { cat: 'beginner', q: '希望する日に休むことはできますか？', a: 'はい、完全自由シフト制ですので、ご自身の都合に合わせて自由に休日を設定いただけます。プライベートや他のお仕事との両立も万全です。' },
    { cat: 'general', q: '車での通勤は可能ですか？', a: '可能です。近隣の提携駐車場やコインパーキングをご案内いたします。ガソリン代や駐車料金の補助についても面談時に詳しくご説明いたします。' },
    { cat: 'general', q: '辞める時に違約金等の支払いはありますか？', a: '違約金やペナルティなどは一切ございません。辞める際もスムーズに手続きを行えるよう、キャストの権利を尊重した運営を行っております。' },
    { cat: 'general', q: '顔出しの強要はないですか？', a: '一切ございません。本名や顔を公開せずに活躍しているキャストも多数在籍しています。プライバシーを最優先に考えた活動プランを提案いたします。' },
    { cat: 'beginner', q: '１日どれぐらい稼げますか？', a: '働き方やご予約状況によりますが、未経験の方でも1日3〜5時間の稼働で2〜5万円程度の報酬を得られるケースが多いです。トップキャストになるとさらに高額な報酬が可能です。' },
    { cat: 'beginner', q: '女性経験が少なくても働けますか？', a: '全く問題ありません。独自の研修プログラムでは、技術だけでなく女性心理に基づいた接客マナーから丁寧にお教えしますので、自信を持ってデビューいただけます。' },
    { cat: 'general', q: 'どんな客層ですか？', a: '30代〜50代の、心身の癒やしを求める落ち着いた女性のお客様が中心です。マナーの良いお客様ばかりですので、安心して接客に集中いただけます。' },
    { cat: 'general', q: 'どの時間帯が稼げますか？', a: '平日の夕方から深夜にかけて、および土日祝日は特にご予約が集中します。効率よく稼ぎたい方はこれらの時間帯の出勤がおすすめです。' },
    { cat: 'general', q: '待機場の雰囲気はどんな感じですか？', a: '清潔感のある落ち着いたラウンジ形式の待機スペースを用意しています。Wi-Fi完備、ドリンク無料など、空き時間もリラックスして過ごせる環境です。' },
    { cat: 'general', q: '男性セラピスト同士揉める事はありますか？', a: 'キャスト同士が互いをプロとして尊重し合える社風を大切にしています。トラブルが起きないようスタッフが常に適切な管理を行っており、非常に良好な人間関係が築かれています。' },
    { cat: 'beginner', q: '仕事の時の服装はどのようなものが好ましいですか？', a: '清潔感のある「キレイめカジュアル」を推奨しています。具体的にはシャツやスラックスなど、お客様に安心感を与える服装です。貸出衣装の用意もございます。' },
    { cat: 'general', q: '自宅で待機するのでしょうか？', a: '基本的には店舗の待機スペースにてお待ちいただきますが、お住まいの場所やご経験によっては「自宅待機」からの出動も相談可能です。' },
    { cat: 'general', q: '頂く報酬は振込ですか？', a: '基本的には当日全額日払い（現金）にてお渡ししております。もちろん、ご希望に応じて銀行振込での対応も可能です。' },
  ];

  const filteredFaqs = activeTab === 'all' ? faqs : faqs.filter(f => f.cat === activeTab || f.cat === 'general');

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 sm:mb-16">
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">よくあるご質問</h3>
          <p className="text-slate-500 text-sm sm:text-base px-4">疑問を解消して、安心してお申し込みください。</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-2">
          {[
            { id: 'all', label: 'すべて' },
            { id: 'beginner', label: '未経験の方' },
            { id: 'expert', label: '経験者の方' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setOpenIdx(null); }}
              className={`px-5 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 group">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className={`w-full flex items-center justify-between p-5 sm:p-7 text-left transition-colors ${openIdx === idx ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`text-amber-600 font-serif text-lg font-bold transition-opacity ${openIdx === idx ? 'opacity-100' : 'opacity-40'}`}>Q.</span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">{faq.q}</span>
                </div>
                <span className={`shrink-0 transform transition-transform duration-500 text-amber-600 text-[10px] ${openIdx === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIdx === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 sm:p-7 bg-slate-50 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-200/50 flex gap-4">
                   <span className="text-slate-300 font-serif text-lg font-bold">A.</span>
                   <div>{faq.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm mb-6">解決しない疑問はございますか？</p>
          <a 
            href="https://line.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95"
          >
            <span>LINEで直接質問してみる</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
