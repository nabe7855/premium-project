'use client';

import { getReservations } from '@/lib/actions/reservation';
import { supabase } from '@/lib/supabaseClient';
import { Reservation, WorkflowStep, WorkflowStepId } from '@/types/reservation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const STEP_ICONS: Record<WorkflowStepId, LucideIcon> = {
  counseling: FileText,
  consent: ShieldCheck,
  review: MessageSquare,
  survey: ClipboardCheck,
  reflection: User,
};

export default function ReservationSection() {
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'completed'>('pending');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    setIsLoading(true);
    const data = await getReservations();
    setReservations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter((r) => r.status === activeSubTab);

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

  useEffect(() => {
    if (selectedReservation) {
      const checkCounselingStatus = async () => {
        const { data } = await supabase
          .from('workflow_counseling')
          .select('id')
          .eq('reservation_id', selectedReservation.id)
          .maybeSingle();

        if (
          data &&
          !selectedReservation.steps.find((s: WorkflowStep) => s.id === 'counseling')?.isCompleted
        ) {
          toggleStep(selectedReservation.id, 'counseling' as WorkflowStepId);
        }
      };

      const checkConsentStatus = async () => {
        const { data } = await supabase
          .from('workflow_consent')
          .select('id')
          .eq('reservation_id', selectedReservation.id)
          .maybeSingle();

        if (
          data &&
          !selectedReservation.steps.find((s: WorkflowStep) => s.id === 'consent')?.isCompleted
        ) {
          toggleStep(selectedReservation.id, 'consent' as WorkflowStepId);
        }
      };

      const checkSurveyStatus = async () => {
        const { data } = await supabase
          .from('workflow_survey')
          .select('id')
          .eq('reservation_id', selectedReservation.id)
          .maybeSingle();

        if (
          data &&
          !selectedReservation.steps.find((s: WorkflowStep) => s.id === 'survey')?.isCompleted
        ) {
          toggleStep(selectedReservation.id, 'survey' as WorkflowStepId);
        }
      };

      const checkReflectionStatus = async () => {
        const { data } = await supabase
          .from('workflow_reflection')
          .select('id')
          .eq('reservation_id', selectedReservation.id)
          .maybeSingle();

        if (
          data &&
          !selectedReservation.steps.find((s: WorkflowStep) => s.id === 'reflection')?.isCompleted
        ) {
          toggleStep(selectedReservation.id, 'reflection' as WorkflowStepId);
        }
      };

      checkCounselingStatus();
      checkConsentStatus();
      checkSurveyStatus();
      checkReflectionStatus();
    }
  }, [selectedReservation?.id]);

  const copyCounselingLink = (resId: string) => {
    const url = `${window.location.origin}/counseling/${resId}`;
    navigator.clipboard.writeText(url);
    toast.success('カウンセリングURLをコピーしました！');
  };

  const copyConsentLink = (resId: string) => {
    const url = `${window.location.origin}/consent/${resId}`;
    navigator.clipboard.writeText(url);
    toast.success('性的同意URLをコピーしました！');
  };

  const copySurveyLink = (resId: string) => {
    const url = `${window.location.origin}/survey/${resId}`;
    navigator.clipboard.writeText(url);
    toast.success('事後アンケートURLをコピーしました！');
  };

  const openReflectionForm = (resId: string) => {
    window.open(`/reflection/${resId}`, '_blank');
  };

  if (selectedReservation) {
    const isCompleted = selectedReservation.status === 'completed';
    return (
      <div className="duration-300 animate-in slide-in-from-right">
        <button
          onClick={() => setSelectedReservation(null)}
          className="mb-6 flex items-center gap-1 text-slate-500 transition-colors hover:text-pink-600"
        >
          <ArrowLeft className="h-4 w-4" />
          一覧に戻る
        </button>

        <div className="mb-6 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedReservation.customerName} 様
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                    selectedReservation.visitCount === 1
                      ? 'bg-pink-100 text-pink-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedReservation.visitCount === 1
                    ? '初回'
                    : `${selectedReservation.visitCount}回目`}
                </span>
              </div>
              <p className="flex items-center gap-1 text-sm text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {selectedReservation.dateTime} 予約
              </p>
            </div>
            {isCompleted && (
              <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-600">
                <CheckCircle className="h-4 w-4" />
                Workflow 完了
              </span>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <ClipboardCheck className="h-5 w-5 text-pink-500" />
              アクションフロー
            </h3>

            <div className="space-y-3">
              {selectedReservation.steps.map((step: WorkflowStep, idx: number) => {
                const Icon = STEP_ICONS[step.id];

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                      step.isCompleted
                        ? 'border-emerald-100 bg-emerald-50'
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          step.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'
                        }`}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold ${step.isCompleted ? 'text-emerald-800' : 'text-slate-500'}`}
                        >
                          STEP {idx + 1} ({step.type === 'pre' ? '事前' : '事後'})
                        </p>
                        <p
                          className={`font-bold ${step.isCompleted ? 'text-emerald-900' : 'text-slate-700'}`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        onClick={() => toggleStep(selectedReservation.id, step.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          step.isCompleted
                            ? 'border border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-100'
                            : 'bg-indigo-600 text-white shadow-md shadow-indigo-100 hover:bg-indigo-700'
                        }`}
                      >
                        {step.isCompleted ? '完了済み' : '完了にする'}
                      </button>

                      {step.id === 'counseling' && !step.isCompleted && (
                        <button
                          onClick={() => copyCounselingLink(selectedReservation.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-pink-500 hover:bg-pink-50"
                        >
                          <Copy className="h-3 w-3" />
                          URLをコピー
                        </button>
                      )}

                      {step.id === 'consent' && !step.isCompleted && (
                        <button
                          onClick={() => copyConsentLink(selectedReservation.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-pink-500 hover:bg-pink-50"
                        >
                          <Copy className="h-3 w-3" />
                          URLをコピー
                        </button>
                      )}

                      {step.id === 'survey' && !step.isCompleted && (
                        <button
                          onClick={() => copySurveyLink(selectedReservation.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-pink-500 hover:bg-pink-50"
                        >
                          <Copy className="h-3 w-3" />
                          URLをコピー
                        </button>
                      )}

                      {step.id === 'reflection' && !step.isCompleted && (
                        <button
                          onClick={() => openReflectionForm(selectedReservation.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-500 hover:bg-indigo-50"
                        >
                          <FileText className="h-3 w-3" />
                          シートを開く
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-900">
              ✨ 完了レポート
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  事前データ
                </p>
                <p className="text-sm font-medium leading-relaxed text-indigo-900">
                  カウンセリング済。性的同意確認済。 落ち着いた雰囲気を好まれるお客様です。
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  事後フィードバック
                </p>
                <p className="text-sm font-medium leading-relaxed text-indigo-900">
                  口コミ（★5）投稿済。事後アンケート済。 次回キャンペーン案内に興味あり。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 duration-500 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex w-fit rounded-2xl border border-pink-100 bg-white p-1">
          {[
            {
              id: 'pending',
              label: '未完了',
              count: reservations.filter((r) => r.status === 'pending').length,
            },
            {
              id: 'completed',
              label: '完了',
              count: reservations.filter((r) => r.status === 'completed').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as 'pending' | 'completed')}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-100'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={fetchReservations}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-white text-pink-500 shadow-sm transition-all hover:bg-pink-50 active:rotate-180"
        >
          <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="予約者を検索..."
          className="w-full rounded-2xl border border-pink-100 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
            <p className="mt-4 text-xs font-bold text-slate-400">Loading Reservations...</p>
          </div>
        ) : filteredReservations.length > 0 ? (
          filteredReservations.map((res: Reservation) => {
            const completedSteps = res.steps.filter((s) => s.isCompleted).length;
            const progress = (completedSteps / res.steps.length) * 100;

            return (
              <button
                key={res.id}
                onClick={() => setSelectedReservation(res)}
                className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-white p-5 text-left shadow-sm transition-all hover:border-pink-300 hover:shadow-md"
              >
                <div
                  className="absolute left-0 top-0 h-1 bg-pink-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />

                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="flex items-center gap-1.5 font-bold text-gray-800">
                        {res.customerName}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                            res.visitCount === 1
                              ? 'bg-pink-100 text-pink-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {res.visitCount === 1 ? 'New' : 'Repeat'}
                        </span>
                      </h4>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {res.dateTime}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 transform text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-pink-400" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all duration-500 ${
                        res.status === 'completed' ? 'bg-green-500' : 'bg-pink-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="whitespace-nowrap text-[10px] font-bold text-slate-500">
                    {completedSteps} / {res.steps.length} Steps
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-pink-200 bg-white py-12 text-center">
            <ClipboardCheck className="mx-auto mb-4 h-12 w-12 text-pink-100" />
            <p className="font-medium text-slate-400">表示できる予約がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
