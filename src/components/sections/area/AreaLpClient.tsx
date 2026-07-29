'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Hotel, Sparkles, Clock, CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';
import CastCard from '@/components/sections/casts/casts/CastCard';
import { Cast } from '@/types/cast';

export interface AreaDetailInfo {
  slug: string;
  areaSlug: string;
  name: string;
  cityName: string;
  description: string;
  features: string[];
  recommendedHotels: string[];
  faqs: { question: string; answer: string }[];
  /**
   * このエリアの商圏を構成する町名（住所の部分一致に使う）。
   * lh_areas の紐付けは「中央区」に191件が雑に振られている等、実態と
   * 乖離しているため使わない。行政区ではなく商圏で定義することで、
   * 郊外のホテルが主要エリアのLPに混入するのを防ぐ。
   */
  districtKeywords?: string[];
}

interface AreaLpClientProps {
  areaInfo: AreaDetailInfo;
  casts: Cast[];
  storeSlug: string;
  hotels?: any[];
}

/**
 * ホテルカードの表示可否を判定する品質ゲート。
 *
 * lh_hotels は大半が未整備（実写真なし・エリア紐付けの誤り・下書き）のため、
 * 基準を満たしたものだけを表示する。基準を満たさないホテルは出さない。
 * データが整うにつれて自動的に表示件数が増える想定。
 */
/** 住所表記のゆれを吸収する（「日本、」「〒812-0038」「全角空白」など） */
function normalizeAddress(address: string): string {
  return (address || '')
    .replace(/^日本、?/, '')
    .replace(/〒\s*\d{3}-?\d{4}/, '')
    .replace(/[\s　]/g, '');
}

/**
 * 重複判定用に住所を数値レベルまで正規化する。
 * 同一ホテルが「春吉3-16-34」と「春吉３丁目１６−３４」の2レコードで
 * 登録されているため、全角・丁目・各種ハイフンを吸収する。
 */
function addressKey(address: string): string {
  return normalizeAddress(address)
    // 「福岡県福岡市…」と「福岡市…」が別レコードで登録されているため県名を落とす
    .replace(/^.{2,4}?[都道府県]/, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[丁目番地号]/g, '-')
    .replace(/[−ー―‐‑–—]/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '');
}

function isPublishableHotel(hotel: any, area: AreaDetailInfo): boolean {
  // ① 実写真があること（ストック写真での代替はしない）
  const realImage = hotel?.imageUrl || hotel?.images?.[0]?.url || hotel?.images?.[0];
  if (!realImage) return false;

  // ② 住所があること
  if (!hotel?.address) return false;

  // ③ 商圏（町名）に含まれること
  //    「博多」を住所の部分一致で見ると博多区全域（井相田・西月隈など空港側の
  //    郊外まで）に広がってしまうため、町名単位で判定する。
  const keywords = area.districtKeywords ?? [];
  if (keywords.length === 0) return false; // 商圏が未定義のエリアは出さない
  const addr = normalizeAddress(hotel.address);
  return keywords.some((k) => addr.includes(k));
}

/**
 * 同一ホテルの二重登録があるため重複を除去する。
 * 店名の表記ゆれ（「【HAYAMA HOTELS】」等の付記）があるので、
 * 正規化した住所が一致すれば同一ホテルとみなす。
 */
