import { deleteCastProfile, updateCastAuth } from '@/actions/cast-auth';
import Card from '@/components/admin/ui/Card';
import { WorkflowResponseModal } from '@/components/admin/ui/WorkflowResponseModal';
import {
  getAvailableMonths,
  getCastDetailReservations,
  getCastPerformanceData,
} from '@/lib/actions/analytics';
import { getStepResponse } from '@/lib/actions/workflowResponse';
import { supabase } from '@/lib/supabaseClient';
import { Cast, Store } from '@/types/dashboard';
import {
  Calendar,
  ClipboardCheck,
  FileText,
  Filter,
  MessageSquare,
  ShieldCheck,
  User,
} from 'lucide-react';
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
      className="flex w-full flex-col justify-start space-y-3 rounded-lg bg-brand-secondary p-4 text-left transition-colors duration-200 hover:bg-gray-700/50"
    >
      <div className="flex w-full items-center space-x-4">
        <img
          src={
            cast.photoUrl ||
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'
          }
          alt={cast.name}
          className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
        />
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-bold text-white">{cast.name}</p>
          <p className="truncate text-[11px] text-brand-text-secondary">
            {castStores.map((s) => s.name).join(', ')}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${cast.status === '在籍中' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {cast.status}
          </span>
        </div>
      </div>

      {/* 統計情報簡易表示 */}
      {cast.stats && (
        <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-800/50 p-2 text-[11px]">
          <div className="flex items-center justify-between font-medium">
            <span className="text-gray-400">
              総指名: <span className="text-white">{cast.stats.designations}</span>
            </span>
            <span className="text-pink-400">新規: {cast.stats.breakdown.new}</span>
            <span className="text-blue-400">リピ: {cast.stats.breakdown.repeat}</span>
            <span className="text-orange-400">フリー: {cast.stats.breakdown.free}</span>
          </div>
          {cast.stats.strengths && cast.stats.strengths.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-gray-500">強み:</span>
              {cast.stats.strengths.map((s) => (
                <span
                  key={s}
                  className="rounded bg-indigo-500/20 px-1 py-0.5 text-[10px] text-indigo-300"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </button>
  );
};

// Modal for displaying and editing cast details
const CastDetailModal: React.FC<{
  cast: Cast;
  stores: Store[];
  allCasts: Cast[];
  selectedStore?: string;
  selectedMonth?: string;
  availableMonths: string[];
  onClose: () => void;
  onSave: (cast: Cast) => void;
  onDelete: (castId: string, castName: string) => void;
}> = ({
  cast: initialCast,
  stores,
  allCasts,
  selectedStore: initialStore,
  selectedMonth: initialMonth,
  availableMonths,
  onClose,
  onSave,
  onDelete,
}) => {
  const [cast, setCast] = useState<Cast | null>(initialCast);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const [reservationHistory, setReservationHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [blogCount, setBlogCount] = useState(0);

  // Modal-local filters
  const [localStore, setLocalStore] = useState(initialStore || 'all');
  const [localMonth, setLocalMonth] = useState(initialMonth || 'all');

  // Workflow detail state
  const [workflowDetail, setWorkflowDetail] = useState<{
    reservationId: string;
    stepId: string;
    label: string;
    data: any;
  } | null>(null);
  const [loadingStepId, setLoadingStepId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'history' && cast) {
      setHistoryLoading(true);
      getCastDetailReservations(cast.id, localStore, localMonth).then((result) => {
        setReservationHistory(result.reservations || []);
        setBlogCount(result.blogCount || 0);
        setHistoryLoading(false);
      });
    }
  }, [activeTab, cast?.id, localStore, localMonth]);

  const handleViewWorkflowStep = async (reservation: any, stepId: string, label: string) => {
    setLoadingStepId(`${reservation.id}-${stepId}`);
    try {
      const resp = await getStepResponse(reservation.id, stepId as any);
      setWorkflowDetail({ reservationId: reservation.id, stepId, label, data: resp });
    } catch (e) {
      alert('回答の取得に失敗しました');
    } finally {
      setLoadingStepId(null);
    }
  };

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
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-brand-secondary shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-gray-700 p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-brand-text-secondary hover:text-white"
          >
            <XMarkIcon />
          </button>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-white">{cast.name} の詳細</h2>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md bg-brand-primary p-1.5 ring-1 ring-gray-700">
                <Calendar className="h-4 w-4 text-gray-400" />
                <select
                  value={localMonth}
                  onChange={(e) => setLocalMonth(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none"
                >
                  <option value="all">全期間</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m} className="bg-brand-secondary">
                      {m.replace('-', '年 ')}月
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-brand-primary p-1.5 ring-1 ring-gray-700">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={localStore}
                  onChange={(e) => setLocalStore(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none"
                >
                  <option value="all">全店舗</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id} className="bg-brand-secondary">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('edit')}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === 'edit'
                  ? 'border-b-2 border-brand-accent text-white'
                  : 'text-brand-text-secondary hover:text-white'
              }`}
            >
              プロフィール編集
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-brand-accent text-white'
                  : 'text-brand-text-secondary hover:text-white'
              }`}
            >
              予約履歴
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'history' ? (
            <div className="space-y-4">
              {/* 簡易サマリー */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{cast.stats?.designations ?? 0}</p>
                  <p className="mt-1 text-xs text-indigo-400">総指名数</p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{cast.stats?.repeatRate ?? 0}%</p>
                  <p className="mt-1 text-xs text-emerald-400">リピート率</p>
                </div>
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{blogCount}</p>
                  <p className="mt-1 text-xs text-violet-400">ブログ投稿数</p>
                </div>
              </div>

              {/* 予約リスト */}
              {historyLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-accent" />
                </div>
              ) : reservationHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-brand-text-secondary">
                  該当期間の予約履歴がありません。
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-brand-text-secondary">
                    直近 {reservationHistory.length} 件の予約履歴 (クリックで詳細回答表示)
                  </p>
                  {reservationHistory.map((r: any) => (
                    <div key={r.id} className="space-y-1">
                      <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-brand-primary px-4 py-3 text-sm transition-colors hover:bg-brand-primary/80">
                        <div className="flex-1 text-slate-100">
                          <p className="font-bold">{r.customerName}</p>
                          <p className="text-[11px] text-gray-500">{r.dateTime}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] ${
                              r.status === 'completed'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}
                          >
                            {r.status || '不明'}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              r.visitCount === 1
                                ? 'bg-pink-500/20 text-pink-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {r.visitCount === 1 ? '新規' : `${r.visitCount}回目`}
                          </span>
                        </div>
                      </div>

                      {/* Workflow Step Buttons */}
                      <div className="flex flex-wrap gap-2 px-1 pb-2">
                        {[
                          { id: 'counseling', icon: FileText, label: 'カウンセリング' },
                          { id: 'consent', icon: ShieldCheck, label: '同意書' },
                          { id: 'review', icon: MessageSquare, label: '口コミ' },
                          { id: 'survey', icon: ClipboardCheck, label: 'アンケート' },
                          { id: 'reflection', icon: User, label: '振り返り' },
                        ].map((step) => {
                          const isCompleted = r.progress_json?.some(
                            (s: any) => s.id === step.id && s.isCompleted,
                          );
                          if (!isCompleted) return null;

                          const isLoading = loadingStepId === `${r.id}-${step.id}`;

                          return (
                            <button
                              key={step.id}
                              onClick={() => handleViewWorkflowStep(r, step.id, step.label)}
                              disabled={isLoading}
                              className="flex items-center gap-1 rounded border border-gray-700/50 bg-gray-800/50 px-2 py-1 text-[10px] text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <div className="h-2 w-2 animate-spin rounded-full border-b border-white" />
                              ) : (
                                <step.icon className="h-3 w-3" />
                              )}
                              {step.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
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
                    <label className="text-sm text-brand-text-secondary">
                      ログイン用パスワード
                    </label>
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
          )}
        </div>
        {workflowDetail && (
          <WorkflowResponseModal
            stepId={workflowDetail.stepId}
            stepLabel={workflowDetail.label}
            data={workflowDetail.data}
            onClose={() => setWorkflowDetail(null)}
          />
        )}
      </div>
    </div>
  );
};

// Main page for managing all cast members
export default function AllCast() {
  const [baseCasts, setBaseCasts] = useState<Cast[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    getAvailableMonths(selectedStore).then(setAvailableMonths);
  }, [selectedStore]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Stores
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id, name, slug')
          .eq('is_active', true);

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
          isActive: true, // Filters are already applied in the query
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
              designations: 0,
              repeatRate: 0,
              breakdown: { new: 0, repeat: 0, free: 0 },
              monthlyPerformance: [],
              strengths: [],
            },
          };
        });
        setBaseCasts(mappedCasts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (baseCasts.length === 0) return;
    let isMounted = true;
    const loadStats = async () => {
      setIsLoading(true);
      const statsMap = await getCastPerformanceData(selectedStore, selectedMonth);
      if (!isMounted) return;
      const combined = baseCasts.map((c) => {
        const st = statsMap[c.id];
        if (st) {
          return { ...c, stats: st };
        }
        return c; // default empty stats
      });
      setCasts(combined);

      if (selectedCast) {
        const updated = combined.find((cb) => cb.id === selectedCast.id);
        if (updated) setSelectedCast(updated);
      }
      setIsLoading(false);
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [baseCasts, selectedMonth, selectedStore]);

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
      const mapped = casts.map((c) => (c.id === updatedCast.id ? updatedCast : c));
      setCasts(mapped);
      setBaseCasts(baseCasts.map((c) => (c.id === updatedCast.id ? updatedCast : c)));
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
        setBaseCasts((prev) => prev.filter((c) => c.id !== castId));
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="名前で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-brand-primary p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <select
            value={selectedStore}
            onChange={(e) => {
              setSelectedStore(e.target.value);
              setSelectedMonth('all');
            }}
            className="w-full rounded-md border border-gray-700 bg-brand-primary p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">すべての店舗</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-md border border-indigo-500/50 bg-indigo-500/10 p-2 font-bold text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all" className="bg-brand-primary text-white">
                全期間の統計
              </option>
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-brand-primary text-white">
                  {m.replace('-', '年 ')}月 の統計
                </option>
              ))}
            </select>
          </div>
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
          selectedStore={selectedStore}
          selectedMonth={selectedMonth}
          availableMonths={availableMonths}
          onClose={() => setSelectedCast(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
