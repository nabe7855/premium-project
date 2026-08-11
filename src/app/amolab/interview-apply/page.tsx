import { Metadata } from 'next';
import InterviewApplyForm from './InterviewApplyForm';

export const metadata: Metadata = {
  title: 'あなたの体験、聞かせてください｜ストロベリーボーイズ体験談インタビュー',
  description: 'ストロベリーボーイズではお客様のリアルな体験談を募集しています。非同期のテキストインタビューで匿名OK。',
};

export default function InterviewApplyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          あなたの体験、<br className="md:hidden" />聞かせてください
        </h1>
        <p className="text-slate-500 font-medium tracking-widest text-sm">
          INTERVIEW APPLICATION
        </p>
      </div>
      <InterviewApplyForm />
    </div>
  );
}
