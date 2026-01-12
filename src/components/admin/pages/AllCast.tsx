import Card from '@/components/admin/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { Cast, Store } from '@/types/dashboard';
import React, { useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '../admin-assets/Icons';
// FIX: Added CartesianGrid to the import from recharts to resolve the "Cannot find name 'CartesianGrid'" error.
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Component to render a single cast member's card
const CastCard: React.FC<{ cast: Cast; stores: Store[]; onSelect: (cast: Cast) => void }> = ({
  cast,
  stores,
  onSelect,
}) => {
  const castStores = stores.filter((s) => cast.storeIds.includes(s.id));
  return (
    <button
      onClick={() => onSelect(cast)}
      className="flex w-full items-center space-x-4 rounded-lg bg-brand-secondary p-4 text-left transition-colors duration-200 hover:bg-gray-700/50"
    >
      <img
        src={
          cast.photoUrl || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'
        }
        alt={cast.name}
        className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
      />
      <div className="flex-1 overflow-hidden">
        <p className="truncate font-bold text-white">{cast.name}</p>
        <p className="truncate text-sm text-brand-text-secondary">
          {castStores.map((s) => s.name).join(', ')}
        </p>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${cast.status === '在籍中' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
        >
          {cast.status}
        </span>
      </div>
    </button>
  );
};

// Modal for displaying and editing cast details
const CastDetailModal: React.FC<{
  cast: Cast;
  stores: Store[];
  onClose: () => void;
  onSave: (cast: Cast) => void;
}> = ({ cast: initialCast, stores, onClose, onSave }) => {
  const [cast, setCast] = useState<Cast>(initialCast);

  const handleStoreChange = (storeId: string, checked: boolean) => {
    const currentStoreIds = cast.storeIds;
    let newStoreIds: string[];
    if (checked) {
      newStoreIds = [...currentStoreIds, storeId];
    } else {
      // Keep at least one store selected
      if (currentStoreIds.length > 1) {
        newStoreIds = currentStoreIds.filter((id) => id !== storeId);
      } else {
        // Prevent unchecking the last store
        return;
      }
    }
    setCast({ ...cast, storeIds: newStoreIds });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(cast);
  };

  const breakdownData = [
    { name: '新規', value: cast.stats.breakdown.new },
    { name: 'リピート', value: cast.stats.breakdown.repeat },
    { name: 'フリー', value: cast.stats.breakdown.free },
  ];
  const COLORS = ['#3E7BFA', '#10B981', '#F59E0B'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-brand-secondary shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-brand-text-secondary hover:text-white"
          >
            <XMarkIcon />
          </button>
          <h2 className="mb-6 text-2xl font-bold text-white">{cast.name} の詳細</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {/* Left Column: Photo & Stats */}
            <div className="space-y-4 md:col-span-2">
              <img
                src={
                  cast.photoUrl ||
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'
                }
                alt={cast.name}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <Card title="統計情報">
                <div className="space-y-4">
                  {/* Donut Chart for Breakdown */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-brand-text-secondary">
                      指名内訳
                    </h4>
                    <div className="relative h-48 w-full">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={breakdownData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={5}
                          >
                            {breakdownData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1E1E3F', borderColor: '#374151' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {cast.stats.designations}
                        </span>
                        <span className="text-sm text-brand-text-secondary">総指名</span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-center space-x-4 text-xs">
                      {breakdownData.map((item, index) => (
                        <div key={item.name} className="flex items-center">
                          <span
                            className="mr-1.5 h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          ></span>
                          <span>
                            {item.name}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bar Chart for Monthly Performance */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-brand-text-secondary">
                      月次指名本数
                    </h4>
                    <div className="h-40 w-full">
                      <ResponsiveContainer>
                        <BarChart
                          data={cast.stats.monthlyPerformance}
                          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} fontSize={12} />
                          <YAxis tick={{ fill: '#A0AEC0' }} fontSize={12} />
                          <Tooltip
                            cursor={{ fill: 'rgba(62, 123, 250, 0.1)' }}
                            contentStyle={{ backgroundColor: '#1E1E3F', borderColor: '#374151' }}
                          />
                          <Bar dataKey="value" name="指名本数" fill="#3E7BFA" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Details & Form */}
            <div className="space-y-4 md:col-span-3">
              <div>
                <label className="text-sm text-brand-text-secondary">名前</label>
                <input
                  type="text"
                  value={cast.name}
                  onChange={(e) => setCast({ ...cast, name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2"
                />
              </div>
              <div>
                <label className="text-sm text-brand-text-secondary">キャッチコピー</label>
                <input
                  type="text"
                  value={cast.catchphrase}
                  onChange={(e) => setCast({ ...cast, catchphrase: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2"
                />
              </div>
              <div>
                <label className="text-sm text-brand-text-secondary">ステータス</label>
                <select
                  value={cast.status}
                  onChange={(e) => setCast({ ...cast, status: e.target.value as Cast['status'] })}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2"
                >
                  <option>在籍中</option>
                  <option>離籍</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-brand-text-secondary">所属店舗（複数選択可）</label>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-gray-700 bg-brand-primary p-2 sm:grid-cols-3">
                  {stores.map((store) => (
                    <label
                      key={store.id}
                      className="flex cursor-pointer items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={cast.storeIds.includes(store.id)}
                        onChange={(e) => handleStoreChange(store.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-accent focus:ring-2 focus:ring-brand-accent"
                      />
                      <span>{store.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-brand-text-secondary">マネージャーコメント</label>
                <textarea
                  value={cast.managerComment}
                  onChange={(e) => setCast({ ...cast, managerComment: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2"
                  rows={4}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-500"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand-accent px-4 py-2 font-semibold text-white hover:bg-blue-500"
                >
                  保存
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main page for managing all cast members
export default function AllCast() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Stores
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id, name');

        if (storeError) throw storeError;

        const mappedStores: Store[] = (storeData || []).map((s) => ({
          id: s.id,
          name: s.name,
          catchphrase: '',
          overview: '',
          address: '',
          phone: '',
          photoUrl: '',
        }));
        setStores(mappedStores);

        // Fetch Casts with memberships and statuses
        const { data: castData, error: castError } = await supabase.from('casts').select(`
            id,
            name,
            manager_comment,
            is_active,
            catch_copy,
            main_image_url,
            cast_store_memberships (
              store_id
            ),
            cast_statuses (
              status_master (
                name
              )
            )
          `);

        if (castError) throw castError;

        const mappedCasts: Cast[] = (castData || []).map((c) => {
          // Generate dummy stats for each cast
          const designations = Math.floor(Math.random() * 100) + 20;
          const repeat = Math.floor(designations * 0.7);
          const news = Math.floor(designations * 0.2);
          const free = designations - repeat - news;

          const storeStatus = c.cast_statuses?.some((s: any) => s.status_master?.name === '新人')
            ? '新人'
            : c.cast_statuses?.some((s: any) => s.status_master?.name === '店長おすすめ')
              ? '店長おすすめ'
              : 'レギュラー';

          return {
            id: c.id,
            name: c.name,
            storeIds: c.cast_store_memberships?.map((m: any) => m.store_id) || [],
            status: c.is_active ? '在籍中' : '離籍',
            storeStatus: storeStatus as '新人' | '店長おすすめ' | 'レギュラー',
            tags: [], // Tags can be added if needed
            photoUrl: c.main_image_url || '',
            managerComment: c.manager_comment || '',
            catchphrase: c.catch_copy || '',
            stats: {
              designations,
              repeatRate: Math.floor((repeat / designations) * 100),
              breakdown: { new: news, repeat: repeat, free: free },
              monthlyPerformance: [
                { name: '1月', value: Math.floor(Math.random() * 20) },
                { name: '2月', value: Math.floor(Math.random() * 20) },
                { name: '3月', value: Math.floor(Math.random() * 20) },
                { name: '4月', value: Math.floor(Math.random() * 20) },
                { name: '5月', value: Math.floor(Math.random() * 20) },
                { name: '6月', value: Math.floor(Math.random() * 20) },
              ],
            },
          };
        });
        setCasts(mappedCasts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = (updatedCast: Cast) => {
    setCasts(casts.map((c) => (c.id === updatedCast.id ? updatedCast : c)));
    setSelectedCast(null);
  };

  const filteredCasts = useMemo(() => {
    const baseFiltered = casts.filter((cast) => {
      const nameMatch = cast.name.toLowerCase().includes(searchTerm.toLowerCase());
      const storeMatch = selectedStore === 'all' || cast.storeIds.includes(selectedStore);
      const statusMatch =
        activeTab === 'active' ? cast.status === '在籍中' : cast.status === '離籍';
      return nameMatch && storeMatch && statusMatch;
    });

    return baseFiltered.sort((a, b) => a.name.localeCompare(b.name));
  }, [casts, searchTerm, selectedStore, activeTab]);

  return (
    <div className="space-y-6">
      <Card title="キャスト検索">
        <div className="mb-4 border-b border-gray-700">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'active'
                  ? 'border-b-2 border-brand-accent text-white'
                  : 'text-brand-text-secondary hover:text-white'
              }`}
            >
              在籍中
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'inactive'
                  ? 'border-b-2 border-brand-accent text-white'
                  : 'text-brand-text-secondary hover:text-white'
              }`}
            >
              離籍
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="名前で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-brand-primary p-2"
          />
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-brand-primary p-2"
          >
            <option value="all">すべての店舗</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card
        title={`${activeTab === 'active' ? '在籍中' : '離籍'}キャスト (${filteredCasts.length}名)`}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
            </div>
          ) : filteredCasts.length > 0 ? (
            filteredCasts.map((cast) => (
              <CastCard key={cast.id} cast={cast} stores={stores} onSelect={setSelectedCast} />
            ))
          ) : (
            <p className="col-span-full py-8 text-center text-brand-text-secondary">
              該当するキャストがいません。
            </p>
          )}
        </div>
      </Card>

      {selectedCast && (
        <CastDetailModal
          cast={selectedCast}
          stores={stores}
          onClose={() => setSelectedCast(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
