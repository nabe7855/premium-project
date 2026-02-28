import { fetchDailyCasts } from '@/actions/cast';
import { TodayCast } from '@/lib/getTodayCastsByStore';
import { CastConfig, CastItem } from '@/lib/store/storeTopConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Heart, RotateCcw, Search, Star } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link'; // ✅ 追加
import React, { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface CastSectionProps {
  config?: CastConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
  storeSlug?: string;
}

const CastSection: React.FC<CastSectionProps> = ({
  config,
  isEditing,
  onUpdate: _onUpdate,
  onImageUpload: _onImageUpload,
  storeSlug = 'fukuoka', // デフォルトは福岡
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [fetchedCasts, setFetchedCasts] = useState<CastItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<
    'default' | 'age-asc' | 'age-desc' | 'height-asc' | 'height-desc' | 'new'
  >('default');

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

      setIsLoading(true);
      try {
        const data = await fetchDailyCasts(storeSlug, selectedDate);

        // TodayCast -> CastItem 変換
        const mappedCasts: CastItem[] = data.map((c: TodayCast) => ({
          id: c.id, // IDはUUID(string)
          name: c.name,
          slug: c.slug, // ✅ 追加
          age: c.age || 0,
          height: c.height || 0,
          comment: c.catch_copy || '',
          status: '本日出勤',
          tags: c.tags || [],
          imageUrl:
            c.main_image_url ||
            c.image_url ||
            'https://placehold.jp/24/cccccc/ffffff/300x400.png?text=No%20Image',
          schedule: [selectedDate], // 現在選択中の日付のみ
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
  }, [selectedDate, storeSlug]);

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
      result = result.filter((cast) => cast.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
        // UUIDの場合は作成日時などでソートすべきだが、ここでは文字列比較または元の順序を維持
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [displayCasts, searchTerm, sortKey]);

  const resetFilters = () => {
    setSearchTerm('');
    if (dates.length > 0) setSelectedDate(dates[0].date);
    setSortKey('default');
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
        />

        {isEditing && (
          <div className="mb-8 rounded-3xl border border-rose-100 bg-rose-50/50 p-4 text-center text-[10px] font-bold text-rose-400 backdrop-blur-sm">
            ※ キャスト情報の管理はダッシュボードから行えます
          </div>
        )}

        {/* 検索・フィルターエリア */}
        <div className="mb-12 space-y-8">
          {/* 1. 日付検索 */}
          <div className="rounded-[2.5rem] border border-rose-50/50 bg-white p-2 shadow-sm">
            <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`relative flex min-w-[70px] flex-col items-center justify-center rounded-[2rem] py-3 transition-all duration-300 ${
                    selectedDate === d.date
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'bg-transparent text-slate-400 hover:bg-rose-50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {d.isToday ? 'Today' : d.day}
                  </span>
                  <span className="text-lg font-black tracking-tight">{d.display}</span>
                  {selectedDate === d.date && (
                    <motion.div
                      layoutId="activeTag"
                      className="absolute -bottom-1 h-1 w-4 rounded-full bg-white opacity-50"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* 2. 名前検索 */}
            <div className="relative lg:col-span-7">
              <input
                type="text"
                placeholder="キャストの名前で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[2rem] border-2 border-rose-50 bg-white py-4 pl-14 pr-6 text-sm font-bold text-slate-600 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-rose-200 focus:ring-4 focus:ring-rose-100/20"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-rose-300" />
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

            {/* 3. 並び替え & リセット */}
            <div className="flex gap-2 lg:col-span-5">
              <div className="relative flex-1">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="w-full appearance-none rounded-[2rem] border-2 border-rose-50 bg-white py-4 pl-6 pr-12 text-sm font-bold text-slate-600 shadow-sm outline-none transition-all focus:border-rose-200"
                >
                  <option value="default">並び替え：指定なし</option>
                  <option value="new">新着順</option>
                  <option value="age-asc">年齢が低い順</option>
                  <option value="age-desc">年齢が高い順</option>
                  <option value="height-desc">身長が高い順</option>
                  <option value="height-asc">身長が低い順</option>
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
                  <ArrowUpDown className="h-4 w-4 text-rose-300" />
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center rounded-[2rem] border-2 border-rose-50 bg-white px-6 text-rose-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95 md:px-8"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* キャストカード一覧 */}
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:overflow-visible md:px-0">
          <div className="flex min-h-[300px] gap-4 md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {isLoading ? (
              <div className="col-span-full flex h-60 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredCasts.map((cast: CastItem) => (
                  <motion.div
                    key={cast.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative flex w-[calc(50%-0.5rem)] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-rose-50/50 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-rose-100/50 md:w-auto"
                  >
                    <Link
                      href={`/store/${storeSlug}/cast/${cast.slug || cast.id}`}
                      className="block h-full w-full"
                    >
                      {/* 画像エリア */}
                      <div className="relative aspect-[1/1.2] overflow-hidden">
                        <NextImage
                          src={cast.imageUrl}
                          alt={cast.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                        />

                        {/* バッジ装飾 */}
                        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
                          {cast.name.length % 3 === 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[8px] font-black text-white shadow-lg">
                              <Star className="h-2.5 w-2.5 fill-current" /> NEW
                            </span>
                          )}
                          <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-black text-rose-500 backdrop-blur-sm">
                            <Heart className="h-2.5 w-2.5 fill-current" /> 本日出勤
                          </span>
                        </div>

                        {/* グラデーション & グラスモーフィズムオーバーレイ */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pb-4 pt-10 backdrop-blur-[2px]">
                          {/* 名前と基本情報 */}
                          <div className="px-4 text-white">
                            <h3 className="mb-0.5 font-serif text-xl font-bold tracking-wider drop-shadow-md">
                              {cast.name}
                            </h3>
                            <div className="flex items-center gap-2 opacity-90 drop-shadow-sm">
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {cast.height}cm
                              </span>
                              <span className="h-2 w-[1px] bg-white/30" />
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {cast.age}歳
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* タグエリア（より洗練されたデザインに） */}
                      <div className="flex flex-wrap gap-1.5 p-3">
                        {cast.tags?.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-md border border-rose-100/50 bg-rose-50/80 px-2 py-0.5 text-[9px] font-bold tracking-tight text-rose-500/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* イチゴの隠しアイコン（ホバー時） */}
                      <div className="absolute -bottom-3 -right-3 h-10 w-10 rotate-12 opacity-0 transition-all duration-500 group-hover:opacity-20">
                        <span className="text-3xl">🍓</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* 検索結果なし */}
        {!isLoading && filteredCasts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CastSection;
