'use client';

import Card from '@/components/admin/ui/Card';
import { Reservation, WorkflowStep, WorkflowStepId } from '@/types/reservation';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileText,
  LucideIcon,
  MessageSquare,
  RotateCcw,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useState } from 'react';

// Mock data for reservations
const MOCK_RESERVATIONS: (Reservation & { castName: string; customerRequests?: string })[] = [
  {
    id: 'res-001',
    customerName: '田中 花子',
    castName: 'ノブアキ',
    visitCount: 1,
    dateTime: '2026-01-15 19:00',
    status: 'pending',
    customerRequests: '落ち着いた雰囲気を希望。アロマの香りが好き。',
    steps: [
      {
        id: 'counseling',
        label: 'カウンセリングシート＋アンケート',
        isCompleted: true,
        type: 'pre',
      },
      { id: 'consent', label: '性的同意画面', isCompleted: false, type: 'pre' },
      { id: 'review', label: '口コミ', isCompleted: false, type: 'post' },
      { id: 'survey', label: '事後アンケート', isCompleted: false, type: 'post' },
      { id: 'reflection', label: '振り返りシート', isCompleted: false, type: 'post' },
    ],
  },
  {
    id: 'res-002',
    customerName: '佐藤 美咲',
    castName: 'トワ',
    visitCount: 3,
    dateTime: '2026-01-16 20:30',
    status: 'completed',
    customerRequests: '前回と同じキャストで。リラックスできる音楽をお願いします。',
    steps: [
      {
        id: 'counseling',
        label: 'カウンセリングシート＋アンケート',
        isCompleted: true,
        type: 'pre',
      },
      { id: 'consent', label: '性的同意画面', isCompleted: true, type: 'pre' },
      { id: 'review', label: '口コミ', isCompleted: true, type: 'post' },
      { id: 'survey', label: '事後アンケート', isCompleted: true, type: 'post' },
      { id: 'reflection', label: '振り返りシート', isCompleted: true, type: 'post' },
    ],
  },
  {
    id: 'res-003',
    customerName: '鈴木 愛',
    castName: 'ヒカル',
    visitCount: 1,
    dateTime: '2026-01-17 18:00',
    status: 'pending',
    customerRequests: '初めてなので優しく対応してほしい。',
    steps: [
      {
        id: 'counseling',
        label: 'カウンセリングシート＋アンケート',
        isCompleted: false,
        type: 'pre',
      },
      { id: 'consent', label: '性的同意画面', isCompleted: false, type: 'pre' },
      { id: 'review', label: '口コミ', isCompleted: false, type: 'post' },
      { id: 'survey', label: '事後アンケート', isCompleted: false, type: 'post' },
      { id: 'reflection', label: '振り返りシート', isCompleted: false, type: 'post' },
    ],
  },
  {
    id: 'res-004',
    customerName: '高橋 さくら',
    castName: 'ノブアキ',
    visitCount: 2,
    dateTime: '2026-01-18 21:00',
    status: 'pending',
    customerRequests: 'ディープティッシュマッサージ希望。',
    steps: [
      {
        id: 'counseling',
        label: 'カウンセリングシート＋アンケート',
        isCompleted: true,
        type: 'pre',
      },
      { id: 'consent', label: '性的同意画面', isCompleted: true, type: 'pre' },
      { id: 'review', label: '口コミ', isCompleted: false, type: 'post' },
      { id: 'survey', label: '事後アンケート', isCompleted: false, type: 'post' },
      { id: 'reflection', label: '振り返りシート', isCompleted: false, type: 'post' },
    ],
  },
  {
    id: 'res-005',
    customerName: '山田 結衣',
    castName: 'トワ',
    visitCount: 1,
    dateTime: '2026-01-19 19:30',
    status: 'completed',
    customerRequests: '特になし。',
    steps: [
      {
        id: 'counseling',
        label: 'カウンセリングシート＋アンケート',
        isCompleted: true,
        type: 'pre',
      },
      { id: 'consent', label: '性的同意画面', isCompleted: true, type: 'pre' },
      { id: 'review', label: '口コミ', isCompleted: true, type: 'post' },
      { id: 'survey', label: '事後アンケート', isCompleted: true, type: 'post' },
      { id: 'reflection', label: '振り返りシート', isCompleted: true, type: 'post' },
    ],
  },
];

