import { FlowConfig } from '@/lib/store/storeTopConfig';
import { Calendar, ChevronRight, Heart, MapPin, User } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';
import StepCard from '../components/StepCard';

interface FlowSectionProps {
  config?: FlowConfig;
}

const FlowSection: React.FC<FlowSectionProps> = ({ config }) => {
  return (
    <section id="flow" className="relative bg-white py-16 md:py-24">
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#fce7f3_0.8px,transparent_0.8px)] opacity-30 [background-size:24px_24px]"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionTitle en="Guide" ja="ご利用までのステップ" />
        <div className="flex flex-col items-stretch justify-center gap-6 md:flex-row lg:gap-8">
          <StepCard
            num={1}
            icon={<User size={28} />}
            title="キャスト選択"
            desc="当サイトのプロフィールを参考に、お気に入りのセラピストを選びます。"
          />
          <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
            <ChevronRight size={24} />
          </div>
          <StepCard
            num={2}
            icon={<Calendar size={28} />}
            title="ご予約確定"
            desc="WEBまたはLINEで簡単予約。場所と時間を伝えて、予約完了です。"
          />
          <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
            <ChevronRight size={24} />
          </div>
          <StepCard
            num={3}
            icon={<MapPin size={28} />}
            title="ご訪問"
            desc="セラピストが到着しましたら、簡単なカウンセリングを行います。"
          />
          <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
            <ChevronRight size={24} />
          </div>
          <StepCard
            num={4}
            icon={<Heart size={28} />}
            title="施術開始"
            desc="最高のリラクゼーションをご堪能ください。お支払いは事前精算です。"
          />
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
