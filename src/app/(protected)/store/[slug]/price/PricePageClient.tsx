'use client';

import { useStore } from '@/contexts/StoreContext';
import type { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import type { FullPriceConfig } from '@/types/priceConfig';
import { CheckCircle, ChevronDown, Gift, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Fukuoka components
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';

// Yokohama components
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';

interface PricePageClientProps {
  priceConfig: FullPriceConfig;
  config: StoreTopPageConfig | null;
}

const BASIC_SERVICES = [
  'カウンセリング',
  '指圧マッサージ',
  'パウダー性感',
  '乳首舐め',
  'クンニ',
  '指入れ',
  'Gスポット',
  'ポルチオ',
];

const FREE_OPTIONS = ['キス', 'ハグ', 'フェラ', '手コキ', 'ボディータッチ', 'ローター', 'バイブ'];

export default function PricePageClient({ priceConfig, config }: PricePageClientProps) {
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState<'COURSES' | 'TRANSPORT' | 'OPTIONS' | 'DISCOUNTS'>(
    'COURSES',
  );

  const tabs = [
    { id: 'COURSES' as const, label: 'コース' },
    { id: 'TRANSPORT' as const, label: '送迎' },
    { id: 'OPTIONS' as const, label: 'オプション' },
    { id: 'DISCOUNTS' as const, label: '割引' },
  ];

  return (
    <div className="bg-strawberry-dots min-h-screen bg-[#fffaf0] selection:bg-rose-200 selection:text-rose-900">
      {store.template === 'fukuoka' ? (
        <FukuokaHeader config={config?.header} />
      ) : store.template === 'yokohama' ? (
        <YokohamaHeader config={config?.header} />
      ) : null}

      <div className="pt-24 md:pt-32">
        {/* Decorative Top Leaf */}
        <div className="absolute left-1/2 top-0 h-16 w-32 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-2xl" />

        {/* Main Content Container */}
        <main className="mx-auto max-w-4xl px-4 pt-8">
          {/* Hero Image */}
          {priceConfig.hero_image_url && (
            <div className="mb-12 overflow-hidden rounded-[2rem] shadow-2xl duration-700 animate-in fade-in">
              <Image
                src={priceConfig.hero_image_url}
                alt="料金ページ"
                width={1200}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Tab Navigation */}
          <nav className="mb-12">
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
            {/* コースタブ */}
            {activeTab === 'COURSES' && (
              <div className="space-y-4">
                {priceConfig.courses.map((course, idx) => (
                  <CourseAccordion key={course.id} course={course} defaultOpen={idx === 0} />
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

            {/* 送迎タブ */}
            {activeTab === 'TRANSPORT' && (
              <div className="space-y-8">
                <div className="mb-10 text-center">
                  <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                    送迎エリア・料金
                  </h2>
                  <p className="text-sm text-rose-400">ご指定の場所までセラピストが伺います。</p>
                </div>
                <div className="space-y-3">
                  {priceConfig.transport_areas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50"
                    >
                      <div>
                        <p className="text-sm font-bold text-rose-900 md:text-base">{area.area}</p>
                        {area.note && <p className="mt-1 text-xs text-rose-400">{area.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-rose-300">
                          {area.label}
                        </p>
                        <p className="text-xl font-black text-rose-500">
                          {area.price ? `¥${area.price.toLocaleString()}` : '応相談'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* オプションタブ */}
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* 基本サービス */}
                  <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50 md:p-8">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                        <CheckCircle size={20} />
                      </div>
                      <h3 className="font-rounded text-lg font-bold text-rose-900">基本サービス</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {BASIC_SERVICES.map((service) => (
                        <div
                          key={service}
                          className="rounded-xl border border-rose-50 bg-rose-50/30 px-3 py-2 text-center text-[11px] font-bold text-rose-600 sm:text-xs"
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 無料オプション */}
                  <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50 md:p-8">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                        <Gift size={20} />
                      </div>
                      <h3 className="font-rounded text-lg font-bold text-rose-900">
                        無料オプション
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {FREE_OPTIONS.map((option) => (
                        <div
                          key={option}
                          className="rounded-xl border border-rose-50 bg-rose-50/30 px-3 py-2 text-center text-[11px] font-bold text-rose-600 sm:text-xs"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="mb-6 flex items-center gap-3 px-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                      <Star size={20} />
                    </div>
                    <h3 className="font-rounded text-lg font-bold text-rose-900">有料オプション</h3>
                  </div>
                  {priceConfig.options.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-rounded text-lg font-bold text-rose-900">
                          {option.name}
                        </h3>
                        <p className="text-xl font-black text-rose-500">
                          {option.price >= 0 ? '+' : ''}¥{option.price.toLocaleString()}
                        </p>
                      </div>
                      {option.description && (
                        <p className="text-sm text-rose-600">{option.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 割引タブ */}
            {activeTab === 'DISCOUNTS' && (
              <div className="space-y-6">
                <p className="px-2 text-right text-[10px] text-rose-300">
                  ※各キャンペーンの詳細はキャンペーンルールをご確認ください。
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {priceConfig.campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50"
                    >
                      {campaign.image_url && (
                        <div className="relative h-48">
                          <Image
                            src={campaign.image_url}
                            alt={campaign.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                            {campaign.accent_text}
                          </span>
                          {campaign.price_info && (
                            <span className="text-lg font-black text-rose-500">
                              {campaign.price_info}
                            </span>
                          )}
                        </div>
                        <h3 className="font-rounded mb-2 text-lg font-bold text-rose-900">
                          {campaign.title}
                        </h3>
                        {campaign.description && (
                          <p className="text-sm text-rose-600">{campaign.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQセクション */}
            {priceConfig.faqs && priceConfig.faqs.length > 0 && (
              <div className="mt-16 space-y-6">
                <div className="text-center">
                  <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                    よくある質問
                    <span className="mt-2 block text-sm font-normal tracking-widest text-rose-400">
                      FAQ
                    </span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {(priceConfig.faqs as any[]).map((faq: any, index: number) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            )}

            {/* ご変更・キャンセルについて (新規追加) */}
            <div className="mt-16 space-y-8">
              <div className="text-center">
                <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                  ご変更、キャンセルについて
                  <span className="mt-2 block text-sm font-normal tracking-widest text-rose-400">
                    CANCELLATION POLICY
                  </span>
                </h2>
              </div>

              <div className="space-y-6 rounded-[2rem] border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50 md:p-8">
                <div>
                  <h3 className="mb-4 text-base font-bold text-rose-900 md:text-lg">
                    【東京23区内の場合】
                  </h3>
                  <div className="mb-4 text-sm leading-relaxed text-rose-700">
                    <p className="mb-2">
                      東京23区内の場合、下記の場合はキャンセル料金が発生します。
                    </p>
                    <p className="font-bold text-rose-800">
                      ご変更やキャンセルは分かり次第、必ずお電話にてご連絡してください。
                    </p>
                  </div>
                  <div className="space-y-3 rounded-xl bg-rose-50 p-4">
                    <div className="flex flex-col justify-between gap-1 border-b border-rose-200/50 pb-2 text-sm sm:flex-row sm:items-center">
                      <span className="text-rose-800">ご予約後~当日指定時刻の5時間前まで</span>
                      <span className="shrink-0 font-bold text-rose-900">無料</span>
                    </div>
                    <div className="flex flex-col justify-between gap-1 border-b border-rose-200/50 pb-2 text-sm sm:flex-row sm:items-center">
                      <span className="text-rose-800">5時間前 ~指定時刻まで</span>
                      <span className="shrink-0 font-bold text-rose-900">施術料の半額</span>
                    </div>
                    <div className="flex flex-col justify-between gap-1 text-sm sm:flex-row sm:items-center">
                      <span className="text-rose-800">指定時刻になっても連絡なしの場合</span>
                      <span className="shrink-0 font-bold text-rose-900">施術料の全額</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-base font-bold text-rose-900 md:text-lg">
                    【東京23区外の場合】
                  </h3>
                  <p className="text-sm leading-relaxed text-rose-700">
                    東京23区以外の場合、上記の規定と異なりますのでご注意ください。遠方になるほど、キャンセル料の発生時刻が繰り上がります。ご予約時に確認をお願い致します。
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm leading-relaxed text-emerald-900">
                    ご利用日を変更(延期)される場合は、当日指定時刻の3時間前までにお電話いただければキャンセル料はかかりません。
                  </p>
                </div>
              </div>
            </div>

            {/* 禁止事項セクション (常時表示) */}
            <div className="mt-16 space-y-8 pb-10">
              <div className="mb-10 text-center">
                <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                  禁止事項について
                  <span className="mt-2 block text-sm font-normal tracking-widest text-rose-400">
                    PROHIBITIONS
                  </span>
                </h2>
              </div>

              <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50 md:p-10">
                <ul className="space-y-4">
                  {(priceConfig.prohibitions && priceConfig.prohibitions.length > 0
                    ? (priceConfig.prohibitions as string[])
                    : [
                        '本番行為の強要・要求またはそれに付帯する行為をされる方',
                        '18歳未満の方、高校生の方、妊娠中の方のご利用',
                        'シャワーやうがいを拒否する方の利用',
                        '乱暴な扱いをされる方、セラピストが怖がるような暴言を吐かれる方の利用',
                        '泥酔状態の方',
                        'アロマオイル、ローションなど施術で使用したものによる皮膚の被れ等の責任は負いかねます',
                        'お客様の持ち物の紛失などのトラブルは責任を負いかねます（貴重品などは、ご自身で管理お願い致します）',
                        '性病の方もしくはその疑いのある方',
                        'カメラやレコーダなどの機器で撮影・録音・盗聴される方',
                        'その他当店が不適切と判断した方',
                        'キャストと店を通さずに会う行為またはそれを促す発言',
                      ]
                  ).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      <span className="text-sm font-medium leading-relaxed text-rose-800 md:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 rounded-xl bg-rose-50 p-6 text-center text-xs leading-relaxed text-rose-600 md:text-sm">
                  <p className="font-bold">
                    ※禁止事項を必ず読んで頂き、ご理解を頂いてからのご利用をお願い致します。
                  </p>
                  <p className="mt-2">
                    上記によるサービス中断の返金には一切応じられません。
                    <br className="hidden md:inline" />
                    マナーよくご利用頂けますよう重ねてお願い申し上げます。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* キャンセルポリシーセクション */}
          {priceConfig.cancellation_policy && (
            <div className="mt-16 space-y-6">
              <div className="text-center">
                <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                  ご変更・キャンセルについて
                  <span className="mt-2 block text-sm font-normal tracking-widest text-rose-400">
                    CANCELLATION POLICY
                  </span>
                </h2>
              </div>

              <div className="space-y-6 rounded-[2rem] border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50 md:p-8">
                {/* 東京23区内 */}
                {(priceConfig.cancellation_policy as any).tokyo23ku && (
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-rose-900">
                      {(priceConfig.cancellation_policy as any).tokyo23ku.title}
                    </h3>
                    <div className="space-y-2">
                      {(priceConfig.cancellation_policy as any).tokyo23ku.rules.map(
                        (rule: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start justify-between gap-4 border-b border-rose-100 pb-2 last:border-0"
                          >
                            <span className="text-sm text-rose-700">{rule.period}</span>
                            <span className="shrink-0 text-sm font-bold text-rose-900">
                              {rule.fee}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* 東京23区外 */}
                {(priceConfig.cancellation_policy as any).outside23ku && (
                  <div className="rounded-xl bg-rose-50 p-4">
                    <h3 className="mb-2 text-base font-bold text-rose-900">
                      {(priceConfig.cancellation_policy as any).outside23ku.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-rose-700">
                      {(priceConfig.cancellation_policy as any).outside23ku.description}
                    </p>
                  </div>
                )}

                {/* 変更（延期）について */}
                {(priceConfig.cancellation_policy as any).reschedule && (
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-sm leading-relaxed text-emerald-900">
                      {(priceConfig.cancellation_policy as any).reschedule}
                    </p>
                  </div>
                )}

                <div className="mt-4 text-center text-xs text-rose-400">
                  ご変更やキャンセルは分かり次第、必ずお電話にてご連絡してください。
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="pb-32 md:pb-16">
        {store.template === 'fukuoka' ? (
          <>
            <FukuokaFooter config={config?.footer} />
            <FukuokaMobileStickyButton />
          </>
        ) : store.template === 'yokohama' ? (
          <>
            <YokohamaFooter config={config?.footer} />
            <YokohamaMobileStickyButton />
          </>
        ) : null}
      </div>
    </div>
  );
}

// コースアコーディオンコンポーネント
function CourseAccordion({
  course,
  defaultOpen = false,
}: {
  course: FullPriceConfig['courses'][0];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50 transition-all duration-300">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-5 border-b border-rose-50 bg-gradient-to-br from-rose-50 to-white p-6 transition-all hover:from-rose-100 hover:to-rose-50 md:p-8"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-3xl">
          {course.icon && (course.icon.startsWith('http') || course.icon.startsWith('/')) ? (
            <img src={course.icon} alt="" className="h-full w-full object-cover" />
          ) : (
            course.icon || '🍓'
          )}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-rounded text-xl font-bold leading-tight text-rose-900 md:text-2xl">
            {course.name}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-rose-400 md:text-sm">
            {course.description}
          </p>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-rose-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-8 p-6 md:p-8">
          {/* Time & Price List */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-400"></div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                Time & Price
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-x-6">
              {course.plans?.map((plan, idx) => (
                <div
                  key={plan.id}
                  className="group relative flex items-center justify-between gap-2 border-b border-dotted border-rose-100/50 py-3 transition-all"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="inline-block shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 sm:px-3 sm:py-1 sm:text-xs">
                      {plan.minutes >= 600
                        ? `${plan.minutes / 60}時間`
                        : plan.minutes === 0
                          ? 'FREE'
                          : `${plan.minutes}min`}
                    </span>
                    {plan.discount_info && (
                      <div className="flex items-center gap-1">
                        <span className="shrink-0 rounded bg-rose-500 px-1 text-[7px] font-bold text-white sm:text-[8px]">
                          HOT
                        </span>
                        <span className="min-w-0 truncate text-[8px] font-bold text-rose-500 sm:text-[9px]">
                          {plan.discount_info}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 text-base font-black text-rose-900 sm:text-lg">
                    ¥{plan.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100/50 bg-orange-50/30 p-5">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-orange-400">
                延長料金
              </p>
              <p className="text-sm font-bold text-orange-900 md:text-base">
                30分 /{' '}
                <span className="text-rose-500">
                  ¥{course.extension_per_30min.toLocaleString()}
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100/50 bg-emerald-50/30 p-5">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                指名料
              </p>
              <div className="space-y-1 text-xs font-bold text-emerald-900 md:text-sm">
                <div className="flex justify-between">
                  <span>本指名:</span>
                  <span className="text-rose-500">
                    ¥{course.designation_fee_first.toLocaleString()}
                  </span>
                </div>
                {course.designation_fee_note && (
                  <div className="flex items-start justify-between">
                    <span className="shrink-0">備考:</span>
                    <span className="text-right text-[9px] font-medium leading-tight text-emerald-600/70 md:text-[10px]">
                      {course.designation_fee_note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {course.notes && (
            <div className="rounded-2xl border border-rose-100/50 bg-rose-50/50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs">📝</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  Course Notes
                </p>
              </div>
              <p className="whitespace-pre-wrap text-[11px] font-medium leading-relaxed text-rose-800 md:text-xs">
                {course.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FAQアコーディオンアイテムコンポーネント
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-rose-50/50 md:p-8"
      >
        <h3 className="flex items-start gap-3 text-base font-bold text-rose-900 md:text-lg">
          <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
            Q
          </span>
          {question}
        </h3>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-rose-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-rose-50 px-6 pb-6 pt-0 md:px-8 md:pb-8">
          <div className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-rose-700 md:text-base">
            <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-500">
              A
            </span>
            <span>{answer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
