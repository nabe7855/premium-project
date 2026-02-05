import React from 'react';

interface StepCardProps {
  num: number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  desc: React.ReactNode;
  imageSrc?: string;
}

const StepCard: React.FC<StepCardProps> = ({ num, icon, title, desc, imageSrc }) => (
  <div className="relative flex w-full flex-col items-center md:w-64">
    <div className="z-10 flex h-full w-full flex-col items-center rounded-2xl border border-neutral-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="from-primary-400 to-primary-500 absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br font-serif font-bold text-white shadow-sm">
        {num}
      </div>
      {imageSrc ? (
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
          <img src={imageSrc} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="text-primary-500 bg-primary-50 mb-4 rounded-full p-4">{icon}</div>
      )}
      <h3 className="mb-2 text-lg font-bold text-slate-700">{title}</h3>
      <p className="w-full text-left text-sm leading-relaxed text-slate-500 md:text-center">
        {desc}
      </p>
    </div>
  </div>
);

export default StepCard;
