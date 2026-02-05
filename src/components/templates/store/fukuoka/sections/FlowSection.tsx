import { Calendar, ChevronRight, Heart, MapPin, User } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';
import StepCard from '../components/StepCard';

import { FlowConfig } from '@/lib/store/storeTopConfig';

const defaultSteps = [
  {
    title: 'キャスト選択',
    desc: '当サイトのプロフィールを参考に、お気に入りのセラピストを選びます。',
    icon: 'User',
    image: '/images/flow/ご利用までのステップ１.jpg',
  },
  {
    title: 'ご予約確定',
    desc: 'WEBまたはLINEで簡単予約。場所と時間を伝えて、予約完了です。',
    icon: 'Calendar',
    image: '/images/flow/ご利用までのステップ２.jpg',
  },
  {
    title: 'ご訪問',
    desc: 'セラピストが到着しましたら、簡単なカウンセリングを行います。',
    icon: 'MapPin',
    image: '/images/flow/ご利用までのステップ３.jpg',
  },
  {
    title: '施術開始',
    desc: '最高のリラクゼーションをご堪能ください。お支払いは事前精算です。',
    icon: 'Heart',
    image: '/images/flow/ご利用までのステップ４.jpg',
  },
];

interface FlowSectionProps {
  config?: FlowConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'User':
      return <User size={28} />;
    case 'Calendar':
      return <Calendar size={28} />;
    case 'MapPin':
      return <MapPin size={28} />;
    case 'Heart':
      return <Heart size={28} />;
    default:
      return <User size={28} />;
  }
};

const FlowSection: React.FC<FlowSectionProps> = ({ config, isEditing, onUpdate }) => {
  const steps = config?.steps || defaultSteps;

  const stepImages = [
    '/images/flow/ご利用までのステップ１.jpg',
    '/images/flow/ご利用までのステップ２.jpg',
    '/images/flow/ご利用までのステップ３.jpg',
    '/images/flow/ご利用までのステップ４.jpg',
  ];

  const handleStepUpdate = (index: number, key: string, value: string) => {
    if (onUpdate) {
      const newSteps = [...steps];
      newSteps[index] = { ...newSteps[index], [key]: value };
      onUpdate('flow', 'steps', newSteps);
    }
  };

  return (
    <section id="flow" className="relative bg-white py-16 md:py-24">
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#fce7f3_0.8px,transparent_0.8px)] opacity-30 [background-size:24px_24px]"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionTitle
          en={config?.subHeading || 'Guide'}
          ja={config?.heading || 'ご利用までのステップ'}
        />
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row lg:gap-8">
          {steps.map((step: any, idx: number) => (
            <React.Fragment key={idx}>
              <StepCard
                num={idx + 1}
                icon={getIcon(step.icon)}
                imageSrc={step.image || stepImages[idx]}
                title={
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleStepUpdate(idx, 'title', e.currentTarget.innerText)}
                    className={isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}
                  >
                    {step.title}
                  </span>
                }
                desc={
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleStepUpdate(idx, 'desc', e.currentTarget.innerText)}
                    className={isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}
                  >
                    {step.desc}
                  </span>
                }
              />
              {idx < steps.length - 1 && (
                <div className="text-primary-200 flex rotate-90 items-center justify-center py-2 md:rotate-0">
                  <ChevronRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
