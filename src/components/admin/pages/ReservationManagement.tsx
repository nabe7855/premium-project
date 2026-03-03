'use client';

import Card from '@/components/admin/ui/Card';
import {
  assignCastToReservation,
  getAllCasts,
  getReservations,
  getStores,
  updateReservationStep,
} from '@/lib/actions/reservation';
import { Reservation, WorkflowStepId } from '@/types/reservation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileText,
  LucideIcon,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Store,
  User,
  UserPlus,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const STEP_ICONS: Record<WorkflowStepId, LucideIcon> = {
  counseling: FileText,
  consent: ShieldCheck,
  review: MessageSquare,
  survey: ClipboardCheck,
  reflection: User,
};

type StatusFilter = 'all' | 'pending' | 'completed' | 'free';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [allCasts, setAllCasts] = useState<{ id: string; name: string }[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resData, storeData, castData] = await Promise.all([
        getReservations(storeFilter === 'all' ? undefined : storeFilter),
        getStores(),
        getAllCasts(),
      ]);
      setReservations(resData);
      setStores(storeData);
      setAllCasts(castData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [storeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter logic
  const filteredReservations = reservations.filter((res) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'free' ? !res.castId : res.status === statusFilter);
    const matchesStore = storeFilter === 'all' || res.storeId === storeFilter;
    const matchesSearch =
      res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.castName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.phone || '').includes(searchQuery);
    return matchesStatus && matchesStore && matchesSearch;
  });

  const handleToggleStep = async (resId: string, stepId: WorkflowStepId) => {
    const res = reservations.find((r) => r.id === resId);
    if (!res) return;

    const newSteps = res.steps.map((step) =>
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step,
    );

    const allDone = newSteps.every((s) => s.isCompleted);
    const newStatus: 'pending' | 'completed' = allDone ? 'completed' : 'pending';

    // Optimistic UI update
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, steps: newSteps, status: newStatus } : r)),
    );
    if (selectedReservation?.id === resId) {
      setSelectedReservation({ ...res, steps: newSteps, status: newStatus });
    }

    try {
      const result = await updateReservationStep(resId, newSteps, newStatus);
      if (!result.success) {
        toast.error('保存に失敗しました');
        fetchData();
      } else {
        toast.success('ステータスを更新しました');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('保存中にエラーが発生しました');
      fetchData();
    }
  };

  const handleAssignCast = async (resId: string, castId: string) => {
    setIsAssigning(true);
    try {
      const result = await assignCastToReservation(resId, castId);
      if (result.success) {
        toast.success('キャストを割り当てました');
        await fetchData();
        // 更新されたデータを再セット
        const updated = reservations.find((r) => r.id === resId);
        if (updated) setSelectedReservation(updated);
      } else {
        toast.error('割り当てに失敗しました');
      }
    } catch (error) {
      console.error('Assign failed:', error);
      toast.error('エラーが発生しました');
    } finally {
      setIsAssigning(false);
    }
  };

  const copyLink = (type: string, resId: string) => {
    const url = `${window.location.origin}/${type}/${resId}`;
    navigator.clipboard.writeText(url);
    toast.success('URLをコピーしました！');
  };

  const openReflectionForm = (resId: string) => {
    window.open(`/reflection/${resId}`, '_blank');
  };

  // Detail View
  if (selectedReservation) {
    const isCompleted = selectedReservation.status === 'completed';
    return (
      <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right">
        <button
          onClick={() => setSelectedReservation(null)}
          className="flex items-center gap-2 px-2 font-semibold text-brand-text-secondary transition-colors hover:text-brand-accent"
        >
          <ArrowLeft size={20} />
          予約一覧に戻る
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info Column */}
          <div className="space-y-6 lg:col-span-2">
            <Card title={`予約詳細 - ${selectedReservation.customerName}`}>
              <div className="space-y-8">
                {/* Profile Headline */}
                <div className="flex items-center gap-4 border-b border-gray-700 pb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/20 text-brand-accent shadow-inner">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {selectedReservation.customerName} 様
                    </h2>
                    <div className="mt-1 flex items-center gap-3 text-sm font-bold">
                      <span
                        className={`rounded-full px-3 py-1 ${selectedReservation.visitCount === 1 ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}
                      >
                        {selectedReservation.visitCount === 1
                          ? '初回のご利用'
                          : `リピート (${selectedReservation.visitCount}回目)`}
                      </span>
                      {selectedReservation.clientNickname && (
                        <span className="text-brand-text-secondary">
                          ニックネーム: {selectedReservation.clientNickname}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Basics Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-text-secondary">
                      <Phone size={14} className="text-brand-accent" />
                      連絡先情報
                    </h3>
                    <div className="space-y-3 rounded-2xl border border-gray-700 bg-brand-primary/30 p-4">
                      <div className="group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="text-gray-500" size={18} />
                          <span className="font-mono text-white">
                            {selectedReservation.phone || '未登録'}
                          </span>
                        </div>
                        {selectedReservation.phone && (
                          <a
                            href={`tel:${selectedReservation.phone}`}
                            className="rounded-lg bg-green-500/10 p-2 text-green-500 transition-all hover:bg-green-500 hover:text-white"
                          >
                            <Phone size={14} />
                          </a>
                        )}
                      </div>
                      <div className="group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="text-gray-500" size={18} />
                          <span className="max-w-[200px] truncate text-white">
                            {selectedReservation.email || '未登録'}
                          </span>
                        </div>
                        {selectedReservation.email && (
                          <a
                            href={`mailto:${selectedReservation.email}`}
                            className="rounded-lg bg-blue-500/10 p-2 text-blue-500 transition-all hover:bg-blue-500 hover:text-white"
                          >
                            <Mail size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-text-secondary">
                      <Calendar size={14} className="text-brand-accent" />
                      予約スケジュール
                    </h3>
                    <div className="space-y-3 rounded-2xl border border-gray-700 bg-brand-primary/30 p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-500" size={18} />
                        <div>
                          <p className="text-xs text-brand-text-secondary">予約日時</p>
                          <p className="font-bold text-white">{selectedReservation.dateTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <Store className="text-gray-500" size={18} />
                        <div>
                          <p className="text-xs text-brand-text-secondary">店舗</p>
                          <p className="font-bold text-white">
                            {selectedReservation.storeName || '未指定'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Requests */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-text-secondary">
                    <MessageCircle size={14} className="text-brand-accent" />
                    お客様からの要望・備考
                  </h3>
                  <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                    {selectedReservation.customerRequests ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-indigo-100">
                        {selectedReservation.customerRequests}
                      </p>
                    ) : (
                      <p className="text-sm italic text-gray-500">特別な要望はありません</p>
                    )}
                  </div>
                </div>

                {/* Cast Assignment (Highlighted) */}
                <div className="rounded-2xl border-2 border-brand-accent/20 bg-brand-accent/5 p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-white">
                        <UserPlus size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-brand-text-secondary">
                          現在の担当キャスト
                        </p>
                        <p className="text-lg font-black text-white">
                          {selectedReservation.castName || (
                            <span className="text-pink-500">フリー（未割当）</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 md:max-w-xs">
                      <select
                        className="w-full rounded-xl border border-gray-600 bg-brand-secondary px-4 py-3 text-sm text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        value={selectedReservation.castId || ''}
                        onChange={(e) => handleAssignCast(selectedReservation.id, e.target.value)}
                        disabled={isAssigning}
                      >
                        <option value="">担当を変更・選択</option>
                        {allCasts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Flow Column */}
          <div className="space-y-6">
            <Card title="ワークフロー進捗">
              <div className="space-y-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-brand-text-secondary">達成率</p>
                  <p className="text-xs font-bold text-brand-accent">
                    {Math.round(
                      (selectedReservation.steps.filter((s) => s.isCompleted).length /
                        selectedReservation.steps.length) *
                        100,
                    )}
                    %
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full bg-brand-accent shadow-[0_0_10px_rgba(255,51,102,0.5)] transition-all duration-1000"
                    style={{
                      width: `${(selectedReservation.steps.filter((s) => s.isCompleted).length / selectedReservation.steps.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="space-y-3 pt-4">
                  {selectedReservation.steps.map((step, idx) => {
                    const Icon = STEP_ICONS[step.id];
                    return (
                      <div
                        key={step.id}
                        className={`group relative flex flex-col gap-3 rounded-2xl border p-4 transition-all ${
                          step.isCompleted
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-gray-700 bg-brand-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-500'}`}
                            >
                              {Icon && <Icon size={20} />}
                            </div>
                            <div>
                              <p
                                className={`text-[10px] font-bold ${step.isCompleted ? 'text-green-500' : 'text-gray-500'}`}
                              >
                                STEP {idx + 1}
                              </p>
                              <p
                                className={`text-sm font-bold ${step.isCompleted ? 'text-green-100' : 'text-white'}`}
                              >
                                {step.label}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleStep(selectedReservation.id, step.id)}
                            className={`rounded-full p-2 transition-all ${
                              step.isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle size={20} />
                          </button>
                        </div>

                        {/* Quick Actions for Step */}
                        {!step.isCompleted && (
                          <div className="flex gap-2 border-t border-gray-700/50 pt-2 group-hover:block">
                            {['counseling', 'consent', 'review', 'survey'].includes(step.id) && (
                              <button
                                onClick={() => copyLink(step.id, selectedReservation.id)}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-secondary py-2 text-[10px] font-bold text-pink-400 transition-all hover:bg-pink-500 hover:text-white"
                              >
                                <Copy size={12} />
                                リンクをコピー
                              </button>
                            )}
                            {step.id === 'reflection' && (
                              <button
                                onClick={() => openReflectionForm(selectedReservation.id)}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500/20 py-2 text-[10px] font-bold text-indigo-400 transition-all hover:bg-indigo-500 hover:text-white"
                              >
                                <FileText size={12} />
                                シートを開く
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // List View (existing)
  return (
    <div className="space-y-6 duration-500 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">予約管理</h1>
          <p className="text-sm text-brand-text-secondary">すべての予約を一元管理</p>
        </div>
        <button
          onClick={fetchData}
          className="rounded-xl border border-gray-700 bg-brand-primary p-3 transition-colors hover:bg-gray-800 disabled:opacity-50"
          disabled={isLoading}
        >
          <RotateCcw size={18} className={`text-brand-accent ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Status & Free Filter */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-gray-700 bg-brand-primary p-1">
          {[
            { id: 'all', label: 'すべて' },
            { id: 'free', label: 'フリー' },
            { id: 'pending', label: '進行中' },
            { id: 'completed', label: '完了' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id as StatusFilter)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold transition-all sm:text-xs ${
                statusFilter === filter.id
                  ? 'bg-brand-accent text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {filter.label}
              {filter.id !== 'all' && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === filter.id ? 'bg-white/20' : 'bg-gray-700'}`}
                >
                  {filter.id === 'free'
                    ? reservations.filter((r) => !r.castId).length
                    : reservations.filter((r) => r.status === filter.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Store Filter */}
        <div className="relative">
          <Store className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-700 bg-brand-primary py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="all">店舗: すべて</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="予約者、キャスト、電話番号で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-brand-primary py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
      </div>

      {/* Reservation List (existing) */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">データを読み込み中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((res) => {
              const completedSteps = res.steps.filter((s) => s.isCompleted).length;
              const progress = (completedSteps / res.steps.length) * 100;
              const isFree = !res.castId;

              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedReservation(res)}
                  className={`group relative overflow-hidden rounded-xl border p-5 text-left shadow-lg transition-all hover:border-brand-accent hover:shadow-xl ${
                    isFree ? 'border-pink-500/50 bg-pink-500/5' : 'border-gray-700 bg-brand-primary'
                  }`}
                >
                  {/* Progress Bar */}
                  <div
                    className={`absolute left-0 top-0 h-1 transition-all duration-500 ${isFree ? 'bg-pink-500' : 'bg-brand-accent'}`}
                    style={{ width: `${progress}%` }}
                  />

                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${isFree ? 'bg-pink-500/20 text-pink-400' : 'bg-rose-500/20 text-rose-400'}`}
                      >
                        {isFree ? <UserPlus size={24} /> : <User size={24} />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="flex items-center gap-2 truncate font-bold text-white">
                          <span className="truncate">{res.customerName}</span>
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] ${
                              res.visitCount === 1
                                ? 'bg-pink-500/20 text-pink-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {res.visitCount === 1 ? '初回' : 'リピート'}
                          </span>
                          {isFree && (
                            <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">
                              フリー
                            </span>
                          )}
                        </div>
                        <p className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                          <Calendar size={10} />
                          {res.dateTime}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="shrink-0 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-brand-accent"
                      size={20}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">店 / キャスト</span>
                      <span className="truncate font-bold text-white">
                        {res.storeName || '店未定'} / {res.castName || 'フリー'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            res.status === 'completed'
                              ? 'bg-green-500'
                              : isFree
                                ? 'bg-pink-500'
                                : 'bg-brand-accent'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-[10px] font-bold text-gray-500">
                        {completedSteps} / {res.steps.length}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <ClipboardCheck className="mb-4 h-16 w-16 text-gray-700" />
              <p className="font-medium text-gray-500">該当する予約がありません</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
