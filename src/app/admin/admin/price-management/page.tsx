'use client';

import AdditionalInfoSection from '@/components/admin/price/AdditionalInfoSection';
import Breadcrumbs from '@/components/admin/price/Breadcrumbs';
import CampaignCard from '@/components/admin/price/CampaignCard';
import {
  MOCK_BASIC_SERVICES,
  MOCK_CAMPAIGNS,
  MOCK_COURSES,
  MOCK_FREE_OPTIONS,
  MOCK_OPTIONS,
  MOCK_TRANSPORT_AREAS,
} from '@/components/admin/price/constants';
import CourseCard from '@/components/admin/price/CourseCard';
import FAQSection from '@/components/admin/price/FAQSection';
import HeroBanner from '@/components/admin/price/HeroBanner';
import PriceDashboard from '@/components/admin/price/PriceDashboard';
import SimplePriceList from '@/components/admin/price/SimplePriceList';
import { AppView, Category, StoreConfig } from '@/components/admin/price/types';
import { useEffect, useState } from 'react';

// Q&Aの初期データ
const INITIAL_FAQS = [
  {
    question: 'お店を利用する事が初めての経験で不安です',
    answer:
      'ご利用が初めてのお客様に対しても安心してご利用頂けるよう、経験豊富なセラピストさんによる優しいエスコートの後、入念なカウンセリングのお時間をお取りし、出来る限り不安無くご案内が出来るように努めております♫',
  },
  {
    question: '風俗店という言葉に怖いイメージがあります',
    answer:
      '当店は国に定められた風俗営業法の許可を取得している正規店です、お店の電話回線も携帯電話ではなく一般回線での登録となりますので、ぜひご安心してお問い合わせください♫',
  },
  {
    question: '本番はできますか?',
    answer:
      '風俗営業法上、本番行為は違法となりますので、そういった行為が目的、または強要の事実が発覚した場合、次回からのご利用をお断りさせていただく場合がございます。当店セラピストからも本番行為を強要することはございません。',
  },
  {
    question: '衛生面や性病感染などの心配がありますが大丈夫ですか?',
    answer:
      '当店セラピストは施術前に、殺菌作用の高い洗浄液にて消毒いたしております。さらに、セラピスト全員に定期的な性病検査を義務付けておりますのでご安心ください♫',
  },
  {
    question: '太っていて可愛くないけど相手してくれる?',
    answer:
      'もちろんです!選ぶのは私達ではなく、貴女です。何も遠慮することはありません。女性は気持ちのいいセックスをすると女性ホルモンの分泌で綺麗になると言われています。綺麗な女性はその機会が多く更に綺麗になります。そうでない女性は意地になって「私なんて」とマイナス思考になってしまいがちです。これを機会に心も身体も綺麗いに変身してはいかがですか?',
  },
  {
    question: '初めての利用で何を伝えれば良いか分かりません....',
    answer:
      '基本的には、ご利用日程、駅等のお待ち合わせ場所、ご利用コース、セラピストの指名有無をお伝え頂ければご案内をお取りします。HPを参考にお問い合わせ下さいませ♫',
  },
  {
    question: '当日予約はできますか?',
    answer:
      'もちろん可能です。その際、混雑の状況にもよりますがメール、LINEよりも直接お電話頂いた方がご案内がスムーズです♫',
  },
  {
    question: '深夜に利用はできますか?',
    answer:
      '基本的に当日受付は23時で終了致しますので、深夜帯にご利用の場合は予め早い段階でのご連絡をお願い致します。かつ深夜帯の待機セラピストは少数ですのでお早めにご連絡を頂いた方がご案内がスムーズです♫',
  },
  {
    question: '予約は何日先まで可能ですか?',
    answer:
      '基本的には長くとも2週間前程でお願いしております。例外として出張、ご旅行などで日程が予め決まっている場合は受付をしておりますのでお気軽にお問い合わせ下さい♫',
  },
  {
    question: '待ち合わせはどうすれば良いですか?',
    answer:
      '基本的にセラピストは電車での移動となりますので駅でのお待ち合わせとなります。その際何処か改札口、お店の前、ホテルなど目印をご指定頂けると幸いです♫',
  },
  {
    question: '自宅利用したいが住所は教えたくない',
    answer:
      '最寄りの駅でのお待ち合わせをして、そのままご自宅へ移動という事もできますので、受付にご相談下さい♫',
  },
  {
    question: 'ホテルはどうすれば良いですか?',
    answer:
      'ご利用のお部屋はお客様で決めて頂き、先に入室されていても大丈夫です。もしお決まりでなければセラピストにお任せする事もできますのでお気軽にお伝え下さい♫',
  },
  {
    question: 'セラピストが多くて選べない',
    answer:
      '年齢、タイプなどお伝え頂ければ受付の方でご希望に近いセラピストさんを選定致しますのでお気軽にお伝え下さい♫',
  },
  {
    question: '本名を伝えたくありません',
    answer:
      '偽名で大丈夫です、セラピストにもお客様の個人情報は基本的にお伝えはしませんのでご安心ください♫',
  },
  {
    question: '時間のカウントは会ってからですか?',
    answer:
      '施術コースのお時間のカウントはお部屋に入室後、カウンセリング、シャワーを浴びた後になりますので、お時間一杯ごゆっくりお過ごしください♫',
  },
];

