'use client';

import { getStoreContactData } from '@/actions/store-contact';
import { stores } from '@/data/stores';
import { AlertCircle, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContactPage() {
  const { slug } = useParams();
  const store = stores[slug as string] || stores['tokyo'];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    contactMethod: '',
    visitHistory: '',
    inquiryType: '',
    message: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム送信処理（実装は後で）
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20 md:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 text-white shadow-lg">
            <MessageCircle className="h-5 w-5" />
            <span className="font-bold">お問い合わせ</span>
          </div>
          <h1 className="mb-4 text-3xl font-black leading-tight text-gray-800 md:text-5xl">
            {contactInfo.name}に
            <br className="md:hidden" />
            お気軽にご質問ください
          </h1>
          <p className="text-lg text-gray-600">
            お問い合わせは下記のフォームからお願いいたします。
            <br />
            直接お電話、LINEからの問い合わせも出来ます。
          </p>
        </div>

        {/* 連絡先カード */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <a
            href={`tel:${contactInfo.phone.replace(/-/g, '')}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-pink-100 bg-white p-6 transition-all hover:border-pink-300 hover:shadow-lg"
          >
            <div className="rounded-full bg-gradient-to-br from-pink-100 to-rose-100 p-4 transition-transform group-hover:scale-110">
              <Phone className="h-6 w-6 text-pink-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">お電話</div>
              <div className="text-lg font-bold text-gray-800">
                {contactInfo.phone || '03-XXXX-XXXX'}
              </div>
            </div>
          </a>

          <a
            href={contactInfo.lineUrl || 'https://line.me'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-green-100 bg-white p-6 transition-all hover:border-green-300 hover:shadow-lg"
          >
            <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-4 transition-transform group-hover:scale-110">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">LINE</div>
              <div className="text-lg font-bold text-gray-800">
                {contactInfo.lineId || '@strawberryboys'}
              </div>
            </div>
          </a>
          <a
            href={`mailto:${contactInfo.email || 'contactsutoroberrys@gmail.com'}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-blue-100 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-4 transition-transform group-hover:scale-110">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">メール</div>
              <div className="text-sm font-bold text-gray-800">
                {contactInfo.email ? contactInfo.email.split('@')[0] + '@' : 'contact@'}
              </div>
            </div>
          </a>
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
                    <span className="font-mono text-xs">contactsutoroberrys@gmail.com</span>
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
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
            >
              <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              送信する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