const STEP_ICONS: Record<WorkflowStepId, LucideIcon> = {
  counseling: FileText,
  consent: ShieldCheck,
  review: MessageSquare,
  survey: ClipboardCheck,
  reflection: User,
};

type StatusFilter = 'all' | 'pending' | 'completed';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [selectedReservation, setSelectedReservation] = useState<
    (typeof MOCK_RESERVATIONS)[0] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesSearch =
      res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.castName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleStep = (resId: string, stepId: WorkflowStepId) => {
    setReservations((prev) => {
      const updated = prev.map((res) => {
        if (res.id !== resId) return res;

        const newSteps = res.steps.map((step) =>
          step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step,
        );

        const allDone = newSteps.every((s) => s.isCompleted);
        const status: 'pending' | 'completed' = allDone ? 'completed' : 'pending';

        return {
          ...res,
          steps: newSteps,
          status,
        };
      });

      const currentSelected = updated.find((r) => r.id === resId);
      if (currentSelected) {
        setSelectedReservation(currentSelected);
      }

      return updated;
    });
  };

  const copyCounselingLink = (resId: string) => {
    const url = `${window.location.origin}/counseling/${resId}`;
    navigator.clipboard.writeText(url);
    alert('カウンセリングURLをコピーしました！');
  };

  const copyConsentLink = (resId: string) => {
    const url = `${window.location.origin}/consent/${resId}`;
    navigator.clipboard.writeText(url);
    alert('性的同意URLをコピーしました！');
  };

  const copySurveyLink = (resId: string) => {
    const url = `${window.location.origin}/survey/${resId}`;
    navigator.clipboard.writeText(url);
    alert('事後アンケートURLをコピーしました！');
  };

  const openReflectionForm = (resId: string) => {
    window.open(`/reflection/${resId}`, '_blank');
  };

  // Detail View
  if (selectedReservation) {
    const isCompleted = selectedReservation.status === 'completed';
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedReservation(null)}
          className="flex items-center gap-2 font-semibold text-brand-text-secondary transition-colors hover:text-brand-accent"
        >
          <ArrowLeft size={20} />
          予約一覧に戻る
        </button>

        <Card title={`予約詳細 - ${selectedReservation.customerName}`}>
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-700 bg-brand-primary/30 p-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  予約者名
                </p>
                <p className="flex items-center gap-2 font-bold text-white">
                  {selectedReservation.customerName}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      selectedReservation.visitCount === 1
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {selectedReservation.visitCount === 1
                      ? '初回'
                      : `${selectedReservation.visitCount}回目`}
                  </span>
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  担当キャスト
                </p>
                <p className="font-bold text-white">{selectedReservation.castName}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  予約日時
                </p>
                <p className="flex items-center gap-1 font-bold text-white">
                  <Calendar size={14} />
                  {selectedReservation.dateTime}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  ステータス
                </p>
                <p className="font-bold text-white">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      isCompleted
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {isCompleted ? '完了' : '進行中'}
                  </span>
                </p>
              </div>
            </div>

            {/* Customer Requests */}
            {selectedReservation.customerRequests && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  お客様からの要望
                </p>
                <p className="text-sm leading-relaxed text-white">
                  {selectedReservation.customerRequests}
                </p>
              </div>
            )}

            {/* Action Flow */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-text-secondary">
                <ClipboardCheck size={18} className="text-brand-accent" />
                アクションフロー
              </h3>
              <div className="space-y-3">
                {selectedReservation.steps.map((step: WorkflowStep, idx: number) => {
                  const Icon = STEP_ICONS[step.id];

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                        step.isCompleted
                          ? 'border-green-500/30 bg-green-500/10'
                          : 'border-gray-700 bg-brand-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            step.isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {Icon && <Icon size={20} />}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${step.isCompleted ? 'text-green-400' : 'text-gray-500'}`}
                          >
                            STEP {idx + 1} ({step.type === 'pre' ? '事前' : '事後'})
                          </p>
                          <p
                            className={`font-bold ${step.isCompleted ? 'text-green-300' : 'text-white'}`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleStep(selectedReservation.id, step.id)}
                          className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                            step.isCompleted
                              ? 'border border-green-500/30 bg-brand-primary text-green-400 hover:bg-green-500/20'
                              : 'bg-brand-accent text-white hover:bg-brand-accent/80'
                          }`}
                        >
                          {step.isCompleted ? '完了済み' : '完了にする'}
                        </button>

                        {step.id === 'counseling' && !step.isCompleted && (
                          <button
                            onClick={() => copyCounselingLink(selectedReservation.id)}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-pink-500/30 bg-brand-primary px-4 py-2 text-xs font-bold text-pink-400 hover:bg-pink-500/20"
                          >
                            <Copy size={12} />
                            URLコピー
                          </button>
                        )}

                        {step.id === 'consent' && !step.isCompleted && (
                          <button
                            onClick={() => copyConsentLink(selectedReservation.id)}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-pink-500/30 bg-brand-primary px-4 py-2 text-xs font-bold text-pink-400 hover:bg-pink-500/20"
                          >
                            <Copy size={12} />
                            URLコピー
                          </button>
                        )}

                        {step.id === 'survey' && !step.isCompleted && (
                          <button
                            onClick={() => copySurveyLink(selectedReservation.id)}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-pink-500/30 bg-brand-primary px-4 py-2 text-xs font-bold text-pink-400 hover:bg-pink-500/20"
                          >
                            <Copy size={12} />
                            URLコピー
                          </button>
                        )}

                        {step.id === 'reflection' && !step.isCompleted && (
                          <button
                            onClick={() => openReflectionForm(selectedReservation.id)}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/30 bg-brand-primary px-4 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20"
                          >
                            <FileText size={12} />
                            シートを開く
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion Report */}
            {isCompleted && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-400">
                  ✨ 完了レポート
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-700 bg-brand-primary/50 p-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      事前データ
                    </p>
                    <p className="text-sm leading-relaxed text-white">
                      カウンセリング済。性的同意確認済。落ち着いた雰囲気を好まれるお客様です。
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-brand-primary/50 p-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      事後フィードバック
                    </p>
                    <p className="text-sm leading-relaxed text-white">
                      口コミ（★5）投稿済。事後アンケート済。次回キャンペーン案内に興味あり。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">予約管理</h1>
          <p className="text-sm text-brand-text-secondary">すべての予約を一元管理</p>
        </div>
        <button className="rounded-xl border border-gray-700 bg-brand-primary p-3 transition-colors hover:bg-gray-800">
          <RotateCcw size={18} className="text-brand-accent" />
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Status Filter */}
        <div className="flex gap-2 rounded-xl border border-gray-700 bg-brand-primary p-1">
          {[
            { id: 'all', label: 'すべて', count: reservations.length },
            {
              id: 'pending',
              label: '進行中',
              count: reservations.filter((r) => r.status === 'pending').length,
            },
            {
              id: 'completed',
              label: '完了',
              count: reservations.filter((r) => r.status === 'completed').length,
            },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id as StatusFilter)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                statusFilter === filter.id
                  ? 'bg-brand-accent text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {filter.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  statusFilter === filter.id ? 'bg-white/20' : 'bg-gray-700'
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="予約者名またはキャスト名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-brand-primary py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
      </div>

      {/* Reservation List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((res) => {
            const completedSteps = res.steps.filter((s) => s.isCompleted).length;
            const progress = (completedSteps / res.steps.length) * 100;

            return (
              <button
                key={res.id}
                onClick={() => setSelectedReservation(res)}
                className="group relative overflow-hidden rounded-xl border border-gray-700 bg-brand-primary p-5 text-left shadow-lg transition-all hover:border-brand-accent hover:shadow-xl"
              >
                {/* Progress Bar */}
                <div
                  className="absolute left-0 top-0 h-1 bg-brand-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />

                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 font-bold text-white">
                        {res.customerName}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            res.visitCount === 1
                              ? 'bg-pink-500/20 text-pink-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {res.visitCount === 1 ? '初回' : 'リピート'}
                        </span>
                      </h4>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {res.dateTime}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className="text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-brand-accent"
                    size={20}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">担当キャスト</span>
                    <span className="font-bold text-white">{res.castName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          res.status === 'completed' ? 'bg-green-500' : 'bg-brand-accent'
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
    </div>
  );
}
