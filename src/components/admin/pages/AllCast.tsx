import { deleteCastProfile, updateCastAuth } from '@/actions/cast-auth';
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
  allCasts: Cast[]; // Added to check for duplicates
  onClose: () => void;
  onSave: (cast: Cast) => void;
  onDelete: (castId: string, castName: string) => void;
}> = ({ cast: initialCast, stores, allCasts, onClose, onSave, onDelete }) => {
  const [cast, setCast] = useState<Cast | null>(initialCast);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!cast) return null;

  const handlePriorityChange = (storeId: string, priority: number) => {
    // Duplicate check
    const isDuplicate = allCasts.some(
      (c) => c.id !== cast.id && c.storePriorities?.[storeId] === priority,
    );

    const newErrors = { ...errors };
    if (isDuplicate && priority > 0) {
      newErrors[storeId] = '同じ順位のキャストが既に存在します';
    } else {
      delete newErrors[storeId];
    }
    setErrors(newErrors);

    setCast({
      ...cast,
      storePriorities: {
        ...cast.storePriorities,
        [storeId]: priority,
      },
    });
  };

  const handleStoreChange = (storeId: string, checked: boolean) => {
    const currentStoreIds = cast.storeIds;
    let newStoreIds: string[];
    let newStorePriorities = { ...cast.storePriorities };

    if (checked) {
      newStoreIds = [...currentStoreIds, storeId];
      // Assign next available priority if not already set
      if (!newStorePriorities[storeId]) {
        const storeCasts = allCasts.filter((c) => c.storeIds?.includes(storeId));
        const maxPriority = Math.max(
          0,
          ...storeCasts.map((c) => c.storePriorities?.[storeId] || 0),
        );
        newStorePriorities[storeId] = maxPriority + 1;
      }
    } else {
      // Keep at least one store selected
      if (currentStoreIds.length > 1) {
        newStoreIds = currentStoreIds.filter((id) => id !== storeId);
        delete newStorePriorities[storeId];
      } else {
        return;
      }
    }
    setCast({ ...cast, storeIds: newStoreIds, storePriorities: newStorePriorities });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(cast);
  };

  const breakdownData = [
    { name: '新規', value: cast.stats?.breakdown?.new || 0 },
    { name: 'リピート', value: cast.stats?.breakdown?.repeat || 0 },
    { name: 'フリー', value: cast.stats?.breakdown?.free || 0 },
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
                          {cast.stats?.designations || 0}
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
                          data={cast.stats?.monthlyPerformance || []}
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
                <label className="text-sm text-brand-text-secondary">
                  所属店舗と表示順位（1〜）
                </label>
                <div className="mt-2 space-y-2 rounded-md border border-gray-700 bg-brand-primary p-3">
                  {stores.map((store) => {
                    const isChecked = cast.storeIds.includes(store.id);
                    return (
                      <div key={store.id} className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="flex cursor-pointer items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleStoreChange(store.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-accent focus:ring-2 focus:ring-brand-accent"
                            />
                            <span className={isChecked ? 'text-white' : 'text-gray-500'}>
                              {store.name}
                            </span>
                          </label>
                          {isChecked && (
                            <div className="flex items-center space-x-2">
                              <span className="mt-1 text-xs text-brand-text-secondary">
                                表示順:
                              </span>
                              <input
                                type="number"
                                min="1"
                                value={cast.storePriorities[store.id] || ''}
                                onChange={(e) =>
                                  handlePriorityChange(store.id, parseInt(e.target.value) || 0)
                                }
                                className={`w-16 rounded border ${
                                  errors[store.id] ? 'border-red-500' : 'border-gray-700'
                                } bg-brand-secondary p-1 text-center text-sm text-white focus:ring-1 focus:ring-brand-accent`}
                              />
                            </div>
                          )}
                        </div>
                        {isChecked && errors[store.id] && (
                          <p className="text-[10px] text-red-500">{errors[store.id]}</p>
                        )}
                      </div>
                    );
                  })}
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
              <div className="grid grid-cols-1 gap-4 rounded-md border border-brand-accent/20 bg-brand-accent/5 p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                    アカウント情報
                  </h3>
                </div>
                <div>
                  <label className="text-sm text-brand-text-secondary">
                    ログイン用メールアドレス
                  </label>
                  <input
                    type="email"
                    value={cast.email || ''}
                    onChange={(e) => setCast({ ...cast, email: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white"
                    placeholder="example@mail.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-brand-text-secondary">ログイン用パスワード</label>
                  <input
                    type="text"
                    value={cast.password || ''}
                    onChange={(e) => setCast({ ...cast, password: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white"
                    placeholder="パスワードを入力"
                  />
                </div>
                <p className="text-[10px] text-brand-text-secondary opacity-60 md:col-span-2">
                  ※これらの情報は管理用として保存されます。
                </p>
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

              {/* ⚠️ キャスト削除セクション */}
              <div className="mt-8 border-t border-red-900/30 pt-6">
                <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4">
                  <h3 className="mb-2 text-sm font-bold text-red-500">キャストの完全削除</h3>
                  <p className="mb-4 text-xs leading-relaxed text-brand-text-secondary">
                    この操作により、キャストのプロフィール、画像、口コミ、つぶやき、出勤情報、およびログインアカウントがすべて完全に削除され、復元できなくなります。
                  </p>
                  <button
                    type="button"
                    onClick={() => onDelete(cast.id, cast.name)}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500/30 bg-red-600/20 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-600 hover:text-white"
                  >
                    このキャストを完全に削除する
                  </button>
                </div>
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
          .select('id, name, slug');

        if (storeError) throw storeError;

        const mappedStores: Store[] = (storeData || []).map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug || '',
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
            email,
            login_password,
            cast_store_memberships (
              store_id,
              priority
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

          const storeStatuses =
            c.cast_statuses?.map((s: any) => s.status_master?.name).filter(Boolean) || [];

          return {
            id: c.id,
            name: c.name,
            storeIds: c.cast_store_memberships?.map((m: any) => m.store_id) || [],
            storePriorities: (c.cast_store_memberships || []).reduce((acc: any, m: any) => {
              acc[m.store_id] = m.priority || 0;
              return acc;
            }, {}),
            status: c.is_active ? '在籍中' : '離籍',
            storeStatuses: storeStatuses,
            tags: [], // Tags can be added if needed
            photoUrl: c.main_image_url || '',
            managerComment: c.manager_comment || '',
            catchphrase: c.catch_copy || '',
            email: c.email || '',
            password: c.login_password || '',
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

  const handleSave = async (updatedCast: Cast) => {
    console.log('--- Start Saving Cast Details (Priority Aware) ---');
    console.log('Target Cast ID:', updatedCast.id);
    console.log('Requested Store IDs:', updatedCast.storeIds);

    try {
      // 1. Update basic cast information
      const { error: castError } = await supabase
        .from('casts')
        .update({
          name: updatedCast.name,
          catch_copy: updatedCast.catchphrase,
          manager_comment: updatedCast.managerComment,
          is_active: updatedCast.status === '在籍中',
        })
        .eq('id', updatedCast.id);

      if (castError) {
        console.error('Error updating cast profile:', castError);
        throw new Error(`プロフィールの更新に失敗しました: ${castError.message}`);
      }
      console.log('Cast profile updated successfully.');

      // 1.5 Update auth info if changed
      const authResult = await updateCastAuth(
        updatedCast.id,
        updatedCast.email || '',
        updatedCast.password,
      );
      if (!authResult.success) {
        console.error('Error updating cast auth:', authResult.error);
        // We continue even if auth update fails, but log it
      } else {
        console.log('Cast auth updated successfully.');
      }

      // 2. Sync store memberships
      console.log('Clearing old memberships...');
      const { error: deleteError } = await supabase
        .from('cast_store_memberships')
        .delete()
        .eq('cast_id', updatedCast.id);
      if (deleteError) throw new Error(`削除失敗: ${deleteError.message}`);

      // Then, insert new memberships with priority handling
      if (updatedCast.storeIds.length > 0) {
        const membershipData = updatedCast.storeIds.map((storeId) => ({
          cast_id: updatedCast.id,
          store_id: storeId,
          priority: updatedCast.storePriorities[storeId] ?? 0,
        }));

        const { error: insertError } = await supabase
          .from('cast_store_memberships')
          .insert(membershipData);

        if (insertError) {
          console.error('Error inserting new memberships:', insertError);
          throw new Error(`新しい店舗所属情報の保存に失敗しました: ${insertError.message}`);
        }
        console.log('New memberships inserted successfully.');
      }

      // Update local state and close modal
      setCasts(casts.map((c) => (c.id === updatedCast.id ? updatedCast : c)));
      setSelectedCast(null);
      alert('キャスト情報を保存しました');
      console.log('--- Save Process Completed Successfully ---');
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(error.message || '保存中にエラーが発生しました');
    }
  };

  const handleDelete = async (castId: string, castName: string) => {
    if (!confirm(`キャスト「${castName}」を完全に削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }

    if (
      !confirm(
        `【最終確認】\n「${castName}」に関連するすべてのデータ（プロフィール、画像、口コミ、つぶやき、出勤情報、アカウント）が完全に消去されます。本当によろしいですか？`,
      )
    ) {
      return;
    }

    try {
      const result = await deleteCastProfile(castId);
      if (result.success) {
        alert('キャストを削除しました');
        setCasts((prev) => prev.filter((c) => c.id !== castId));
        setSelectedCast(null);
      } else {
        alert(`削除に失敗しました: ${result.error}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('削除中にエラーが発生しました');
    }
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
          key={selectedCast.id}
          cast={selectedCast}
          stores={stores}
          allCasts={casts}
          onClose={() => setSelectedCast(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
