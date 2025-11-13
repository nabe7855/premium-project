'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, MessageCircle, Calendar, Heart } from 'lucide-react';

interface FormData {
  name: string;
  age: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  schedule: string;
  contactMethod: string;
  privacy: boolean;
}

const ApplicationForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [contactType, setContactType] = useState<'application' | 'consultation'>('consultation');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="contact" className="bg-gradient-to-b from-pink-50 to-purple-50 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-3xl bg-white p-6 shadow-lg lg:p-8">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h2 className="mb-4 font-rounded text-2xl font-bold text-gray-800 lg:text-3xl">
                お問い合わせありがとうございます
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 lg:text-base">
                {contactType === 'application'
                  ? '応募フォームを受け付けました。48時間以内に担当者よりご連絡差し上げます。'
                  : '相談フォームを受け付けました。24時間以内に女性スタッフよりご連絡差し上げます。'}
              </p>
              <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>現在○名の方が応募検討中</strong>
                  <br />
                  今月の応募者数: 23名
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="w-full rounded-full bg-pink-500 px-8 py-3 text-white transition-colors hover:bg-pink-600 sm:w-auto"
              >
                もう一度フォームを見る
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-gradient-to-b from-pink-50 to-purple-50 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center lg:mb-12">
          <h2 className="mb-4 font-rounded text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            応募・お問い合わせ
          </h2>
          <p className="font-serif text-lg text-gray-600 lg:text-xl">
            あなたの新しいスタートをサポートします
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <button
              onClick={() => setContactType('consultation')}
              className={`rounded-xl border-2 p-4 transition-all lg:p-6 ${
                contactType === 'consultation'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-pink-300'
              }`}
            >
              <MessageCircle className="mx-auto mb-3 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <h3 className="mb-2 text-base font-semibold text-gray-800 lg:text-lg">
                気軽に相談してみる
              </h3>
              <p className="text-xs text-gray-600 lg:text-sm">まずは話を聞いてみたい方</p>
            </button>
            <button
              onClick={() => setContactType('application')}
              className={`rounded-xl border-2 p-4 transition-all lg:p-6 ${
                contactType === 'application'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-pink-300'
              }`}
            >
              <Send className="mx-auto mb-3 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <h3 className="mb-2 text-base font-semibold text-gray-800 lg:text-lg">
                応募フォームへ進む
              </h3>
              <p className="text-xs text-gray-600 lg:text-sm">すぐに応募したい方</p>
            </button>
            <button className="rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:border-pink-300 lg:p-6">
              <Calendar className="mx-auto mb-3 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <h3 className="mb-2 text-base font-semibold text-gray-800 lg:text-lg">
                面接日程を確認
              </h3>
              <p className="text-xs text-gray-600 lg:text-sm">面接可能日時を確認</p>
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    お名前（ニックネーム可）<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'お名前を入力してください' })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="例：山田 花子"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    年齢<span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('age', { required: '年齢を選択してください' })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">選択してください</option>
                    {Array.from({ length: 30 }, (_, i) => i + 18).map((age) => (
                      <option key={age} value={age}>
                        {age}歳
                      </option>
                    ))}
                  </select>
                  {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    メールアドレス<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'メールアドレスを入力してください',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: '正しいメールアドレスを入力してください',
                      },
                    })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">電話番号</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  経験について
                </label>
                <select
                  {...register('experience')}
                  className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">選択してください</option>
                  <option value="未経験">未経験</option>
                  <option value="経験あり">経験あり</option>
                  <option value="他業種経験">他業種経験あり</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  希望する勤務スケジュール
                </label>
                <select
                  {...register('schedule')}
                  className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">選択してください</option>
                  <option value="平日昼間">平日昼間</option>
                  <option value="平日夜間">平日夜間</option>
                  <option value="週末">週末</option>
                  <option value="相談して決めたい">相談して決めたい</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  応募動機・質問など
                </label>
                <textarea
                  {...register('motivation')}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="応募理由や質問があればお書きください"
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  希望する連絡方法
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...register('contactMethod')}
                      value="email"
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm">メール</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...register('contactMethod')}
                      value="phone"
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm">電話</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...register('contactMethod')}
                      value="line"
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm">LINE</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('privacy', { required: 'プライバシーポリシーに同意してください' })}
                    className="mt-1 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    <a href="#" className="text-pink-500 hover:underline">
                      プライバシーポリシー
                    </a>
                    に同意します<span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.privacy && (
                  <p className="mt-1 text-sm text-red-500">{errors.privacy.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-pink-500 py-4 text-lg font-semibold text-white transition-colors hover:bg-pink-600"
              >
                {contactType === 'application' ? '応募する' : '相談する'}
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-xl bg-white p-4 shadow-sm lg:p-6">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
              リアルタイム情報
            </h3>
            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
              <div className="rounded-lg bg-pink-50 p-4">
                <div className="text-xl font-bold text-pink-600 lg:text-2xl">12名</div>
                <div className="text-xs text-gray-600 lg:text-sm">現在応募検討中</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-xl font-bold text-blue-600 lg:text-2xl">23名</div>
                <div className="text-xs text-gray-600 lg:text-sm">今月の応募者数</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-xl font-bold text-green-600 lg:text-2xl">3日</div>
                <div className="text-xs text-gray-600 lg:text-sm">平均面接予約日数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationForm;
