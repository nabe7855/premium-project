'use client';

import { createReservation } from '@/lib/actions/reservation';
import { CastListMini } from '@/lib/getCastsByStore';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Suspense, use, useState } from 'react';
import { toast } from 'sonner';

interface ReservationPageClientProps {
  store: {
    id: string;
    name: string;
    slug: string;
    phone: string | null;
    line_id: string | null;
    line_url: string | null;
    notification_email: string | null;
  };
  storeConfig?: any;
  castsPromise: Promise<CastListMini[]>;
}

function CastOptions({ promise }: { promise: Promise<CastListMini[]> }) {
  const casts = use(promise);
  return (
    <optgroup label="━━━ セラピスト指名 ━━━">
      {casts.map((cast) => (
        <option key={cast.id} value={cast.id}>
          {cast.name}
          {cast.age ? ` (${cast.age}歳)` : ''}
          {cast.isNewcomer ? ' 🆕新人' : ''}
        </option>
      ))}
    </optgroup>
  );
}

export default function ReservationPageClient({
  store,
  storeConfig,
  castsPromise,
}: ReservationPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    castId: '',
    name: '',
    email: '',
    phone: '',
    desiredDateTime: '',
    usageStatus: '',
    meetingPlace: '',
    course: '',
    outfit: '',
    discount: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 合計情報を notes にまとめる
      const combinedNotes = `
【コース】: ${formData.course}
【利用状況】: ${formData.usageStatus}
【待ち合わせ】: ${formData.meetingPlace}
【服装】: ${formData.outfit}
【割引】: ${formData.discount}
【メッセージ】: ${formData.message}
      `.trim();

      const result = await createReservation({
        customerName: formData.name,
        dateTime: formData.desiredDateTime,
        visitCount: formData.usageStatus === 'first' ? 1 : 2,
        email: formData.email,
        phone: formData.phone,
        notes: combinedNotes,
        castId: formData.castId === 'free' ? undefined : formData.castId || undefined,
        storeId: store.id,
      });

      if (result.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error('エラーが発生しました。お電話またはLINEにてお問い合わせください。');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('予期せぬエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const lineHref =
    store.line_url ||
    (store.line_id ? `https://line.me/R/ti/p/${store.line_id.replace('@', '')}` : '#');
  const lineLabel = store.line_id
    ? store.line_id.startsWith('@')
      ? store.line_id
      : `@${store.line_id}`
    : '@example';
  const phoneHref = store.phone ? `tel:${store.phone}` : '#';
  const phoneLabel = store.phone || '03-XXXX-XXXX';
  const emailLabel = store.notification_email || 'contact@example.com';

  const receptionHours = storeConfig?.header?.receptionHours;
  const businessHours = storeConfig?.header?.businessHours;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-20 md:py-32">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border-2 border-rose-100 bg-white p-8 text-center shadow-2xl md:p-16">
            <div className="mb-8 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner">
                <CheckCircle className="h-16 w-16 duration-500 animate-in zoom-in" />
              </div>
            </div>

            <h1 className="mb-6 text-3xl font-black text-gray-800 md:text-4xl">
              ご予約リクエストを
              <br />
              承りました
            </h1>

            <div className="mb-10 space-y-4 text-left">
              <div className="flex items-start gap-4 rounded-2xl bg-rose-50/50 p-6">
                <MessageCircle className="h-6 w-6 shrink-0 text-rose-500" />
                <div>
                  <p className="font-bold text-gray-800">店舗からの連絡をお待ちください</p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    ご入力いただいた内容を確認後、店舗スタッフまたはキャストより折り返しご連絡を差し上げます。その連絡をもちまして予約確定となります。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-blue-50/50 p-6">
                <Mail className="h-6 w-6 shrink-0 text-blue-500" />
                <div>
                  <p className="font-bold text-gray-800">確認メールを送信しました</p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    ご入力いただいたメールアドレス宛に、自動返信の確認メールをお送りしました。届いていない場合は、迷惑メールフォルダをご確認いただくか、LINEまたはお電話にてお問い合わせください。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => router.push(`/store/${store.slug}`)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 py-5 text-lg font-black text-white shadow-xl transition-all hover:bg-rose-600 hover:shadow-2xl active:scale-95"
              >
                <Home className="h-5 w-5" />
                店舗トップへ戻る
              </button>

              <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
                <Clock className="h-4 w-4" />
                通常1時間以内に返信いたします
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-20 md:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2 text-white shadow-lg">
            <Calendar className="h-5 w-5" />
            <span className="font-bold">ご予約フォーム</span>
          </div>
          <h1 className="mb-4 text-3xl font-black leading-tight text-gray-800 md:text-5xl">
            {store.name}の
            <br className="md:hidden" />
            ご予約はこちら
          </h1>
          <p className="text-lg text-gray-600">
            ご予約は下記のフォームからお願いいたします。
            <br />
            直接お電話、LINEからの問い合わせも出来ます。
          </p>
        </div>

        {/* クイック連絡先 */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <a
            href={lineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-rose-50 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-green-400 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-500 transition-colors group-hover:bg-green-500 group-hover:text-white">
              <MessageCircle className="h-8 w-8" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-gray-400">LINE ID</span>
              <p className="text-lg font-black text-gray-700">{lineLabel}</p>
            </div>
          </a>

          <a
            href={phoneHref}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-rose-50 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-rose-400 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
              <Phone className="h-8 w-8" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-gray-400">TEL</span>
              <p className="text-lg font-black text-gray-700">{phoneLabel}</p>
            </div>
          </a>

          <div className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-rose-50 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-pink-400 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-500 transition-colors group-hover:bg-pink-500 group-hover:text-white">
              <Clock className="h-8 w-8" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-gray-400">受付時間</span>
              <p className="text-sm font-black text-gray-700">
                {receptionHours || 'お気軽にお電話ください'}
              </p>
            </div>
          </div>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border-2 border-rose-100 bg-white p-8 shadow-xl md:p-12"
        >
          <div className="space-y-6">
            {/* セラピスト選択 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-rose-500" />
                  セラピスト選択
                </div>
              </label>
              <select
                name="castId"
                value={formData.castId}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
              >
                <option value="">選択してください</option>
                <option value="free" className="font-bold text-rose-600">
                  ⭐ フリー（セラピストはお店におまかせ）
                </option>
                <Suspense fallback={<option disabled>読み込み中...</option>}>
                  <CastOptions promise={castsPromise} />
                </Suspense>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                💡 フリーをご選択いただくと、お店が最適なセラピストをご案内いたします
              </p>
            </div>

            {/* 合流時のお名前 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                合流時のお名前は？
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="山田 太郎（偽名OK）"
              />
              <p className="mt-1 text-xs text-gray-500">偽名OK</p>
            </div>

            {/* メールアドレス */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                ご連絡先メールアドレス
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="example@email.com"
              />
              <p className="mt-1 text-xs text-gray-500">半角英数</p>
            </div>

            {/* 電話番号 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">ご連絡先TEL</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="090-1234-5678"
              />
            </div>

            {/* ご利用希望日時 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <Clock className="h-4 w-4 text-rose-500" />
                ご利用希望日時
              </label>
              <textarea
                name="desiredDateTime"
                value={formData.desiredDateTime}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="例：第1希望 10/5 15時、第2希望 10/6 10時～17時"
              />
            </div>

            {/* 当店の利用状況 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                当店の利用状況
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <select
                name="usageStatus"
                value={formData.usageStatus}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
              >
                <option value="">選択して下さい</option>
                <option value="first">初めて</option>
                <option value="second">2回目</option>
                <option value="multiple">3回目以上</option>
              </select>
            </div>

            {/* 待ち合わせの場所 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <MapPin className="h-4 w-4 text-rose-500" />
                待ち合わせの場所は？
              </label>
              <input
                type="text"
                name="meetingPlace"
                value={formData.meetingPlace}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="例：新宿アルタ前、渋谷ラブホテル、鶯谷北口改札前"
              />
            </div>

            {/* 希望コース */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                希望コース
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
              >
                <option value="">選択して下さい</option>
                <option value="120min-first" className="font-bold text-rose-600">
                  ⭐ 初回限定120分コース（とてもお得！）
                </option>
                <option value="60min">60分コース</option>
                <option value="90min">90分コース</option>
                <option value="120min">120分コース</option>
                <option value="150min">150分コース</option>
                <option value="180min">180分コース</option>
              </select>
              <p className="mt-2 text-xs text-rose-600">
                💡 初回の方は初回限定120分コースがとてもお得です
              </p>
            </div>

            {/* 当日の服装 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">当日の服装は？</label>
              <input
                type="text"
                name="outfit"
                value={formData.outfit}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="例：赤いTシャツ、赤いスカート、赤いバック、赤い靴"
              />
              <p className="mt-1 text-xs text-gray-500">
                まだわからない方は分かり次第に教えてください
              </p>
            </div>

            {/* 割引き申請 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">割引き申請</label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="割引キャンペーン等をご利用の場合ご記入ください"
              />
            </div>

            {/* ご不明の点 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                ご不明の点、ご要望があればお書きください
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="例：タバコは吸われない方で。優しそうな方がいいです。"
              />
            </div>

            {/* 注意事項 */}
            <div className="rounded-2xl border-2 border-rose-50 bg-rose-50/50 p-6">
              <div className="mb-4 flex items-center gap-2 font-bold text-gray-800">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                注意事項
              </div>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>
                  ご希望の日時、コース等を確認後、担当者より折り返しご連絡を差し上げます。その連絡をもちまて予約確定となります。
                </li>
                <li>
                  お急ぎの場合や、直前のご予約はお電話（
                  <a href={phoneHref} className="font-bold text-rose-500 underline">
                    {phoneLabel}
                  </a>
                  ）またはLINEをご利用ください。
                </li>
                <li>無断キャンセルは、今後のご利用をお断りする場合がございます。</li>
              </ul>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-6 text-xl font-black text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Send className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                  予約をリクエストする
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