function dedupeHotels(list: any[]): any[] {
  const seen = new Set<string>();
  return list.filter((h) => {
    const key = addressKey(h?.address ?? '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** これ未満なら「おすすめ」として成立しないためセクションごと出さない */
const MIN_HOTELS_TO_SHOW = 3;

export default function AreaLpClient({ areaInfo, casts, storeSlug, hotels = [] }: AreaLpClientProps) {
  // 基準を満たすホテルだけに絞り込む
  const publishableHotels = dedupeHotels((hotels || []).filter((h) => isPublishableHotel(h, areaInfo)));
  const showHotelCards = publishableHotels.length >= MIN_HOTELS_TO_SHOW;

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-800">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 pt-28 pb-16 text-white sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider text-rose-200 backdrop-blur-md mb-4 border border-white/20">
            {areaInfo.cityName}エリア出張対応拠点
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl tracking-tight text-white mb-6 leading-tight">
            {areaInfo.name}の女性用風俗・女風<br />
            <span className="bg-gradient-to-r from-rose-200 via-pink-100 to-white bg-clip-text text-transparent">
              ストロベリーボーイズ{areaInfo.cityName}店
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-rose-100/90 font-medium mb-8 leading-relaxed">
            {areaInfo.name}のご指定ホテル・ご自宅へ、厳選された人気イケメンセラピストを派遣。<br className="hidden sm:inline" />
            完全個室・秘密厳守・安心の明朗会計で極上の癒やしをお届けいたします。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link
              href={`/store/${storeSlug}/reservation`}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-rose-950/30 transition-all hover:scale-105 hover:from-rose-600 hover:to-pink-600"
            >
              <Sparkles className="h-5 w-5" />
              <span>{areaInfo.name}でWeb予約する</span>
            </Link>
            <Link
              href={`/store/${storeSlug}/cast-list`}
              className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white border border-white/30 backdrop-blur-md transition-all hover:bg-white/20"
            >
              <span>出勤セラピストを見る</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 特長セクション */}
      <section className="py-12 bg-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {areaInfo.name}出張サービスの3つの安心ポイント
            </h2>
            <p className="text-sm text-gray-500 mt-2">初めての方も安心してご利用いただけます</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <Hotel className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{areaInfo.name}ホテル・自宅へ即対応</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {areaInfo.name}周辺のラブホテル・ビジネスホテル・ご自宅へセラピストが直接お伺いします。
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">完全明朗会計・追加料金なし</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                表示料金と出張交通費以外、不当な追加費用は一切かかりません。当日現金・各種決済対応。
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">当日予約・24時間受付対応</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                「今すぐ癒やされたい」当日急なご予約も大歓迎。LINE・Web予約からスピーディーにご案内。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* エリア対応キャスト一覧 */}
      {casts && casts.length > 0 && (
        <section className="py-12 bg-slate-50 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">THERAPISTS</span>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mt-1">
                  {areaInfo.name}対応のセラピスト一覧
                </h2>
              </div>
              <Link
                href={`/store/${storeSlug}/cast-list`}
                className="mt-4 sm:mt-0 text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                全員を見る <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {casts.slice(0, 8).map((cast, index) => (
                <CastCard
                  key={cast.id}
                  cast={cast}
                  index={index}
                  storeSlug={storeSlug}
                  isFavorite={false}
                  onCastSelect={() => {}}
                  onToggleFavorite={() => {}}
                  sortBy="default"
                  currentlyPlayingId={null}
                  setCurrentlyPlayingId={() => {}}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* おすすめ出張エリア・ホテル案内 */}
      <section className="py-12 bg-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">DISPATCH AREA GUIDE</span>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mt-1">
              {showHotelCards
                ? `${areaInfo.name}エリアで女性用風俗・女風セラピストを呼べるおすすめホテル`
                : `${areaInfo.name}エリアの出張対応について`}
            </h2>
            <p className="text-xs text-gray-500 mt-2 max-w-xl mx-auto">
              {showHotelCards
                ? `ストロベリーボーイズ${areaInfo.cityName}店のご指定出張先として人気のおすすめホテル一覧です。お気に入りのセラピストと特別な時間をお楽しみいただけます。`
                : `ストロベリーボーイズ${areaInfo.cityName}店が${areaInfo.name}エリアで出張対応している場所をご案内します。`}
            </p>
          </div>

          {/* DB連動ホテルカード (品質ゲートを通過したものだけ / 6件限定軽量化) */}
          {showHotelCards ? (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {publishableHotels.slice(0, 6).map((hotel: any, idx: number) => {
                // DB内のリアルデータ（amenities / distanceFromStation / services）を最優先利用
                const realTags: string[] = [];
                if (hotel.distanceFromStation) realTags.push(`＃${hotel.distanceFromStation}`);
                if (hotel.amenities && hotel.amenities.length > 0) {
                  hotel.amenities.slice(0, 2).forEach((a: string) => realTags.push(`＃${a}`));
                }
                if (hotel.services && hotel.services.length > 0 && realTags.length < 3) {
                  hotel.services.slice(0, 2).forEach((s: string) => realTags.push(`＃${s}`));
                }
                // データ不足時のフォールバックタグ
                const fallbackPatterns = [
                  ['＃女性利用多数', '＃完全個室', '＃風俗利用可'],
                  ['＃駅近く', '＃きれいめ客室', '＃秘密厳守'],
                  ['＃静音プライベート', '＃ラグジュアリー', '＃出張対応可'],
                ];
                const displayTags =
                  realTags.length > 0
                    ? realTags
                    : fallbackPatterns[idx % fallbackPatterns.length];

                // リアル評価バッジまたは出張安心バッジ
                const badgeText = hotel.rating && hotel.rating > 0
                  ? `★ ${hotel.rating.toFixed(1)} 高評価`
                  : hotel.distanceFromStation || '女性安心・個室';

                return (
                  <div
                    key={hotel.id || idx}
                    className="w-[82vw] shrink-0 snap-center rounded-2xl border border-rose-100 bg-white p-4 shadow-sm hover:border-rose-300 md:w-auto md:shrink"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 mb-3">
                      <img
                        // 実写真のみ。isPublishableHotel で画像なしは除外済みのため
                        // ストック写真によるフォールバックは行わない
                        src={hotel.imageUrl || hotel.images?.[0]?.url || hotel.images?.[0]}
                        alt={`${hotel.name} - ${areaInfo.name}女性用風俗・女風対応ホテル`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        {badgeText}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{hotel.name}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">
                      {hotel.address || `${areaInfo.cityName}${areaInfo.name}周辺`}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {displayTags.map((t: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            tIdx === 0
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /*
             * 基準を満たすホテルが揃うまでの表示。
             * 個別ホテルを「おすすめ」と称すると実態と乖離するため、
             * 事実として案内できる「対応可能な施設タイプ」のみを掲載する。
             */
            <div className="mx-auto max-w-3xl">
              <p className="text-sm text-gray-600 leading-relaxed mb-6 text-center">
                {areaInfo.description}
              </p>

              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Hotel className="h-4 w-4 text-rose-400 shrink-0" />
                {areaInfo.name}エリアで出張対応している場所
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {areaInfo.recommendedHotels.map((place, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-white p-4 text-xs font-bold text-gray-700 shadow-sm border border-rose-100">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>{place}</span>
                    <span className="ml-auto text-[10px] text-rose-500 font-normal shrink-0">出張可</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed text-center">
                ご利用予定の施設が対応可能かご不明な場合は、ご予約時にお気軽にお問い合わせください。
                施設ごとの詳しいご案内は、セラピストが実際に伺った内容をもとに順次掲載してまいります。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* エリア特化FAQ (最下部パディング pb-28 で追従予約ボタン被り回避) */}
      <section className="py-12 bg-slate-50 pb-28 sm:py-16 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {areaInfo.name}利用についてのよくある質問
            </h2>
          </div>

          <div className="space-y-4">
            {areaInfo.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-rose-500 font-extrabold">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
