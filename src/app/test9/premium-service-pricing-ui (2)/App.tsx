
import React, { useState, useEffect } from 'react';
import { Category, AppView, StoreConfig } from './types';
import { 
  MOCK_COURSES, 
  MOCK_TRANSPORT_AREAS, 
  MOCK_OPTIONS, 
  MOCK_CAMPAIGNS, 
  MOCK_BASIC_SERVICES, 
  MOCK_FREE_OPTIONS 
} from './constants';
import Breadcrumbs from './components/Breadcrumbs';
import CourseCard from './components/CourseCard';
import SimplePriceList from './components/SimplePriceList';
import FAQSection from './components/FAQSection';
import CampaignCard from './components/CampaignCard';
import HeroBanner from './components/HeroBanner';
import AdditionalInfoSection from './components/AdditionalInfoSection';
import AdminDashboard from './components/AdminDashboard';

// Q&Aの初期データ
const INITIAL_FAQS = [
  { question: "お店を利用する事が初めての経験で不安です", answer: "ご利用が初めてのお客様に対しても安心してご利用頂けるよう、経験豊富なセラピストさんによる優しいエスコートの後、入念なカウンセリングのお時間をお取りし、出来る限り不安無くご案内が出来るように努めております♫" },
  { question: "風俗店という言葉に怖いイメージがあります", answer: "当店は国に定められた風俗営業法の許可を取得している正規店です、お店の電話回線も携帯電話ではなく一般回線での登録となりますので、ぜひご安心してお問い合わせください♫" },
  { question: "本番はできますか?", answer: "風俗営業法上、本番行為は違法となりますので、そういった行為が目的、または強要の事実が発覚した場合、次回からのご利用をお断りさせていただく場合がございます。当店セラピストからも本番行為を強要することはございません。" },
  { question: "衛生面や性病感染などの心配がありますが大丈夫ですか?", answer: "当店セラピストは施術前に、殺菌作用の高い洗浄液にて消毒いたしております。さらに、セラピスト全員に定期的な性病検査を義務付けておりますのでご安心ください♫" },
  { question: "太っていて可愛くないけど相手してくれる?", answer: "もちろんです!選ぶのは私達ではなく、貴女です。何も遠慮することはありません。女性は気持ちのいいセックスをすると女性ホルモンの分泌で綺麗になると言われています。綺麗な女性はその機会が多く更に綺麗になります。そうでない女性は意地になって「私なんて」とマイナス思考になってしまいがちです。これを機会に心も身体も綺麗いに変身してはいかがですか?" },
  { question: "初めての利用で何を伝えれば良いか分かりません....", answer: "基本的には、ご利用日程、駅等のお待ち合わせ場所、ご利用コース、セラピストの指名有無をお伝え頂ければご案内をお取りします。HPを参考にお問い合わせ下さいませ♫" },
  { question: "当日予約はできますか?", answer: "もちろん可能です。その際、混雑の状況にもよりますがメール、LINEよりも直接お電話頂いた方がご案内がスムーズです♫" },
  { question: "深夜に利用はできますか?", answer: "基本的に当日受付は23時で終了致しますので、深夜帯にご利用の場合は予め早い段階でのご連絡をお願い致します。かつ深夜帯の待機セラピストは少数ですのでお早めにご連絡を頂いた方がご案内がスムーズです♫" },
  { question: "予約は何日先まで可能ですか?", answer: "基本的には長くとも2週間前程でお願いしております。例外として出張、ご旅行などで日程が予め決まっている場合は受付をしておりますのでお気軽にお問い合わせ下さい♫" },
  { question: "待ち合わせはどうすれば良いですか?", answer: "基本的にセラピストは電車での移動となりますので駅でのお待ち合わせとなります。その際何処か改札口、お店の前、ホテルなど目印をご指定頂けると幸いです♫" },
  { question: "自宅利用したいが住所は教えたくない", answer: "最寄りの駅でのお待ち合わせをして、そのままご自宅へ移動という事もできますので、受付にご相談下さい♫" },
  { question: "ホテルはどうすれば良いですか?", answer: "ご利用のお部屋はお客様で決めて頂き、先に入室されていても大丈夫です。もしお決まりでなければセラピストにお任せする事もできますのでお気軽にお伝え下さい♫" },
  { question: "セラピストが多くて選べない", answer: "年齢、タイプなどお伝え頂ければ受付の方でご希望に近いセラピストさんを選定致しますのでお気軽にお伝え下さい♫" },
  { question: "本名を伝えたくありません", answer: "偽名で大丈夫です、セラピストにもお客様の個人情報は基本的にお伝えはしませんのでご安心ください♫" },
  { question: "時間のカウントは会ってからですか?", answer: "施術コースのお時間のカウントはお部屋に入室後、カウンセリング、シャワーを浴びた後になりますので、お時間一杯ごゆっくりお過ごしください♫" }
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
  faqs: INITIAL_FAQS
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('PUBLIC');
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
      lastUpdated: new Date().toLocaleDateString('ja-JP').replace(/\//g, '.')
    };
    setStores([...stores, newStore]);
  };

  const handleDeleteStore = (id: string) => {
    setStores(stores.filter(s => s.id !== id));
  };

  const handleUpdateStoreInfo = (id: string, name: string, slug: string) => {
    setStores(stores.map(s => s.id === id ? { ...s, storeName: name, slug: slug } : s));
  };

  const tabs: { id: Category; label: string }[] = [
    { id: 'COURSES', label: 'コース' },
    { id: 'TRANSPORT', label: '送迎' },
    { id: 'OPTIONS', label: 'オプション' },
    { id: 'DISCOUNTS', label: '割引' },
  ];

  if (view === 'ADMIN') {
    return (
      <div className="min-h-screen bg-strawberry-dots bg-[#fffaf0] pb-20">
        <header className="py-6 px-4 bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-[100] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍓</span>
            <span className="font-serif italic text-rose-900 font-bold">Admin Panel</span>
          </div>
          <button 
            onClick={() => setView('PUBLIC')}
            className="text-xs font-bold text-rose-400 border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors"
          >
            公開サイトへ戻る
          </button>
        </header>
        <AdminDashboard 
          stores={stores} 
          onEdit={(s) => { alert('現在編集機能は準備中です。プレビュー機能をお試しください。'); }}
          onPreview={handlePreview}
          onAdd={handleAddStore}
          onDelete={handleDeleteStore}
          onUpdateStoreInfo={handleUpdateStoreInfo}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pb-16 bg-strawberry-dots bg-[#fffaf0] selection:bg-rose-200 selection:text-rose-900">
      {/* Admin Quick Switch */}
      <button 
        onClick={() => setView('ADMIN')}
        className="fixed top-4 right-4 z-[200] w-10 h-10 bg-white border border-rose-100 rounded-full flex items-center justify-center shadow-lg text-lg hover:scale-110 transition-transform"
        title="管理画面へ"
      >
        ⚙️
      </button>

      {/* Decorative Top Leaf */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-emerald-400/20 blur-2xl rounded-full" />

      {/* Header Section */}
      <header className="relative pt-20 pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <Breadcrumbs />
          <div className="inline-block relative mb-4">
             <span className="absolute -top-6 -right-6 text-4xl animate-bounce">🍓</span>
             <h1 className="text-6xl md:text-8xl font-serif italic text-rose-900 leading-tight">System</h1>
          </div>
          <p className="text-rose-400 text-sm md:text-base font-bold tracking-[0.3em] uppercase mt-2 font-rounded">
            {currentStore.storeName}
          </p>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4">
        <HeroBanner 
          imageUrl="https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1200"
          title="Strawberry Night"
          subtitle="今夜は、一番甘い夢を見ませんか？"
          priceTag="¥5,000 OFF"
          badge="SEASONAL CAMPAIGN"
        />

        {/* Tab Navigation */}
        <nav className={`z-50 transition-all duration-500 ${isSticky ? 'sticky top-0 bg-white/90 backdrop-blur-md py-3 shadow-md -mx-4 px-4' : 'mb-12'}`}>
          <div className="max-w-xl mx-auto">
            <div className="flex bg-rose-100/50 p-1.5 rounded-full border border-rose-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-full transition-all duration-500 outline-none font-rounded truncate px-1 ${
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

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {activeTab === 'COURSES' && (
            <div className="space-y-4">
              {currentStore.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              <div className="p-8 border-2 border-rose-100 rounded-[2rem] bg-white/60 text-rose-900/60 text-xs leading-relaxed space-y-4">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <span>🍓</span>
                  <span>【安心してご利用いただくために】</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none pl-0">
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
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-rose-900 font-rounded mb-2">送迎エリア・料金</h2>
                <p className="text-sm text-rose-400">ご指定の場所までセラピストが伺います。</p>
              </div>
              <SimplePriceList items={currentStore.transportAreas} title="Transportation Fees" />
              <div className="p-8 bg-white border-2 border-rose-100 rounded-[2rem] text-rose-900/60 text-xs leading-relaxed">
                <p>※交通状況により、お時間が前後する場合がございます。予めご了承ください。</p>
                <p>※タクシー利用等の特殊な条件については、予約時にスタッフまでご相談ください。</p>
              </div>
            </div>
          )}

          {activeTab === 'OPTIONS' && (
            <div className="space-y-8 pb-10">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-rose-900 font-rounded mb-2">サービス・オプション</h2>
                <p className="text-sm text-rose-400">ご希望に合わせて各サービスをご用命ください。</p>
              </div>
              <div className="bg-white border-2 border-rose-100 rounded-[2rem] p-8 shadow-lg shadow-rose-100/50">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-rose-400 text-lg">✨</span>
                  <h3 className="text-lg font-bold text-rose-900 font-rounded">基本サービス</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOCK_BASIC_SERVICES.map((s, i) => (
                    <span key={i} className="px-4 py-2 bg-rose-50 text-rose-600 text-xs md:text-sm font-bold rounded-full border border-rose-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white border-2 border-rose-100 rounded-[2rem] p-8 shadow-lg shadow-rose-100/50">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-rose-400 text-lg">🎁</span>
                  <h3 className="text-lg font-bold text-rose-900 font-rounded">無料オプション</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOCK_FREE_OPTIONS.map((o, i) => (
                    <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs md:text-sm font-bold rounded-full border border-emerald-100">
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
              <p className="text-right text-[10px] text-rose-300 px-2">※各キャンペーンの詳細はキャンペーンルールをご確認ください。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#fffaf0] via-[#fffaf0]/90 to-transparent md:relative md:bg-none md:mt-24 z-[60]">
        <div className="max-w-xl mx-auto">
          <button className="w-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold py-5 rounded-2xl shadow-xl shadow-rose-500/40 transition-all flex items-center justify-center gap-3 group relative overflow-hidden">
            <span className="relative z-10 text-lg font-rounded">ご予約・ご相談はこちら</span>
            <span className="relative z-10 text-2xl group-hover:rotate-12 transition-transform">🍓</span>
          </button>
        </div>
      </div>

      <footer className="mt-24 py-16 border-t border-rose-100 text-center">
        <div className="mb-6 text-2xl opacity-30">🍓 🍓 🍓</div>
        <p className="text-rose-300 text-xs font-bold tracking-widest">© 2024 SWEET BERRY SYSTEM. MADE WITH LOVE.</p>
      </footer>
    </div>
  );
};

export default App;