const DEFAULT_STORE: StoreConfig = {
  id: 'store-01',
  storeName: 'Strawberry Night 東京本店',
  slug: 'tokyo-honten',
  lastUpdated: '2024.03.20',
  courses: MOCK_COURSES,
  transportAreas: MOCK_TRANSPORT_AREAS,
  options: MOCK_OPTIONS,
  campaigns: MOCK_CAMPAIGNS,
  faqs: INITIAL_FAQS,
};

export default function PriceManagementPage() {
  const [view, setView] = useState<AppView>('ADMIN'); // 初期表示はADMIN（ダッシュボード）
  const [activeTab, setActiveTab] = useState<Category>('COURSES');
  const [isSticky, setIsSticky] = useState(false);
  const [stores, setStores] = useState<StoreConfig[]>([DEFAULT_STORE]);
  const [currentStore, setCurrentStore] = useState<StoreConfig>(DEFAULT_STORE);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePreview = (store: StoreConfig) => {
    setCurrentStore(store);
    setView('PUBLIC');
  };

  const handleAddStore = () => {
    const timestamp = Date.now();
    const newStore: StoreConfig = {
      ...DEFAULT_STORE,
      id: `store-${timestamp}`,
      storeName: '新しい店舗',
      slug: `store-${timestamp}`,
      lastUpdated: new Date().toLocaleDateString('ja-JP').replace(/\//g, '.'),
    };
    setStores([...stores, newStore]);
  };

  const handleDeleteStore = (id: string) => {
    setStores(stores.filter((s) => s.id !== id));
  };

  const handleUpdateStoreInfo = (id: string, name: string, slug: string) => {
    setStores(stores.map((s) => (s.id === id ? { ...s, storeName: name, slug: slug } : s)));
  };

  const tabs: { id: Category; label: string }[] = [
    { id: 'COURSES', label: 'コース' },
    { id: 'TRANSPORT', label: '送迎' },
    { id: 'OPTIONS', label: 'オプション' },
    { id: 'DISCOUNTS', label: '割引' },
  ];

  if (view === 'ADMIN') {
    return (
      <div className="bg-strawberry-dots min-h-screen bg-[#fffaf0] pb-20">
        <PriceDashboard
          stores={stores}
          onEdit={() => {
            alert('現在編集機能は準備中です。プレビュー機能をお試しください。');
          }}
          onPreview={handlePreview}
          onAdd={handleAddStore}
          onDelete={handleDeleteStore}
          onUpdateStoreInfo={handleUpdateStoreInfo}
        />
      </div>
    );
  }

  return (
    <div className="bg-strawberry-dots min-h-screen bg-[#fffaf0] pb-32 selection:bg-rose-200 selection:text-rose-900 md:pb-16">
      {/* Admin Quick Switch - Back to Dashboard */}
      <button
        onClick={() => setView('ADMIN')}
        className="fixed right-4 top-24 z-[200] flex items-center justify-center rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-bold text-rose-500 shadow-lg transition-transform hover:scale-105"
        title="管理画面へ戻る"
      >
        ← ダッシュボードへ戻る
      </button>

      {/* Decorative Top Leaf */}
      <div className="absolute left-1/2 top-0 h-16 w-32 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-2xl" />

      {/* Header Section */}
      <header className="relative px-4 pb-8 pt-10 text-center">
        <div className="relative z-10 mx-auto max-w-4xl">
          <Breadcrumbs />
          <div className="relative mb-4 inline-block">
            <span className="absolute -right-6 -top-6 animate-bounce text-4xl">🍓</span>
            <h1 className="font-serif text-4xl italic leading-tight text-rose-900 md:text-6xl">
              System Preview
            </h1>
          </div>
          <p className="font-rounded mt-2 text-sm font-bold uppercase tracking-[0.3em] text-rose-400 md:text-base">
            {currentStore.storeName}
          </p>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-4xl px-4">
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1200"
          title="Strawberry Night"
          subtitle="今夜は、一番甘い夢を見ませんか？"
          priceTag="¥5,000 OFF"
          badge="SEASONAL CAMPAIGN"
        />

        {/* Tab Navigation */}
        <nav
          className={`z-50 transition-all duration-500 ${isSticky ? 'sticky top-0 -mx-4 bg-white/90 px-4 py-3 shadow-md backdrop-blur-md' : 'mb-12'}`}
        >
          <div className="mx-auto max-w-xl">
            <div className="flex overflow-hidden rounded-full border border-rose-100 bg-rose-100/50 p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-rounded flex-1 truncate rounded-full px-1 py-3 text-xs font-bold outline-none transition-all duration-500 md:text-sm ${
                    activeTab === tab.id
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'text-rose-300 hover:text-rose-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="duration-1000 animate-in fade-in slide-in-from-bottom-8">
          {activeTab === 'COURSES' && (
            <div className="space-y-4">
              {currentStore.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              <div className="space-y-4 rounded-[2rem] border-2 border-rose-100 bg-white/60 p-8 text-xs leading-relaxed text-rose-900/60">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
                  <span>🍓</span>
                  <span>【安心してご利用いただくために】</span>
                </div>
                <ul className="grid list-none grid-cols-1 gap-x-8 gap-y-2 pl-0 md:grid-cols-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-300">●</span>
                    <span>全コース、入室後のコース変更は致しかねます。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-300">●</span>
                    <span>キャストにより指名料が異なる場合がございます。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-300">●</span>
                    <span>泥酔・18歳未満の方の入店は固くお断りします。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-300">●</span>
                    <span>貴重品の管理はご自身でお願いいたします。</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'TRANSPORT' && (
            <div className="space-y-8">
              <div className="mb-10 text-center">
                <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                  送迎エリア・料金
                </h2>
                <p className="text-sm text-rose-400">ご指定の場所までセラピストが伺います。</p>
              </div>
              <SimplePriceList items={currentStore.transportAreas} title="Transportation Fees" />
              <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8 text-xs leading-relaxed text-rose-900/60">
                <p>※交通状況により、お時間が前後する場合がございます。予めご了承ください。</p>
                <p>※タクシー利用等の特殊な条件については、予約時にスタッフまでご相談ください。</p>
              </div>
            </div>
          )}

          {activeTab === 'OPTIONS' && (
            <div className="space-y-8 pb-10">
              <div className="mb-10 text-center">
                <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                  サービス・オプション
                </h2>
                <p className="text-sm text-rose-400">
                  ご希望に合わせて各サービスをご用命ください。
                </p>
              </div>
              <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-lg text-rose-400">✨</span>
                  <h3 className="font-rounded text-lg font-bold text-rose-900">基本サービス</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOCK_BASIC_SERVICES.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 md:text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-lg text-rose-400">🎁</span>
                  <h3 className="font-rounded text-lg font-bold text-rose-900">無料オプション</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOCK_FREE_OPTIONS.map((o, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 md:text-sm"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
              <SimplePriceList items={currentStore.options} title="Special Options" />
            </div>
          )}

          {activeTab === 'DISCOUNTS' && (
            <div className="space-y-6">
              <p className="px-2 text-right text-[10px] text-rose-300">
                ※各キャンペーンの詳細はキャンペーンルールをご確認ください。
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentStore.campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </div>
          )}

          <FAQSection faqs={currentStore.faqs} />
          <AdditionalInfoSection />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-[#fffaf0] via-[#fffaf0]/90 to-transparent p-4 md:relative md:mt-24 md:bg-none">
        <div className="mx-auto max-w-xl">
          <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-rose-500 py-5 font-bold text-white shadow-xl shadow-rose-500/40 transition-all hover:bg-rose-600 active:scale-95">
            <span className="font-rounded relative z-10 text-lg">ご予約・ご相談はこちら</span>
            <span className="relative z-10 text-2xl transition-transform group-hover:rotate-12">
              🍓
            </span>
          </button>
        </div>
      </div>

      <footer className="mt-24 border-t border-rose-100 py-16 text-center">
        <div className="mb-6 text-2xl opacity-30">🍓 🍓 🍓</div>
        <p className="text-xs font-bold tracking-widest text-rose-300">
          © 2024 SWEET BERRY SYSTEM. MADE WITH LOVE.
        </p>
      </footer>
    </div>
  );
}
