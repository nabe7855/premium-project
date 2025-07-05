'use client';
import React, { useState, useEffect } from 'react';
import {
  Heart,
  Shield,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  //ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Users,
  Newspaper,
  Lock,
  FileText,
  Calendar,
  Gift,
  MapPin,
  AlertTriangle,
  Ban,
  //UserX,
  Menu,
  X,
  Home,
  DollarSign,
  Settings,
  HelpCircle,
  FileX,
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('basic');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    setIsVisible(true);

    // Intersection Observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navigationItems = [
    { id: 'hero', label: 'トップ', icon: <Home className="h-4 w-4" /> },
    { id: 'empathy', label: 'お気持ち', icon: <Heart className="h-4 w-4" /> },
    { id: 'trust', label: '7つの約束', icon: <Shield className="h-4 w-4" /> },
    { id: 'service-flow', label: 'プレリュード', icon: <Star className="h-4 w-4" /> },
    { id: 'pricing', label: '料金', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'services', label: 'サービス', icon: <Settings className="h-4 w-4" /> },
    { id: 'transport', label: '送迎エリア', icon: <MapPin className="h-4 w-4" /> },
    { id: 'faq', label: 'よくある質問', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'terms', label: 'お約束', icon: <FileText className="h-4 w-4" /> },
    { id: 'prohibited', label: '禁止事項', icon: <FileX className="h-4 w-4" /> },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsSideNavOpen(false);
    }
  };

  const promises = [
    {
      icon: <Award className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: '歴史が紡ぐ信頼',
      description: '7年以上の営業実績',
      detail:
        '長年にわたり多くのお客様にご愛顧いただいており、確かな実績と信頼を築いてまいりました。',
    },
    {
      icon: <Newspaper className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: 'メディアが認めた品質',
      description: '週刊誌多数掲載',
      detail: '複数の有名週刊誌で紹介され、その品質とサービスが広く認められています。',
    },
    {
      icon: <Star className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: '選び抜かれたキャスト',
      description: '口コミ100件超の実績',
      detail:
        '厳選されたセラピストによる心のこもったサービスで、多くのお客様から高評価をいただいております。',
    },
    {
      icon: <Clock className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: 'あなただけの時間',
      description: 'カウンセリング時間外サービス',
      detail: 'お客様一人ひとりに寄り添い、十分な時間をかけてご相談をお伺いいたします。',
    },
    {
      icon: <Phone className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: '確かな窓口',
      description: '固定電話・LINE・メール対応',
      detail: '複数の連絡手段をご用意し、お客様のご都合に合わせてお気軽にご相談いただけます。',
    },
    {
      icon: <Lock className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: '絶対の守秘義務',
      description: '徹底した情報管理',
      detail: 'お客様の個人情報は厳重に管理し、プライバシーを完全にお守りいたします。',
    },
    {
      icon: <FileText className="h-6 w-6 text-pink-500 md:h-8 md:w-8" />,
      title: '公的な認可',
      description: '東京都認可の正規店',
      detail: '東京都の認可を受けた正規店として、法令を遵守し適切に運営しております。',
    },
  ];

  const serviceSteps = [
    {
      step: 1,
      title: '心の対話',
      subtitle: 'ヒアリング',
      description: 'お客様のお気持ちやご要望を丁寧にお伺いし、最適なサービスをご提案いたします。',
      duration: '10-15分',
      image:
        'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      step: 2,
      title: '聖なる沐浴',
      subtitle: 'ご入浴',
      description: '清潔で落ち着いた環境で、心身ともにリラックスしていただきます。',
      duration: '10分',
      image:
        'https://images.pexels.com/photos/6663525/pexels-photo-6663525.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      step: 3,
      title: '全身の解放',
      subtitle: 'ボディーマッサージ',
      description: '熟練のセラピストによる全身マッサージで、日頃の疲れを癒します。',
      duration: '20-30分',
      image:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      step: 4,
      title: '感性の覚醒',
      subtitle: '性感マッサージ',
      description: 'お客様の感性を大切にしながら、特別な時間をお過ごしいただきます。',
      duration: 'メインタイム',
      image:
        'https://images.pexels.com/photos/6663515/pexels-photo-6663515.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      step: 5,
      title: '甘い余韻',
      subtitle: 'アフターシャワー',
      description: 'ゆっくりとしたアフターケアで、心地よい余韻をお楽しみください。',
      duration: '10分',
      image:
        'https://images.pexels.com/photos/6663488/pexels-photo-6663488.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const pricingPlans = {
    basic: [
      {
        name: '60分コース',
        price: '¥12,000',
        extension: '延長30分 ¥6,000',
        popular: false,
        note: '施術時間が短く、基本コースの行程を終える事が出来ませんので、一部の施術のみとさせて頂きます。',
      },
      {
        name: '90分コース',
        price: '¥16,000',
        extension: '延長30分 ¥6,000',
        popular: false,
        note: '60分コースよりも比較的ゆったりとお過ごしが出来るコースです♡',
      },
      {
        name: '120分コース',
        price: '¥20,000',
        extension: '延長30分 ¥6,000',
        popular: true,
        note: '2時間をかけてメインの施術行程をご堪能いただける当店のスタンダードコースです♫',
        discount: '初回4,000円OFF',
      },
      {
        name: '150分コース',
        price: '¥24,000',
        extension: '延長30分 ¥6,000',
        popular: false,
        note: '少しお時間に余裕を持ちたい時の150分コースです♡',
        discount: '初回2,000円OFF',
      },
      {
        name: '180分コース',
        price: '¥29,000',
        extension: '延長30分 ¥6,000',
        popular: false,
        note: '総額7,000円お得な180分コースです♡',
        discount: '初回2,000円OFF',
      },
      {
        name: '240分コース',
        price: '¥39,000',
        extension: '延長30分 ¥6,000',
        popular: false,
        note: '総額9,000円お得で洗体オプション(2,000円分)が無料の240分コースです♡',
        discount: '初回4,000円OFF',
      },
      {
        name: '300分コース',
        price: '¥47,000',
        extension: '延長30分 ¥6,000',
        popular: false,
        note: '総額13,000円お得で洗体オプション(2,000円分)が無料の300分コースです♡',
        discount: '初回4,000円OFF',
      },
    ],
    special: [
      {
        name: '新苺コース（90分）',
        price: '¥10,000',
        extension: '延長30分 ¥6,000',
        popular: true,
        note: '入店してまもない新人さんを格安のご利用料金にてご案内させて頂きます♫',
      },
      {
        name: 'デートコース（180分）',
        price: '¥32,000',
        extension: '',
        popular: false,
        note: 'いきなりホテルに入るのが抵抗ある方は、外でお食事やショッピング等のデートをお楽しみいただき、気持ちがほぐれた所でホテルへ♫',
      },
      {
        name: 'デートコース（240分）',
        price: '¥42,000',
        extension: '',
        popular: false,
        note: '240分以上のデートコースで洗体オプション(2,000円分)が無料です♡',
      },
      {
        name: 'デートコース（300分）',
        price: '¥50,000',
        extension: '',
        popular: false,
        note: 'デート代、お食事代はお客様ご負担でお願い致します。',
      },
    ],
    couple: [
      {
        name: 'カップルコース（60分）',
        price: '¥19,000',
        extension: '延長30分 ¥10,000',
        popular: false,
        note: '女性のお客様、男性のお客様、当店セラピストの3名にてご案内をさせていただきます♫',
      },
      {
        name: 'カップルコース（90分）',
        price: '¥28,000',
        extension: '延長30分 ¥10,000',
        popular: true,
        note: '日常ではありえない非現実的なプレイをお楽しみください♡',
      },
      {
        name: 'カップルコース（120分）',
        price: '¥37,000',
        extension: '延長30分 ¥10,000',
        popular: false,
        note: 'お客様のご要望通りにサービスを行います',
      },
      {
        name: '3Pコース（90分）',
        price: '¥30,000',
        extension: '延長30分 ¥10,000',
        popular: false,
        note: 'お客様おひとりに対してセラピストが2名にて施術をする、まさに夢のようなコースです♫',
      },
      {
        name: '3Pコース（120分）',
        price: '¥40,000',
        extension: '延長30分 ¥10,000',
        popular: false,
        note: '当店の極楽コースを是非一度ご堪能ください☆',
      },
    ],
    overnight: [
      {
        name: 'お泊りコース（10時間）',
        price: '¥55,000',
        extension: '',
        popular: false,
        note: '通常の120分コースが含まれています、それ以外の時間はお食事やデートなどにご利用下さい。',
      },
      {
        name: 'お泊りコース（12時間）',
        price: '¥65,000',
        extension: '',
        popular: true,
        note: '料金設定がとてもお得なコースになっております',
      },
      {
        name: 'お泊りコース（14時間）',
        price: '¥75,000',
        extension: '',
        popular: false,
        note: '常識の範囲内でセラピストへ休息を与えて頂けると幸いです。(5〜6時間目安の睡眠時間)',
      },
      {
        name: 'お泊りコース（16時間）',
        price: '¥85,000',
        extension: '',
        popular: false,
        note: 'デート代お食事代はお客様ご負担でお願い致します。',
      },
      {
        name: 'お泊りコース（18時間）',
        price: '¥95,000',
        extension: '',
        popular: false,
        note: '大変お得なコースのため上限は18時間とさせていただきます',
      },
    ],
    travel: [
      {
        name: 'トラベルコース（24時間以内）',
        price: '¥100,000',
        extension: '',
        popular: false,
        note: '交通費、飲食費、交遊費など、旅行中にかかる基本的な費用はお客様のご負担となります。',
      },
      {
        name: 'トラベルコース（30時間以内）',
        price: '¥125,000',
        extension: '',
        popular: false,
        note: '兼業の関係上トラベル対応が難しいセラピストもおりますので、事務局またはセラピスト本人までお気軽にお問い合わせください。',
      },
      {
        name: 'トラベルコース（36時間以内）',
        price: '¥150,000',
        extension: '',
        popular: false,
        note: 'セラピストの睡眠時間を常識の範囲内(1日あたり5〜6時間)にて頂けますと幸いです。',
      },
      {
        name: 'トラベルコース（42時間以内）',
        price: '¥175,000',
        extension: '',
        popular: true,
        note: '大変お得なコースのため、トラベルコースには施術は含まれておりません',
      },
      {
        name: 'トラベルコース（48時間以内）',
        price: '¥200,000',
        extension: '',
        popular: false,
        note: '施術をご希望のお客様は通常の施術コースを60分コースから追加にてご提供が可能です',
      },
    ],
  };

  const services = {
    basic: [
      'カウンセリング',
      '指圧マッサージ',
      'パウダー性感',
      '乳首舐め',
      'クンニ',
      '指入れ',
      'Gスポット',
      'ポルチオ',
    ],
    free: ['キス', 'ハグ', 'フェラ', '手コキ', 'ボディータッチ', 'ローター', 'バイブ'],
    options: [
      {
        name: '指名料',
        price: '¥1,000',
        note: '当店は全セラピスト一律の指名料金です♫ 特にご希望がなければ無料となります',
      },
      {
        name: 'ドMオプション',
        price: '¥2,000',
        note: '目隠し、手枷などを使用しお客様をソフトに攻めていきます、通常プレイよりもゾクゾク感10倍間違い無し！',
      },
      {
        name: '洗体オプション',
        price: '¥2,000',
        note: 'イチャイチャの雰囲気そのままにお風呂にてお客様のお身体を丁寧に、そしていやらしく洗体をさせて頂きます',
      },
      {
        name: 'アイラインタッチ無しオプション',
        price: '-¥1,000',
        note: 'まだ女性風俗に対して抵抗のあるお客様でも、ご安心してご利用頂けるオプション',
      },
    ],
  };

  const transportAreas = [
    { area: '東京23区', price: '¥1,000' },
    { area: '東京23区外', price: '¥2,000' },
    { area: 'その他、関東近郊', price: '¥3,000' },
    { area: 'タクシー代（深夜利用の場合、駅から遠方の場合）', price: '応相談' },
  ];

  const prohibitedItems = [
    '過去に何度もキャンセルや変更をされた方',
    '違法薬物を使用されている方、またはそう見受けられる方',
    '無断での取材、ビデオカメラ・デジカメ・カメラ付携帯などによる撮影・盗撮・録音などの行為',
    'プライバシーを侵害する行為、ストーカー・つきまとい行為、もしくはそれに準ずる行為',
    '18歳未満の方',
    '性病、感染性皮膚病のある方',
    '生理中の方、妊娠されている方',
    '男性の方のご利用（当店は女性向け、女性専用です）',
    '暴力団及び暴力団関係者の方のご利用は一切お断り致します',
  ];

  const faqs = [
    {
      category: '初回利用',
      question: '初めての利用で不安です',
      answer:
        '初回のお客様には特に丁寧にご説明させていただきます。不安なことがございましたら、何でもお気軽にご相談ください。経験豊富なスタッフが親身にサポートいたします。',
    },
    {
      category: '衛生面',
      question: '衛生面は大丈夫？',
      answer:
        '衛生管理には特に力を入れており、全セラピストに定期的な健康診断を義務付けております。また、使用する備品類も完全に消毒・殺菌しております。',
    },
    {
      category: '外見',
      question: '外見にコンプレックスがあります',
      answer:
        'お客様の外見について心配される必要はございません。私どもは全てのお客様を温かくお迎えし、リラックスしてお過ごしいただけるよう努めております。',
    },
    {
      category: '予約',
      question: '当日予約は可能？',
      answer:
        '当日予約も承っております。ただし、時間帯によっては満員の場合もございますので、できるだけ事前のご予約をお勧めいたします。',
    },
    {
      category: 'プライバシー',
      question: '本名を教えたくない',
      answer:
        'お客様のプライバシーを最優先に考えており、偽名やニックネームでのご利用も可能です。個人情報の取り扱いには細心の注意を払っております。',
    },
    {
      category: '待ち合わせ',
      question: '待ち合わせ方法は？',
      answer:
        'ご希望の場所での待ち合わせが可能です。詳細な待ち合わせ方法については、ご予約時にご相談させていただきます。',
    },
  ];

  const concerns = [
    {
      text: 'セックスレスな毎日に疲れた',
      image:
        'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      text: '自分の感度に自信が持てない',
      image:
        'https://images.pexels.com/photos/5699479/pexels-photo-5699479.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      text: '一度は体験してみたい好奇心',
      image:
        'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      text: '満たされない心の渇き',
      image:
        'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      text: '誰にも相談できない深い願い',
      image:
        'https://images.pexels.com/photos/3771118/pexels-photo-3771118.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      text: 'もう、がっかりしたくない',
      image:
        'https://images.pexels.com/photos/5699488/pexels-photo-5699488.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Mobile Navigation Button - Positioned for thumb reach */}
      <button
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
        className="fixed right-4 z-50 rounded-full bg-pink-600 p-3 text-white shadow-lg transition-all duration-300 lg:hidden"
        style={{ top: '45%' }}
      >
        {isSideNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Dropdown Navigation Menu - Positioned below button */}
      {isSideNavOpen && (
        <div
          className="fixed right-4 z-40 transition-all duration-300 lg:hidden"
          style={{ top: '52%' }}
        >
          <div className="max-h-80 w-64 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-2xl">
            <div className="border-b border-pink-100 bg-pink-50 p-3">
              <h3 className="text-center font-serif text-sm font-bold text-gray-800">ページナビ</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-1 p-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? 'border-l-4 border-pink-500 bg-pink-100 text-pink-700'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2 text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isSideNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setIsSideNavOpen(false)}
        ></div>
      )}

      {/* Desktop Side Navigation */}
      <nav className="fixed right-0 top-0 z-40 hidden h-full w-56 bg-white shadow-lg lg:block">
        <div className="border-b border-pink-100 p-4">
          <h3 className="font-serif text-base font-bold text-gray-800">ページナビ</h3>
        </div>
        <div className="h-full space-y-1 overflow-y-auto p-2 pb-20">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'border-l-4 border-pink-500 bg-pink-100 text-pink-700'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {item.icon}
              <span className="ml-2 text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:mr-56">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-50"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(252,165,165,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,207,232,0.1),transparent_50%)]"></div>

          <div className="container relative z-10 mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div
                className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-gray-800 md:text-5xl lg:text-7xl">
                  頑張るあなたの心に、
                  <br />
                  <span className="text-pink-600">一粒のご褒美を。</span>
                </h1>
                <p className="mb-8 font-serif text-lg text-gray-600 md:text-xl lg:text-2xl">
                  ストロベリーボーイズへ、ようこそ。
                </p>

                {/* Service Description */}
                <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-white/90 p-6 text-left shadow-lg backdrop-blur-sm md:mb-12 md:p-8">
                  <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                    当店スタッフは、厳選した顔審査、独自の研修を通過したイケメンスタッフしか在籍しておりません。
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                    女性が安心して性の悩みを解消し、明るく生きていくためのサポートをさせて頂きます。異性との出会いがない、パートナーとのセックスレス、処女で自分に自信が持てない、寂しい、コンプレックスに悩んでいる、疲れている、気持ちよくなりたい、誰にも相談ができないことがあるなど、まずは一人で悩まずに気軽にご相談ください。
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                    女性としての欲望を満たせずに悩まれているあなたに、ココロとカラダを満たすお手伝いをさせていただきます。依頼をされる理由は様々だと思いますが、遠慮なく当店にお申し付け下さい。
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                    セラピスト全員に定期的な性病検査を義務付けておりますので、初めての方でも安心してご利用頂けます!
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                    厳しい顔審査を通過した厳選されたイケメンスタッフが、今までにない快感と癒される素敵な時間を恋人以上に優しくお届けします。
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                    女性風俗が初めてで、不安や心配事・ご質問などがあればお気軽にお問い合せ下さい。
                  </p>
                </div>

                <div className="mb-8 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm md:mb-12 md:p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <Shield className="mr-3 h-6 w-6 text-green-500 md:h-8 md:w-8" />
                    <span className="text-base font-semibold text-gray-800 md:text-lg">
                      性病検査義務化
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 md:text-base">
                    全セラピストに定期的な健康診断を義務付け、安心してご利用いただける環境を整えております。
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button className="transform rounded-full bg-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-pink-700 md:px-8 md:py-4 md:text-lg">
                    <Phone className="mr-2 inline h-4 w-4 md:h-5 md:w-5" />
                    今すぐ予約する
                  </button>
                  <button className="rounded-full border-2 border-pink-600 px-6 py-3 text-base font-semibold text-pink-600 transition-all duration-300 hover:bg-pink-600 hover:text-white md:px-8 md:py-4 md:text-lg">
                    <MessageCircle className="mr-2 inline h-4 w-4 md:h-5 md:w-5" />
                    LINEで相談
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Empathy Section */}
        <section id="empathy" className="bg-gradient-to-b from-pink-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                こんなお気持ち、
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                抱えていませんか？
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {concerns.map((concern, index) => (
                  <div
                    key={index}
                    className="transform overflow-hidden rounded-2xl border-l-4 border-pink-400 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={concern.image}
                        alt={concern.text}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="mb-3 flex items-center">
                        <Heart className="mr-3 h-5 w-5 text-pink-500 md:h-6 md:w-6" />
                        <div className="h-2 w-2 rounded-full bg-pink-400"></div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 md:text-base">
                        {concern.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center md:mt-12">
                <p className="font-serif text-lg text-gray-600 md:text-xl">
                  そんなあなたの気持ちに、私たちは寄り添います。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Building Section */}
        <section id="trust" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                ストロベリーボーイズの
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                7つの約束
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {promises.map((promise, index) => (
                  <div
                    key={index}
                    className="group transform rounded-2xl bg-gradient-to-br from-pink-50 to-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 rounded-full bg-white p-3 shadow-md transition-transform duration-300 group-hover:scale-110">
                        {promise.icon}
                      </div>
                      <h3 className="mb-2 text-base font-bold text-gray-800 md:text-lg">
                        {promise.title}
                      </h3>
                      <p className="mb-3 text-xs font-semibold text-pink-600 md:text-sm">
                        {promise.description}
                      </p>
                      <p className="text-xs leading-relaxed text-gray-600">{promise.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Flow Section */}
        <section
          id="service-flow"
          className="bg-gradient-to-b from-pink-50 to-white py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                "いちご一会"の
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                プレリュード
              </p>
              <div className="space-y-6 md:space-y-8">
                {serviceSteps.map((step, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="aspect-video overflow-hidden md:aspect-square md:w-1/3">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center p-4 md:w-2/3 md:p-6">
                        <div className="w-full">
                          <div className="mb-3 flex items-center">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-600 text-sm font-bold text-white shadow-lg md:h-10 md:w-10 md:text-base">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800 md:text-xl">
                                  {step.title}
                                </h3>
                                <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-600 md:px-3 md:text-sm">
                                  {step.duration}
                                </span>
                              </div>
                              <p className="mb-2 text-xs font-semibold text-pink-600 md:text-sm">
                                {step.subtitle}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                コース別
              </h2>
              <p
                id="price"
                className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl"
              >
                ご利用料金
              </p>

              {/* Tab Navigation */}
              <div className="mb-8 flex flex-wrap justify-center rounded-2xl bg-pink-50 p-2 md:mb-12">
                {[
                  { id: 'basic', label: '基本コース' },
                  { id: 'special', label: '特別コース' },
                  { id: 'couple', label: 'カップル・3P' },
                  { id: 'overnight', label: 'お泊り' },
                  { id: 'travel', label: 'トラベル' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300 md:px-6 md:py-3 md:text-base ${
                      activeTab === tab.id
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'text-pink-600 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Pricing Cards */}
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {pricingPlans[activeTab as keyof typeof pricingPlans].map((plan, index) => (
                  <div
                    key={index}
                    className={`transform rounded-2xl border-2 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-6 ${
                      plan.popular ? 'border-pink-400 ring-2 ring-pink-200' : 'border-pink-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="mb-4 inline-block rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white md:text-sm">
                        人気
                      </div>
                    )}
                    {'discount' in plan && plan.discount && (
                      <div className="mb-4 ml-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600 md:text-sm">
                        {plan.discount}
                      </div>
                    )}
                    <h3 className="mb-4 text-lg font-bold text-gray-800 md:text-xl">{plan.name}</h3>
                    <div className="mb-2 flex items-baseline">
                      <span className="text-2xl font-bold text-pink-600 md:text-3xl">
                        {plan.price}
                      </span>
                    </div>
                    {plan.extension && (
                      <p className="mb-4 text-xs text-gray-500 md:text-sm">{plan.extension}</p>
                    )}
                    <p className="mb-4 text-xs leading-relaxed text-gray-600 md:text-sm">
                      {plan.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-gradient-to-b from-pink-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                サービス・
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                オプション
              </p>

              <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
                {/* Basic Services */}
                <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800 md:text-xl">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 md:h-5 md:w-5" />
                    基本サービス
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {services.basic.map((service, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-pink-50 p-2 text-xs text-gray-700 md:text-sm"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free Options */}
                <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800 md:text-xl">
                    <Gift className="mr-2 h-4 w-4 text-pink-500 md:h-5 md:w-5" />
                    無料オプション
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {services.free.map((service, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-green-50 p-2 text-xs text-gray-700 md:text-sm"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paid Options */}
                <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-gray-800 md:text-xl">
                    <Star className="mr-2 h-4 w-4 text-yellow-500 md:h-5 md:w-5" />
                    有料オプション
                  </h3>
                  <div className="space-y-3">
                    {services.options.map((option, index) => (
                      <div key={index} className="rounded-lg border border-pink-200 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800 md:text-base">
                            {option.name}
                          </span>
                          <span className="text-sm font-bold text-pink-600 md:text-base">
                            {option.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{option.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transport Section */}
        <section id="transport" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                送迎エリア・
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                料金
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                {transportAreas.map((area, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-white p-4 shadow-lg md:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="mr-3 h-5 w-5 text-pink-600 md:h-6 md:w-6" />
                        <span className="text-sm font-semibold text-gray-800 md:text-lg">
                          {area.area}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-pink-600 md:text-xl">
                        {area.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-gradient-to-b from-pink-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                コンシェルジュ
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                デスク
              </p>

              {/* FAQ Items */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors duration-300 hover:bg-pink-50 md:px-6 md:py-6"
                    >
                      <div className="flex items-center">
                        <span className="mr-3 rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-600 md:mr-4 md:px-3">
                          {faq.category}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 md:text-lg">
                          {faq.question}
                        </span>
                      </div>
                      {activeFaq === index ? (
                        <ChevronUp className="h-4 w-4 text-pink-600 md:h-5 md:w-5" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-pink-600 md:h-5 md:w-5" />
                      )}
                    </button>
                    {activeFaq === index && (
                      <div className="px-4 pb-4 pt-0 md:px-6 md:pb-6">
                        <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Terms Section */}
        <section id="terms" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                大切な
              </h2>
              <p className="mb-12 text-center font-serif text-xl text-pink-600 md:mb-16 md:text-2xl lg:text-3xl">
                お約束
              </p>
              <div className="rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white p-6 shadow-lg md:p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-bold text-gray-800 md:text-xl">
                      <Calendar className="mr-2 h-4 w-4 text-pink-600 md:h-5 md:w-5" />
                      キャンセルポリシー
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      当日キャンセルの場合、料金の50%をキャンセル料として頂戴いたします。
                      前日までのキャンセルは無料です。お客様のご都合に合わせてお気軽にご相談ください。
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-bold text-gray-800 md:text-xl">
                      <Shield className="mr-2 h-4 w-4 text-pink-600 md:h-5 md:w-5" />
                      安全・安心のために
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      お客様とセラピストの安全を守るため、録音・録画・撮影は固くお断りしております。
                      また、セラピストへの過度な接触や迷惑行為はご遠慮ください。
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-bold text-gray-800 md:text-xl">
                      <Users className="mr-2 h-4 w-4 text-pink-600 md:h-5 md:w-5" />
                      セラピストとの直接連絡
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                      セラピストとの直接的な連絡先交換は、お互いの安全のためお控えいただいております。
                      ご要望がございましたら、必ず店舗を通じてお申し付けください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prohibited Items Section */}
        <section id="prohibited" className="bg-gradient-to-b from-red-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                禁止事項
              </h2>
              <p className="mb-12 text-center text-lg text-gray-600 md:mb-16 md:text-xl">
                下記に該当、もしくは疑わしい方のご利用をお断りさせていただきます。
              </p>

              <div className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-lg md:p-8">
                <div className="space-y-4">
                  {prohibitedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start rounded-lg border-l-4 border-red-400 bg-red-50 p-3 md:p-4"
                    >
                      <Ban className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-red-500 md:h-5 md:w-5" />
                      <p className="text-sm leading-relaxed text-gray-700 md:text-base">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 md:mt-8 md:p-6">
                  <h4 className="mb-3 flex items-center text-base font-bold text-gray-800 md:text-lg">
                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600 md:h-5 md:w-5" />
                    セラピストとの直接連絡について
                  </h4>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
                    当店セラピストとのツイッターDM、及びLINE@にてセラピストとの直接連絡はあくまでも「ご予約」についてのお問い合わせツールと定めさせて頂いております。
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
                    直接連絡による精神的な問題についての相談文面、行き過ぎた長文の送信、日常的に過度な連絡の送信などはセラピストの大きな負担となる可能性があり、禁止とさせて頂きます。
                  </p>
                  <p className="text-sm font-semibold text-red-600 md:text-base">
                    事務局の判断にて重くみた場合、当該のお客様の今後の当店のご利用を無期限禁止とさせて頂く場合もございます。
                  </p>
                </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-3 md:mt-6 md:p-4">
                  <p className="text-xs leading-relaxed text-gray-600 md:text-sm">
                    サービス中に、上記事項に該当する行為が発覚した場合、サービスを中断させていただきます。その際、料金のご返金には応じかねますので、ご了承ください。また、悪質とみなした場合は所轄の警察に通報致します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-pink-600 to-pink-700 py-16 text-white md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                今すぐ、あなたの時間を
              </h2>
              <p className="mb-8 text-lg opacity-90 md:mb-12 md:text-xl lg:text-2xl">
                特別な「いちご一会」の始まりです
              </p>
              <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 md:p-6">
                  <Phone className="mx-auto mb-4 h-6 w-6 md:h-8 md:w-8" />
                  <h3 className="mb-2 text-lg font-bold md:text-xl">今すぐ予約する</h3>
                  <p className="mb-4 text-xs opacity-80 md:text-sm">
                    お電話でのご予約が最もスムーズです
                  </p>
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition-colors duration-300 hover:bg-pink-50 md:px-6 md:py-3 md:text-base">
                    電話をかける
                  </button>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 md:p-6">
                  <MessageCircle className="mx-auto mb-4 h-6 w-6 md:h-8 md:w-8" />
                  <h3 className="mb-2 text-lg font-bold md:text-xl">LINEで相談する</h3>
                  <p className="mb-4 text-xs opacity-80 md:text-sm">お気軽にご相談いただけます</p>
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition-colors duration-300 hover:bg-pink-50 md:px-6 md:py-3 md:text-base">
                    LINEを開く
                  </button>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 md:p-6">
                  <Mail className="mx-auto mb-4 h-6 w-6 md:h-8 md:w-8" />
                  <h3 className="mb-2 text-lg font-bold md:text-xl">まずは質問だけ</h3>
                  <p className="mb-4 text-xs opacity-80 md:text-sm">
                    不安なことがあれば何でもお聞きください
                  </p>
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition-colors duration-300 hover:bg-pink-50 md:px-6 md:py-3 md:text-base">
                    メールする
                  </button>
                </div>
              </div>
              <div className="mt-8 text-center md:mt-12">
                <p className="text-sm opacity-80">
                  プライバシーを完全にお守りいたします。安心してご相談ください。
                </p>
                <p className="mt-2 text-xs opacity-70">
                  ※メール、LINEも対応しておりますが、順次対応をしておりますので返信が遅くなる恐れがございます。
                  <br />
                  当日予約などお急ぎの方はお電話頂いた方が対応が早く、ご案内がスムーズです。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
