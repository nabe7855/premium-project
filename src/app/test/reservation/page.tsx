'use client';

import { createReservation } from '@/lib/actions/reservation';
import { Calendar, CheckCircle2, Clock, Sparkles, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReservationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    clientNickname: '',
    date: '',
    time: '',
    visitCount: 1,
    course: '90min',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createReservation({
      customerName: formData.customerName,
      clientNickname: formData.clientNickname,
      dateTime: `${formData.date} ${formData.time}`,
      visitCount: formData.visitCount,
    });

    if (result.success) {
      toast.success('予約が完了しました');
      setIsCompleted(true);
    } else {
      toast.error('予約に失敗しました: ' + result.error);
    }
    setIsSubmitting(false);
  };

  if (isCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf8] p-4">
        <div className="scale-up-center w-full max-w-md rounded-[2.5rem] bg-white p-12 text-center shadow-2xl shadow-pink-100/50">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="mb-4 text-3xl font-black text-slate-800">Reservation Confirmed</h2>
          <p className="text-sm font-medium leading-relaxed text-slate-500">
            ご予約を承りました。
            <br />
            特別なひとときを、心ゆくまでお楽しみください。
          </p>
          <div className="mt-10 border-t border-slate-50 pt-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Auto-notification sent to admin
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf8] p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-pink-100/30">
        {/* Glow Effects */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-pink-100/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-100/30 blur-3xl" />

        <div className="relative p-8 md:p-12">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-200">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-800">Premium Booking</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
              Select Your Moment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <User className="h-3 w-3" /> お名前 (Full Name)
                </label>
                <input
                  required
                  type="text"
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-sm font-bold transition-all focus:border-pink-200 focus:bg-white focus:outline-none"
                  placeholder="佐藤 健太郎"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <User className="h-3 w-3" /> ニックネーム
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-sm font-bold transition-all focus:border-pink-200 focus:bg-white focus:outline-none"
                  placeholder="さとけん"
                  value={formData.clientNickname}
                  onChange={(e) => setFormData({ ...formData, clientNickname: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <Calendar className="h-3 w-3" /> 日付
                </label>
                <input
                  required
                  type="date"
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-sm font-bold transition-all focus:border-pink-200 focus:bg-white focus:outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <Clock className="h-3 w-3" /> 時間
                </label>
                <input
                  required
                  type="time"
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-sm font-bold transition-all focus:border-pink-200 focus:bg-white focus:outline-none"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                利用回数
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, visitCount: num })}
                    className={`rounded-2xl border-2 py-4 text-xs font-bold transition-all ${
                      formData.visitCount === num
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-100'
                    }`}
                  >
                    {num === 1 ? '初めてのご利用' : 'リピート'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 py-5 font-black text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? 'Processing...' : 'Complete Booking'}
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[10px] leading-relaxed text-slate-300">
            By clicking "Complete Booking", you agree to our terms of service.
            <br />
            Digital confirmation will be sent to your manager.
          </p>
        </div>
      </div>

      <style jsx>{`
        .scale-up-center {
          animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        @keyframes scale-up-center {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
