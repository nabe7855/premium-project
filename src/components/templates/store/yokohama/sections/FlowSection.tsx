import { FlowConfig } from '@/lib/store/storeTopConfig';
import { Calendar, ChevronRight, Heart, MapPin, User } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';
import StepCard from '../components/StepCard';

interface FlowSectionProps {
  config?: FlowConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const FlowSection: React.FC<FlowSectionProps> = ({ isEditing }) => {
  return (
    <section id="flow" className="relative bg-white py-16 md:py-24">
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#fce7f3_0.8px,transparent_0.8px)] opacity-30 [background-size:24px_24px]"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle en="Service Flow" ja="ご利用の流れ" />
        {isEditing && (
          <div className="border-primary-200 bg-primary-50 text-primary-600 mb-8 rounded border p-2 text-center text-xs">
            ※ ご利用の流れの編集は現在管理画面のフォームからのみ可能です
          </div>
        )}
        <div className="flex flex-col items-stretch justify-center gap-6 md:flex-row lg:gap-8">
          <StepCard
            num={1}
            icon={<User size={28} />}
            imageSrc="/ご利用までのステップ１.jpg"
            title="キャスト選択"
            desc="当サイトのプロフィールを参考に、お気に入りのセラピストを選びます。"
          />
          <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
            <ChevronRight size={24} />
          </div>
          <StepCard
            num={2}
            icon={<Calendar size={28} />}
            imageSrc="/ご利用までのステップ２.jpg"
            title="ご予約確定"
            desc="WEBまたはLINEで簡単予約。場所と時間を伝えて、予約完了です。"
          />
          <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
            <ChevronRight size={24} />
          </div>
          <StepCard
            num={3}
            icon={<MapPin size={28} />}
            imageSrc="/ご利用までのステップ３.jpg"
            title="ご訪問"
            desc="セラピストが到着しましたら、簡単なカウンセリングを行います。"
          />
          <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
            <ChevronRight size={24} />
          </div>
          <StepCard
            num={4}
            icon={<Heart size={28} />}
            imageSrc="/ご利用までのステップ４.jpg"
            title="施術開始"
            desc="最高のリラクゼーションをご堪能ください。お支払いは事前精算です。"
          />
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
