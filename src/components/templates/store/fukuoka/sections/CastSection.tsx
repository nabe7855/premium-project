import { fetchDailyCasts } from '@/actions/cast';
import { TodayCast } from '@/lib/getTodayCastsByStore';
import { CastConfig, CastItem } from '@/lib/store/storeTopConfig';
import { getTransformedImageUrl } from '@/lib/image-url';
import { ArrowUpDown, RotateCcw, Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import SectionTitle from '../components/SectionTitle';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface CastSectionProps {
  config?: CastConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
  storeSlug?: string;
  todayCasts?: TodayCast[];
}

const CastSection: React.FC<CastSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload: _onImageUpload,
  storeSlug = 'fukuoka',
  todayCasts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD

  // 初期データのマッピング
  const initialCasts = useMemo(() => {
    if (!todayCasts) return [];
    return todayCasts.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      age: c.age || 0,
      height: c.height || 0,
      weight: c.weight || 0,
      comment: c.catch_copy || '',
      status: '本日出勤',
      tags: c.tags || [],
      imageUrl:
        c.main_image_url ||
        c.image_url ||
        '/cast-default.jpg',
      mbtiType: c.mbti_name,
      faceType: c.face_name ? [c.face_name] : [],
      rating: c.rating,
      reviewCount: c.review_count,
      sexinessStrawberry: c.sexiness_strawberry,
      sexinessLevel: c.sexiness_level ?? 100,
      attendance: c.start_datetime && c.end_datetime 
        ? `${new Date(c.start_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}〜${new Date(c.end_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}`
        : 'お問い合わせください',
      schedule: [], 
      isIchioshi: c.isIchioshi,
      ichioshiPoint: c.ichioshiPoint || config?.items?.find(item => item.id === c.id)?.ichioshiPoint,
      ichioshiRank: c.ichioshiRank || config?.items?.find(item => item.id === c.id)?.ichioshiRank || 1,
    }));
  }, [todayCasts, config]);

  const [fetchedCasts, setFetchedCasts] = useState<CastItem[]>(initialCasts);
  const [isLoading, setIsLoading] = useState(!todayCasts);
  const [sortKey, setSortKey] = useState<
    'default' | 'age-asc' | 'age-desc' | 'height-asc' | 'height-desc' | 'new' | 'review-count'
  >('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedMbtis, setSelectedMbtis] = useState<string[]>([]);
  const [selectedStrawberryTypes, setSelectedStrawberryTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // アコーディオンのトグル
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // 今日から10日分の日付を生成
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    // JST補正はクライアントサイドではブラウザのタイムゾーン依存になるため、
    // 厳密にはサーバーサイドで計算するか、UTC変換が必要だが、ここでは簡易的にJSのDateを使用
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayName = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
      arr.push({ date: dateStr, display: `${mm}/${dd}`, day: dayName, isToday: i === 0 });
    }
    return arr;
  }, []);

  // 初期選択を本日に設定
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  // 日付変更時にデータフェッチ
  useEffect(() => {
    const loadCasts = async () => {
      if (!selectedDate) return;

      // すでにサーバーサイドで取得済みの今日の日付なら、初回フェッチをスキップ
      if (selectedDate === dates[0].date && todayCasts && todayCasts.length > 0) {
        setFetchedCasts(initialCasts);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchDailyCasts(storeSlug, selectedDate);

        // TodayCast -> CastItem 変換
        const mappedCasts: CastItem[] = data.map((c: TodayCast) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          age: c.age || 0,
          height: c.height || 0,
          weight: c.weight || 0,
          comment: c.catch_copy || '',
          status: '本日出勤',
          tags: c.tags || [],
          imageUrl:
            c.main_image_url ||
            c.image_url ||
            '/cast-default.jpg',
          mbtiType: c.mbti_name,
          faceType: c.face_name ? [c.face_name] : [],
          rating: c.rating,
          reviewCount: c.review_count,
          sexinessStrawberry: c.sexiness_strawberry,
          sexinessLevel: c.sexiness_level || 100,
          attendance: c.start_datetime && c.end_datetime 
            ? `${new Date(c.start_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}〜${new Date(c.end_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}`
            : 'お問い合わせください',
          schedule: [selectedDate],
          isIchioshi: c.isIchioshi,
          ichioshiPoint: config?.items?.find(item => item.id === c.id)?.ichioshiPoint,
          ichioshiRank: config?.items?.find(item => item.id === c.id)?.ichioshiRank || 1,
        }));
        setFetchedCasts(mappedCasts);
      } catch (e) {
        console.error('Failed to load casts', e);
        setFetchedCasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCasts();
  }, [selectedDate, storeSlug, dates, todayCasts, initialCasts]);

  // 表示するリスト：データフェッチが完了していればそれを、なければConfigの初期値（SSG/SSR時点のもの）を使用...
  // としたいが、日付切り替えに対応するため、基本は fetchedCasts を使う。
  // 初回レンダリング時などで fetchedCasts が空の間だけ config.items を使う手もあるが、
  // 整合性を保つため fetchedCasts をメインにする。ただし、初期表示のチラつき防止で config.items を利用可能。
  const displayCasts = fetchedCasts.length > 0 ? fetchedCasts : isLoading ? [] : [];

  // フィルタリング & ソートロジック
  const filteredCasts = useMemo(() => {
    let result = [...displayCasts];

    // 日付フィルターは fetch 段階で行っているので、ここでは不要（念のため schedule チェックはしても良いが省略）

    // 名前検索
    if (searchTerm) {
      result = result.filter((cast) => 
        cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cast.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // MBTIフィルター
    if (selectedMbtis.length > 0) {
      result = result.filter(cast => cast.mbtiType && selectedMbtis.includes(cast.mbtiType));
    }

    // イチゴ系タイプフィルター
    if (selectedStrawberryTypes.length > 0) {
      result = result.filter(cast => cast.sexinessStrawberry && selectedStrawberryTypes.includes(cast.sexinessStrawberry));
    }

    // タグフィルター
    if (selectedTags.length > 0) {
      result = result.filter(cast => cast.tags.some(tag => selectedTags.includes(tag)));
    }

    // ソート
    switch (sortKey) {
      case 'age-asc':
        result.sort((a, b) => a.age - b.age);
        break;
      case 'age-desc':
        result.sort((a, b) => b.age - a.age);
        break;
      case 'height-asc':
        result.sort((a, b) => a.height - b.height);
        break;
      case 'height-desc':
        result.sort((a, b) => b.height - a.height);
        break;
      case 'new':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'review-count':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        // おすすめ順（デフォルト）: イチ押しを優先しつつ元の順序
        result.sort((a, b) => {
           if (a.isIchioshi && !b.isIchioshi) return -1;
           if (!a.isIchioshi && b.isIchioshi) return 1;
           return 0;
        });
        break;
    }

    return result;
  }, [displayCasts, searchTerm, sortKey, selectedMbtis, selectedStrawberryTypes, selectedTags]);

  // 「イチ押し」セラピストの抽出 ＆ ランクに基づいた重み付けランダムソート
  const ichioshiCasts = useMemo(() => {
    // 1. イチ押しのみ抽出
    const basicList = displayCasts.filter(c => c.isIchioshi);
    
    // 2. 重み付けランダムソート
    // ランク(1-5) を重みとして使用。未設定は ランク1
    return [...basicList].sort((a, b) => {
      const weightA = (a.ichioshiRank || 1) * Math.random();
      const weightB = (b.ichioshiRank || 1) * Math.random();
      return weightB - weightA; // 高い（重い）方が前
    });
  }, [displayCasts]);

  // Embla Carousel 設定
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const resetFilters = () => {
    setSearchTerm('');
    if (dates.length > 0) setSelectedDate(dates[0].date);
    setSortKey('default');
    setSelectedMbtis([]);
    setSelectedStrawberryTypes([]);
    setSelectedTags([]);
  };

  return (
    <section id="cast" className="relative overflow-hidden bg-[#FFF9FA] py-16 md:py-24">
      {/* 背景装飾 */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-rose-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          en={config?.subHeading || 'Strawberry Selection'}
          ja={config?.heading || '本日出勤のセラピスト'}
          imageUrl={config?.headingImageUrl}
          isEditing={isEditing}
          onUpdateEn={(val) => onUpdate?.('cast', 'subHeading', val)}
          onUpdateJa={(val) => onUpdate?.('cast', 'heading', val)}
          onImageUpload={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file && _onImageUpload) _onImageUpload('cast', file, 0, 'headingImageUrl');
            };
            input.click();
          }}
        />

        {isEditing && (
          <div className="mb-8 rounded-3xl border border-rose-100 bg-rose-50/50 p-4 text-center text-[10px] font-bold text-rose-400 backdrop-blur-sm">
            ※ キャスト情報の管理はダッシュボードから行えます
          </div>
        )}

        {/* 🆕 イチ押しセラピスト・ループセクション */}
        {!isLoading && ichioshiCasts.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-rose-500" />
                <h3 className="text-lg font-black tracking-widest text-slate-800">SPECIAL PICK UP</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-400 shadow-sm transition-all hover:bg-rose-500 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-400 shadow-sm transition-all hover:bg-rose-500 hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6">
                {ichioshiCasts.map((cast) => (
                  <div key={`ichioshi-${cast.id}`} className="relative min-w-[240px] flex-[0_0_240px] md:min-w-[300px] md:flex-[0_0_300px]">
                    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft transition-all duration-500 hover:shadow-luxury">
                      {/* カード全体を覆うリンク */}
                      <Link
                        href={`/store/${storeSlug}/cast/${cast.slug || cast.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={`${cast.name}の詳細を見る`}
                      />
                      
                      {/* 表示用コンテンツ */}
                      <div className="relative h-full w-full">
                        {/* 画像エリア - 既存デザイン流用 */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <NextImage
                            src={cast.imageUrl}
                            alt={cast.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 240px, 300px"
                          />
                          <div className="pointer-events-none absolute left-2 top-2">
                            <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                              <Star className="h-2.5 w-2.5 fill-current" /> 店長一押し
                            </span>
                          </div>
                   
                          <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-rose-400">
                              <div className="ml-0.5 h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-rose-400 border-t-transparent" />
                            </div>
                          </div>
                        </div>

                        {/* コンテンツエリア - 既存デザイン流用 */}
                        <div className="flex flex-col p-4 text-left">
                          <div className="mb-2 flex items-end justify-between">
                            <h3 className="truncate text-base font-black text-slate-800">
                              {cast.name}
                            </h3>
                            <span className="ml-2 flex-shrink-0 text-sm font-bold text-slate-500">
                              {cast.age}歳
                            </span>
                          </div>
                          <div className="mt-2 border-t border-rose-50 pt-3">
                            <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-50/70 py-2.5">
                              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                              <span className="text-[10px] font-black tracking-widest text-orange-600">
                                {cast.attendance}
                              </span>
                            </div>
                            {cast.ichioshiPoint && (
                              <p className="mt-3 line-clamp-2 px-1 text-center text-[10px] font-bold italic leading-relaxed text-rose-400">
                                &ldquo; {cast.ichioshiPoint} &rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 検索・フィルターエリア (リファクタリング版) */}
        <div className="mb-12 space-y-6">
          {/* 1. 名前検索 */}
          <div className="relative group">
            <input
              type="text"
              placeholder="キャスト名やキャッチフレーズで検索..."
              value={searchTerm}
              aria-label="検索"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border-2 border-rose-50 bg-white py-4 pl-14 pr-6 text-sm font-bold text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-rose-200 focus:ring-4 focus:ring-rose-100/20"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-rose-300 transition-colors group-focus-within:text-rose-500" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-300 hover:text-rose-400"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 2. 並び替え (タブ風UI) */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> 並び替え:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'default', label: 'おすすめ順', icon: Star },
                { id: 'review-count', label: '口コミ数順', icon: ArrowUpDown },
                { id: 'new', label: '新着順', icon: ArrowUpDown },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSortKey(item.id as any)}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-black transition-all duration-300 ${
                    sortKey === item.id
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                      : 'bg-white text-slate-500 border border-rose-50 hover:bg-rose-50'
                  }`}
                >
                  {item.id === 'default' && <item.icon className={`h-3 w-3 ${sortKey === item.id ? 'fill-current' : ''}`} />}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. こだわり検索ボタン */}
          <div className="pt-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex w-full items-center justify-center gap-3 rounded-full border-2 py-4 text-sm font-black transition-all duration-500 ${
                isFilterOpen
                  ? 'border-rose-500 bg-rose-500 text-white shadow-lg'
                  : 'border-rose-100 bg-white text-slate-700 shadow-sm hover:border-rose-300 hover:shadow-md'
              }`}
            >
               <span className="flex items-center gap-2">
                 <div className="flex flex-col gap-0.5">
                   <div className={`h-0.5 w-4 bg-current transition-all ${isFilterOpen ? 'rotate-45 translate-y-1' : ''}`} />
                   <div className={`h-0.5 w-4 bg-current transition-all ${isFilterOpen ? 'opacity-0' : ''}`} />
                   <div className={`h-0.5 w-4 bg-current transition-all ${isFilterOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                 </div>
                 {isFilterOpen ? 'こだわり検索をしまう' : 'こだわり検索で探す'}
               </span>
            </button>
          </div>

          {/* 4. こだわり検索一覧 (アコーディオン) */}
          {isFilterOpen && (
            <div className="mt-4 rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="flex items-center justify-between mb-6">
                 <h4 className="flex items-center gap-2 font-black text-slate-800">
                   <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                   こだわり検索
                 </h4>
                 <button 
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                 >
                   <RotateCcw className="h-3 w-3" /> 条件をリセット
                 </button>
               </div>

               <div className="space-y-4">
                 {/* MBTI カテゴリ */}
                 <div className="overflow-hidden rounded-2xl border border-rose-50">
                    <button 
                      onClick={() => toggleCategory('mbti')}
                      className="flex w-full items-center justify-between bg-rose-50/30 px-5 py-4 transition-colors hover:bg-rose-50"
                    >
                      <span className="text-sm font-black text-slate-700">MBTI診断結果</span>
                      <ChevronLeft className={`h-4 w-4 text-rose-400 transition-transform duration-300 ${expandedCategories.includes('mbti') ? '-rotate-90' : ''}`} />
                    </button>
                    {expandedCategories.includes('mbti') && (
                      <div className="grid grid-cols-2 gap-2 p-4 animate-in fade-in zoom-in-95 md:grid-cols-4">
                        {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedMbtis(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                            className={`rounded-xl border py-2 text-[10px] font-bold transition-all ${
                              selectedMbtis.includes(type)
                                ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
                                : 'border-rose-100 bg-white text-slate-500 hover:border-rose-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                 </div>

                 {/* イチゴ系タイプ カテゴリ */}
                 <div className="overflow-hidden rounded-2xl border border-rose-50">
                    <button 
                      onClick={() => toggleCategory('strawberry')}
                      className="flex w-full items-center justify-between bg-rose-50/30 px-5 py-4 transition-colors hover:bg-rose-50"
                    >
                      <span className="text-sm font-black text-slate-700">イチゴ系タイプ</span>
                      <ChevronLeft className={`h-4 w-4 text-rose-400 transition-transform duration-300 ${expandedCategories.includes('strawberry') ? '-rotate-90' : ''}`} />
                    </button>
                    {expandedCategories.includes('strawberry') && (
                      <div className="flex flex-wrap gap-2 p-4 animate-in fade-in zoom-in-95">
                        {['フレッシュ', 'スイート', 'ワイルド', 'ビター'].map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedStrawberryTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                            className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                              selectedStrawberryTypes.includes(type)
                                ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
                                : 'border-rose-100 bg-white text-slate-500 hover:border-rose-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                 </div>

                 {/* 人気のタグ カテゴリ */}
                 <div className="overflow-hidden rounded-2xl border border-rose-50">
                    <button 
                      onClick={() => toggleCategory('tags')}
                      className="flex w-full items-center justify-between bg-rose-50/30 px-5 py-4 transition-colors hover:bg-rose-50"
                    >
                      <span className="text-sm font-black text-slate-700">フレーバータグ</span>
                      <ChevronLeft className={`h-4 w-4 text-rose-400 transition-transform duration-300 ${expandedCategories.includes('tags') ? '-rotate-90' : ''}`} />
                    </button>
                    {expandedCategories.includes('tags') && (
                      <div className="p-4 animate-in fade-in zoom-in-95">
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(displayCasts.flatMap(c => c.tags))).slice(0, 15).map(tag => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                              className={`rounded-full border px-4 py-2 text-[10px] font-bold transition-all ${
                                selectedTags.includes(tag)
                                  ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
                                  : 'border-rose-100 bg-white text-slate-500 hover:border-rose-300'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* キャストカード一覧 */}
        <div className="md:px-0">
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-10">
            {isLoading ? (
              <div className="col-span-full flex h-60 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
              </div>
            ) : (
              <>
                {/* 左列 */}
                <div className="flex flex-col gap-y-10 md:gap-y-20">
                  {filteredCasts
                    .filter((_, i) => i % 2 === 0)
                    .map((cast: CastItem, idx: number) => (
                      <div
                        key={cast.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft transition-all duration-500 hover:shadow-luxury animate-in fade-in slide-in-from-bottom-4"
                      >
                        <Link
                          href={`/store/${storeSlug}/cast/${cast.slug || cast.id}`}
                          className="block h-full w-full"
                        >
                          {/* 画像エリア */}
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <NextImage
                              src={cast.imageUrl}
                              alt={cast.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 400px"
                              priority={idx === 0}
                              loading={idx === 0 ? 'eager' : 'lazy'}
                            />

                            {/* バッジ装飾 */}
                            <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5">
                              <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                本日出勤
                              </span>
                              {cast.isIchioshi && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                  <Star className="h-2.5 w-2.5 fill-current" /> 店長一押し
                                </span>
                              )}
                            </div>

                            {/* 再生ボタン風装飾（ダミー） */}
                            <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-rose-400">
                                <div className="ml-0.5 h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-rose-400 border-t-transparent" />
                              </div>
                            </div>
                          </div>

                          {/* コンテンツエリア */}
                          <div className="flex flex-col p-4">
                            <div className="mb-2 flex items-end justify-between">
                              <h3 className="truncate text-base font-black text-slate-800 sm:text-lg">
                                {cast.name}
                              </h3>
                              <span className="ml-2 flex-shrink-0 text-sm font-bold text-slate-700">
                                {cast.age}歳
                              </span>
                            </div>

                            {/* MBTI & 顔型 */}
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {cast.mbtiType && (
                                <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                                  MBTI: {cast.mbtiType}
                                </span>
                              )}
                              {cast.faceType && cast.faceType.length > 0 && (
                                <span className="rounded-full border border-purple-100/50 bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600">
                                  顔型: {cast.faceType.join(', ')}
                                </span>
                              )}
                            </div>

                            {/* 身長 & 体重 - 横並び表示 */}
                            <div className="mb-3 flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                              <span className="flex items-center gap-1">
                                <span className="opacity-60">身長:</span>
                                <span>{cast.height ? `${cast.height}cm` : 'ヒミツ🍓'}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="opacity-60">体重:</span>
                                <span>{cast.weight ? `${cast.weight}kg` : 'ヒミツ🍓'}</span>
                              </span>
                            </div>

                            {/* 評価セクション */}
                            {cast.reviewCount && cast.reviewCount > 0 ? (
                              <div className="mb-3 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-black text-slate-700">
                                  {(cast.rating || 0).toFixed(1)}
                                </span>
                                <span className="text-xs font-bold text-slate-700">
                                  ({cast.reviewCount})
                                </span>
                              </div>
                            ) : (
                              <div className="mb-3 flex items-center gap-1 text-slate-400 text-[10px] font-bold border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md w-fit">
                                評価はまだありません
                              </div>
                            )}

                            {/* エロス係数 */}
                            <div className="mb-4 flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500/80">
                                  エロス係数
                                </span>
                                <span className="text-[11px] font-bold text-rose-600">
                                  {cast.sexinessLevel ?? 100}%
                                </span>
                              </div>
                              <div className="flex flex-col gap-[2px]">
                                <div className="flex items-end gap-[1px] h-4">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                                    const level = Math.ceil((cast.sexinessLevel ?? 100) / 10);
                                    const isActive = bar <= level;
                                    const getColor = () => {
                                      if (bar <= 4) return 'bg-emerald-400';
                                      if (bar <= 7) return 'bg-lime-400';
                                      if (bar <= 10) return 'bg-yellow-400';
                                      if (bar <= 13) return 'bg-orange-400';
                                      return 'bg-rose-500';
                                    };
                                    return (
                                      <div
                                        key={bar}
                                        className={`w-full rounded-sm transition-all duration-500 ${isActive ? getColor() : 'bg-neutral-100'}`}
                                        style={{ height: `${Math.min(100, (bar / 15) * 100 + 10)}%` }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* 出勤時間 */}
                            <div className="mt-auto border-t border-rose-50 pt-3">
                              <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-50/70 py-2.5">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                                <span className="text-xs font-black tracking-widest text-orange-600">
                                  {cast.attendance}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>

                {/* 右列 (オフセットあり) */}
                <div className="mt-10 flex flex-col gap-y-10 md:mt-20 md:gap-y-20">
                  {filteredCasts
                    .filter((_, i) => i % 2 === 1)
                    .map((cast: CastItem, idx: number) => (
                      <div
                        key={cast.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft transition-all duration-500 hover:shadow-luxury animate-in fade-in slide-in-from-bottom-4"
                      >
                        <Link
                          href={`/store/${storeSlug}/cast/${cast.slug || cast.id}`}
                          className="block h-full w-full"
                        >
                          {/* 画像エリア */}
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <NextImage
                              src={cast.imageUrl}
                              alt={cast.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 400px"
                              priority={idx === 0}
                              loading={idx === 0 ? 'eager' : 'lazy'}
                            />

                            {/* バッジ装飾 */}
                            <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5">
                              <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                本日出勤
                              </span>
                              {cast.isIchioshi && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                  <Star className="h-2.5 w-2.5 fill-current" /> 店長一押し
                                </span>
                              )}
                            </div>

                            {/* 再生ボタン風装飾（ダミー） */}
                            <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-rose-400">
                                <div className="ml-0.5 h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-rose-400 border-t-transparent" />
                              </div>
                            </div>
                          </div>

                          {/* コンテンツエリア */}
                          <div className="flex flex-col p-4">
                            <div className="mb-2 flex items-end justify-between">
                              <h3 className="truncate text-base font-black text-slate-800 sm:text-lg">
                                {cast.name}
                              </h3>
                              <span className="ml-2 flex-shrink-0 text-sm font-bold text-slate-500">
                                {cast.age}歳
                              </span>
                            </div>

                            {/* MBTI & 顔型 */}
                            <div className="mb-3 flex flex-wrap gap-1.5">
                              {cast.mbtiType && (
                                <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                                  MBTI: {cast.mbtiType}
                                </span>
                              )}
                              {cast.faceType && cast.faceType.length > 0 && (
                                <span className="rounded-full border border-purple-100/50 bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600">
                                  顔型: {cast.faceType.join(', ')}
                                </span>
                              )}
                              {(!cast.mbtiType || !cast.faceType) &&
                                cast.tags?.slice(0, 1).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-rose-100/50 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-500"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>

                            {/* 評価セクション */}
                            {cast.reviewCount && cast.reviewCount > 0 ? (
                              <div className="mb-3 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-black text-slate-700">
                                  {(cast.rating || 0).toFixed(1)}
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                  ({cast.reviewCount})
                                </span>
                              </div>
                            ) : (
                              <div className="mb-3 flex items-center gap-1 text-slate-400 text-[10px] font-bold border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md w-fit">
                                評価はまだありません
                              </div>
                            )}

                            {/* エロス係数 */}
                            <div className="mb-4 flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500/80">
                                  エロス係数
                                </span>
                                <span className="text-[11px] font-bold text-rose-600">
                                  {cast.sexinessLevel ?? 100}%
                                </span>
                              </div>
                              <div className="flex flex-col gap-[2px]">
                                <div className="flex items-end gap-[1px] h-4">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                                    const level = Math.ceil((cast.sexinessLevel ?? 100) / 10);
                                    const isActive = bar <= level;
                                    const getColor = () => {
                                      if (bar <= 4) return 'bg-emerald-400';
                                      if (bar <= 7) return 'bg-lime-400';
                                      if (bar <= 10) return 'bg-yellow-400';
                                      if (bar <= 13) return 'bg-orange-400';
                                      return 'bg-rose-500';
                                    };
                                    return (
                                      <div
                                        key={bar}
                                        className={`w-full rounded-sm transition-all duration-500 ${isActive ? getColor() : 'bg-neutral-100'}`}
                                        style={{ height: `${Math.min(100, (bar / 15) * 100 + 10)}%` }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* 出勤時間 */}
                            <div className="mt-auto border-t border-rose-50 pt-3">
                              <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-50/70 py-2.5">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                                <span className="text-xs font-black tracking-widest text-orange-600">
                                  {cast.attendance}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 検索結果なし */}
        {!isLoading && filteredCasts.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="mb-6 text-6xl opacity-20">🍓</div>
            <p className="text-lg font-bold text-slate-400">
              条件に合うセラピストが見つかりませんでした
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 text-sm font-bold text-rose-400 underline underline-offset-4 hover:text-rose-600"
            >
              条件をリセットする
            </button>
          </div>
        )}
 
        {/* もっと見るボタン */}
        {!isLoading && filteredCasts.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link
              href={`/store/${storeSlug}/cast-list`}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-rose-500 px-10 py-4 font-black transition-all hover:bg-rose-600 active:scale-95"
            >
              <span className="relative z-10 text-sm tracking-[0.2em] text-white">もっと見る</span>
              <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CastSection;
