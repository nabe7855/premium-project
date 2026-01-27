import { fetchDailyCasts } from '@/actions/cast';
import { TodayCast } from '@/lib/getTodayCastsByStore';
import { CastConfig, CastItem } from '@/lib/store/storeTopConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Heart, RotateCcw, Search, Star } from 'lucide-react';
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
  storeSlug = 'yokohama',
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
          id: c.id,
          name: c.name,
          age: c.age || 0,
          height: c.height || 0,
          comment: c.catch_copy || '',
          status: '本日出勤',
          tags: c.tags || [],
          imageUrl:
            c.main_image_url ||
            c.image_url ||
            'https://placehold.jp/24/cccccc/ffffff/300x400.png?text=No%20Image',
          schedule: [selectedDate],
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

  const displayCasts = fetchedCasts.length > 0 ? fetchedCasts : isLoading ? [] : [];

  // フィルタリング & ソートロジック
  const filteredCasts = useMemo(() => {
    let result = [...displayCasts];

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
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [displayCasts, searchTerm, sortKey]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDate(dates[0].date);
    setSortKey('default');
  };

  return (
    <section id="cast" className="relative overflow-hidden bg-[#FFF9FA] py-16 md:py-24">
      {/* 背景装飾 */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-rose-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          en={config?.subHeading || 'Yokohama Casts'}
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
            <div className="scrollbar-hide flex gap-2 overflow-x-auto p-1">
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
                      layoutId="yokohamaActiveTag"
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
                placeholder="キャスト名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[2rem] border-2 border-rose-50 bg-white py-4 pl-14 pr-6 text-sm font-bold text-slate-600 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-rose-200 focus:ring-4 focus:ring-rose-100/20"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-rose-300" />
              </div>
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
                  <option value="age-asc">年齢：低い順</option>
                  <option value="age-desc">年齢：高い順</option>
                  <option value="height-desc">身長：高い順</option>
                  <option value="height-asc">身長：低い順</option>
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
                  <ArrowUpDown className="h-4 w-4 text-rose-300" />
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center rounded-[2rem] border-2 border-rose-50 bg-white px-6 text-rose-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* キャストカード一覧 */}
        <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
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
                    className="group relative flex w-[calc(50%-0.5rem)] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-rose-50/50 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-rose-100/50 md:w-auto"
                  >
                    <div className="relative aspect-[1/1.2] overflow-hidden">
                      <img
                        src={cast.imageUrl}
                        alt={cast.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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

                      {/* グラデーションオーバーレイ */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* 名前と基本情報（画像下部） */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="mb-0.5 font-serif text-lg font-bold tracking-wide">
                          {cast.name}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                          {cast.height}cm / {cast.age}歳
                        </p>
                      </div>
                    </div>

                    {/* タグエリア */}
                    <div className="flex flex-wrap gap-1 p-2">
                      {cast.tags?.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full border border-rose-50 bg-rose-50/50 px-2 py-0.5 text-[8px] font-bold tracking-tight text-rose-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* イチゴの隠しアイコン（ホバー時） */}
                    <div className="absolute -bottom-3 -right-3 h-10 w-10 rotate-12 opacity-0 transition-all duration-500 group-hover:opacity-20">
                      <span className="text-3xl">🍓</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {!isLoading && filteredCasts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-6xl">🍓</div>
            <p className="text-lg font-bold text-slate-400">
              条件に合うセラピストが見つかりませんでした
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 text-sm font-bold text-rose-400 underline decoration-rose-200 underline-offset-8"
            >
              検索条件をクリアする
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CastSection;
