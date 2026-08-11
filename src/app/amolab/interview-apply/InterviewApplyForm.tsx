'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitInterviewApplication } from '@/lib/actions/interview';
import { toast } from 'sonner';

const formSchema = z.object({
  theme: z.string().min(1, '必須項目です').max(500, '500文字以内で入力してください'),
  usage_period: z.string().min(1, '必須項目です'),
  interview_method: z.string().min(1, '必須項目です'),
  contact_info: z.string().min(1, '必須項目です'),
  agreements: z.array(z.boolean()).length(3).refine(arr => arr.every(Boolean), {
    message: '全ての項目に同意する必要があります',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function InterviewApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: '',
      usage_period: '',
      interview_method: '',
      contact_info: '',
      agreements: [false, false, false],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await submitInterviewApplication(data);
      if (res.success) {
        setIsSuccess(true);
        toast.success('応募が完了しました');
      } else {
        toast.error(res.error || 'エラーが発生しました');
      }
    } catch (err) {
      toast.error('通信エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-2xl md:p-12 text-center max-w-2xl mx-auto border border-rose-100">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">ご応募ありがとうございます</h2>
        <p className="text-slate-600 leading-relaxed">
          送信が完了しました。<br />
          内容を確認の上、担当ライター（イトウ）よりご連絡させていただきます。
        </p>
        <div className="mt-8">
          <a href="/amolab" className="text-rose-500 hover:text-rose-600 underline font-medium">
            アモラボのトップへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-rose-50 p-8 md:p-12 border-b border-rose-100">
        <p className="text-slate-700 leading-relaxed md:text-lg">
          ストロベリーボーイズでは、実際にご利用いただいたお客様の体験談をメディア「アモラボ」で公開しています。「興味はあるけど怖い」と迷っていた頃の気持ち、予約までの葛藤、当日のこと——あなたの体験が、いま迷っている誰かの安心材料になります。
        </p>
        <p className="text-slate-700 leading-relaxed md:text-lg mt-4">
          ご協力いただける方に、ライターのイトウがインタビューをさせていただきます。<span className="font-bold text-rose-600">LINEやメールでのテキストのやり取りでOK(通話不要)、匿名OKです。</span>お名前や身元が分かる情報が記事に載ることはありません。記事は公開前に必ず全文をご確認いただき、OKをいただいた場合のみ公開します。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-10">
        
        {/* Theme */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            どんな体験についてお話しいただけますか？ <span className="text-rose-500 text-xs ml-2 bg-rose-50 px-2 py-1 rounded">必須</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">※例:「初めて利用したときのこと」「◯回利用してみて変わったこと」など、ざっくりで大丈夫です</p>
          <textarea
            {...register('theme')}
            rows={4}
            className={`w-full rounded-xl border p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow ${errors.theme ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            placeholder="ここに内容を入力してください"
          />
          {errors.theme && <p className="mt-2 text-sm text-red-500">{errors.theme.message}</p>}
        </div>

        {/* Usage Period */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            ご利用いただいたのはいつ頃ですか？ <span className="text-rose-500 text-xs ml-2 bg-rose-50 px-2 py-1 rounded">必須</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['3ヶ月以内', '半年以内', '1年以内', '1年以上前'].map(option => (
              <label key={option} className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" value={option} {...register('usage_period')} className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500" />
                <span className="ml-3 text-slate-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
          {errors.usage_period && <p className="mt-2 text-sm text-red-500">{errors.usage_period.message}</p>}
        </div>

        {/* Interview Method */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            インタビューの方法はどれがよいですか？ <span className="text-rose-500 text-xs ml-2 bg-rose-50 px-2 py-1 rounded">必須</span>
          </label>
          <div className="space-y-3">
            {['LINEなどのテキストで', 'メールで', '通話でもOK', 'まずは話を聞いてから決めたい'].map(option => (
              <label key={option} className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" value={option} {...register('interview_method')} className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500" />
                <span className="ml-3 text-slate-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
          {errors.interview_method && <p className="mt-2 text-sm text-red-500">{errors.interview_method.message}</p>}
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            ご連絡先 (LINE ID またはメールアドレス) <span className="text-rose-500 text-xs ml-2 bg-rose-50 px-2 py-1 rounded">必須</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">※インタビューのご連絡のみに使用し、記事には一切掲載しません</p>
          <input
            type="text"
            {...register('contact_info')}
            className={`w-full rounded-xl border p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow ${errors.contact_info ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            placeholder="LINE ID や メールアドレスをご記入ください"
          />
          {errors.contact_info && <p className="mt-2 text-sm text-red-500">{errors.contact_info.message}</p>}
        </div>

        {/* Agreements */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <label className="block text-sm font-bold text-slate-900 mb-4">
            同意事項 <span className="text-rose-500 text-xs ml-2 bg-rose-50 px-2 py-1 rounded">全て必須</span>
          </label>
          <div className="space-y-4">
            <label className="flex items-start cursor-pointer group">
              <div className="flex items-center h-5 mt-1">
                <input type="checkbox" {...register('agreements.0')} className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
              </div>
              <span className="ml-3 text-slate-700 text-sm md:text-base group-hover:text-slate-900 transition-colors">私は18歳以上です</span>
            </label>
            <label className="flex items-start cursor-pointer group">
              <div className="flex items-center h-5 mt-1">
                <input type="checkbox" {...register('agreements.1')} className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
              </div>
              <span className="ml-3 text-slate-700 text-sm md:text-base group-hover:text-slate-900 transition-colors">記事は編集のうえ掲載されること、公開前に全文を確認できることを理解しました</span>
            </label>
            <label className="flex items-start cursor-pointer group">
              <div className="flex items-center h-5 mt-1">
                <input type="checkbox" {...register('agreements.2')} className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
              </div>
              <span className="ml-3 text-slate-700 text-sm md:text-base group-hover:text-slate-900 transition-colors">個人が特定される情報(本名・勤務先など)は記事に掲載されないことを確認しました</span>
            </label>
          </div>
          {errors.agreements && <p className="mt-4 text-sm text-red-500 font-bold">{errors.agreements.message}</p>}
        </div>

        {/* Submit */}
        <div className="pt-6 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto inline-flex justify-center items-center px-12 py-5 border border-transparent text-lg font-black rounded-full shadow-lg text-white bg-slate-900 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                送信中...
              </>
            ) : (
              '同意して応募する'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
