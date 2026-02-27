'use client';

import { Cast } from '@/types/cast';
import {
  AlertCircle,
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

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
  casts: Cast[];
}

export default function ReservationPageClient({
  store,
  storeConfig,
  casts,
}: ReservationPageClientProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reservation submitted:', formData);
    alert('予約が送信されました（シミュレーション）');
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

        {/* 連絡先カード */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <a
            href={phoneHref}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-rose-100 bg-white p-6 transition-all hover:border-rose-300 hover:shadow-lg"
          >
            <div className="rounded-full bg-gradient-to-br from-rose-100 to-pink-100 p-4 transition-transform group-hover:scale-110">
              <Phone className="h-6 w-6 text-rose-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">お電話</div>
              <div className="text-lg font-bold text-gray-800">{phoneLabel}</div>
              {receptionHours && (
                <div className="mt-0.5 text-[10px] text-rose-500">受付: {receptionHours}</div>
              )}
              {businessHours && (
                <div className="text-[10px] text-gray-500">営業: {businessHours}</div>
              )}
            </div>
          </a>

          <a
            href={lineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-green-100 bg-white p-6 transition-all hover:border-green-300 hover:shadow-lg"
          >
            <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-4 transition-transform group-hover:scale-110">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">LINE</div>
              <div className="text-lg font-bold text-gray-800">{lineLabel}</div>
            </div>
          </a>

          <a
            href={store.notification_email ? `mailto:${store.notification_email}` : '#'}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-blue-100 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-4 transition-transform group-hover:scale-110">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">メール</div>
              <div className="text-sm font-bold text-gray-800">{emailLabel}</div>
            </div>
          </a>
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
                <optgroup label="━━━ セラピスト指名 ━━━">
                  {casts.map((cast) => (
                    <option key={cast.id} value={cast.id}>
                      {cast.name}
                      {cast.age ? ` (${cast.age}歳)` : ''}
                      {cast.isNewcomer ? ' 🆕新人' : ''}
                    </option>
                  ))}
                </optgroup>
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
                何かご不明の点はございましたらご記入ください。
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-rose-400 focus:outline-none"
                placeholder="ご質問やご要望をご記入ください"
              />
            </div>

            {/* 注意事項 */}
            <div className="rounded-2xl bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-bold text-blue-800">※ご注意点</p>
                  <p>
                    <span className="font-mono text-xs">{emailLabel}</span>
                    こちらのアドレスからメールが届きます。
                  </p>
                  <p>
                    営業時間内に１時間以上返信がない方は「迷惑メール」フォルダに振り分けられている可能性が考えられますのでご確認をお願いします。
                  </p>
                  <p>
                    それでも確認が出来ない場合は、お手数ですが別のメールアドレスで再度お申し込みを頂くか、LINE、お電話でお問い合わせを下さいませ。
                  </p>
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl"
            >
              <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              予約を送信する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
