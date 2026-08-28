'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { getStoreContactData, sendStoreInquiry } from '@/actions/store-contact';
import { stores } from '@/data/stores';
import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContactPage() {
  const { slug } = useParams();
  const store = stores[slug as string] || stores['fukuoka'];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    contactMethod: '',
    visitHistory: '',
    inquiryType: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    name: store.name || '',
    phone: store.phone || '',
    lineUrl: '',
    lineId: '',
    email: '',
  });

  useEffect(() => {
    if (slug) {
      getStoreContactData(slug as string).then((res) => {
        if (res.success && res.data) {
          setContactInfo({
            name: res.data.name || store.name,
            phone: res.data.phone || store.phone || '',
            lineUrl: res.data.lineUrl || '',
            lineId: res.data.lineId || '',
            email: res.data.email || '',
          });
        }
      });
    }
  }, [slug, store.name, store.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await sendStoreInquiry(slug as string, formData);
      if (result.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('送信に失敗しました: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('エラーが発生しました。時間をおいて再度お試しください。');
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

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-20">
        <div className="w-full max-w-lg rounded-3xl border-2 border-pink-100 bg-white p-12 text-center shadow-xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-black text-gray-800">
            送信が完了しました
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            お問い合わせありがとうございます。<br />
            内容を確認し次第、担当者よりご連絡させていただきます。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl"
          >
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        {/* ヘッダー */}
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-1.5 text-sm text-white shadow-md">
            <MessageCircle className="h-4 w-4" />
            <span className="font-bold">お問い合わせ</span>
          </div>
          <h1 className="mb-3 text-2xl font-black leading-tight text-gray-800 md:text-4xl">
            {contactInfo.name}に
            <br className="md:hidden" />
            お気軽にご質問ください
          </h1>
          <p className="text-sm font-medium text-gray-600 md:text-base">
            お問い合わせは下記のフォームからお願いいたします。
            <br />
            直接お電話、LINEからの問い合わせも出来ます。
          </p>
        </div>

        {/* 連絡先エリア */}
        <div className="mb-10 space-y-4">
          {/* 【最優先・横長全幅】LINE誘導バナー (A案: ポップ・親しみ系) */}
          {contactInfo.lineUrl && (
            <a
              href={contactInfo.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                try {
                  sendGAEvent('event', 'click_line_inquiry', {
                    store_slug: (slug as string) || 'unknown',
                    page_location: 'contact_page',
                  });
                } catch (e) {
                  console.error('GA event error:', e);
                }
              }}
              className="group relative flex w-full flex-col items-center justify-between gap-4 rounded-3xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 via-white to-emerald-500/10 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl sm:flex-row sm:p-6"
            >
              {/* アイコン & キャッチコピー */}
              <div className="mt-2 flex items-center gap-4 sm:mt-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-md transition-transform group-hover:scale-110">
                  <MessageCircle className="h-8 w-8 fill-current stroke-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                      24時間受付中
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {contactInfo.lineId ? `@${contactInfo.lineId.replace(/^@/, '')}` : '公式LINE'}
                    </span>
                  </div>
                  <div className="text-xl font-black text-emerald-900 md:text-2xl">
                    LINEで簡単お問い合わせ・ご予約
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    タップするだけで10秒でLINE友だち相談がスタートします
                  </div>
                </div>
              </div>

              {/* 誘導ボタン */}
              <div className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3.5 text-center text-sm font-black text-white shadow transition-all group-hover:from-emerald-600 group-hover:to-green-600 group-hover:shadow-md sm:w-auto">
                10秒でLINE相談する ▶
              </div>
            </a>
          )}

          {/* 下部サブ連絡先（電話 ＆ メール 2並列） */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* 電話カード */}
            <a
              href={`tel:${contactInfo.phone.replace(/-/g, '')}`}
              className="group flex items-center justify-between rounded-2xl border-2 border-pink-100 bg-white p-4 transition-all duration-300 hover:border-pink-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition-transform group-hover:scale-110">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">お電話でのご相談</div>
                  <div className="text-base font-bold text-gray-800">
                    {contactInfo.phone || 'お電話番号'}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600 transition-colors group-hover:bg-pink-100">
                電話をかける
              </div>
            </a>

            {/* メールカード */}
            <a
              href={`mailto:${contactInfo.email || ''}`}
              className="group flex items-center justify-between rounded-2xl border-2 border-blue-100 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">メールでのお問い合わせ</div>
                  <div className="text-xs font-bold text-gray-700 truncate max-w-[160px] sm:max-w-[200px]">
                    {contactInfo.email || 'メールフォーム'}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors group-hover:bg-blue-100">
                メールソフト起動
              </div>
            </a>
          </div>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border-2 border-pink-100 bg-white p-8 shadow-xl md:p-12"
        >
          <div className="space-y-6">
            {/* お名前 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                お名前（偽名OK）
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
                placeholder="山田 花子"
              />
            </div>

            {/* お電話番号 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">お電話番号</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
                placeholder="090-1234-5678"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                メールアドレス
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
                placeholder="example@email.com"
              />
              <p className="mt-1 text-xs text-gray-500">半角の英数字で入力してください</p>
            </div>

            {/* ご希望の連絡方法 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                ご希望の連絡方法
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
              >
                <option value="">選択してください</option>
                <option value="email">メール</option>
                <option value="phone">電話</option>
                <option value="line">LINE（友達追加をお願いします）</option>
                <option value="other">その他</option>
              </select>
            </div>

            {/* 当店のご利用は */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">当店のご利用は</label>
              <select
                name="visitHistory"
                value={formData.visitHistory}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
              >
                <option value="">選択してください</option>
                <option value="first">初めて</option>
                <option value="second">2回目</option>
                <option value="multiple">2回目以上</option>
              </select>
            </div>

            {/* お問合せ内容 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                お問合せ内容
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">必須</span>
              </label>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
              >
                <option value="">選択してください</option>
                <option value="reservation">ご予約</option>
                <option value="monitor">モニター</option>
                <option value="instructor">講師</option>
                <option value="collaboration">コラボ依頼</option>
                <option value="interview">取材依頼</option>
                <option value="other">その他</option>
              </select>
            </div>

            {/* ご質問・ご要望 */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">ご質問・ご要望</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-pink-400 focus:outline-none"
                placeholder="ご質問やご要望をご記入ください"
              />
            </div>

            {/* 注意事項 */}
            <div className="space-y-4 rounded-2xl bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="font-bold text-amber-800">※モニターを希望される方へ</p>
                  <p>上記をご記入ください。（上部に申し込みフォームがございます）</p>

                  <p className="font-bold text-amber-800">※講師を希望される方へ</p>
                  <p>下記採用基準を確認しご応募をお願い致します。</p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>アロママッサージ業</li>
                    <li>メンズエステ業</li>
                    <li>男性向け風俗業</li>
                  </ul>
                  <p className="text-xs">
                    上記業種にて講師または指導歴のある方
                    <br />
                    講師募集については、実務講師歴のあるプロの方からご指導頂き、当店セラピストの技術レベル向上を目的とするため、上記の項目に当てはまる方からのみの採用条件とさせて頂きます。
                    ご理解の程を宜しくお願い致します。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-bold text-blue-800">※ご注意点</p>
                  <p>
                    <span className="font-mono text-xs">
                      {contactInfo.email || 'contactsutoroberrys@gmail.com'}
                    </span>
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
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl disabled:opacity-70 disabled:grayscale"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
              {isSubmitting ? '送信中...' : '送信する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
