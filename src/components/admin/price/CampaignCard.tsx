import React from 'react';
import { Campaign } from './types';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-rose-100 bg-white shadow-sm">
      {/* Image Area - Stylized as in the reference */}
      <div className="group relative aspect-[16/9] overflow-hidden bg-rose-900">
        <img
          src={campaign.imageUrl}
          alt=""
          className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <p className="mb-1 text-xs font-bold tracking-wider text-white">{campaign.accentText}</p>
          <h4 className="mb-2 text-xl font-black leading-tight text-white drop-shadow-lg md:text-2xl">
            {campaign.priceInfo && (
              <span className="mb-1 block text-3xl text-rose-400">{campaign.priceInfo}</span>
            )}
            {campaign.title.split('！')[0]}
          </h4>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-grow flex-col p-4">
        <p className="mb-4 text-sm font-bold leading-relaxed text-rose-900">{campaign.title}</p>
        <p className="mb-4 text-[11px] leading-relaxed text-rose-400">{campaign.description}</p>

        {campaign.needEntry && (
          <div className="mt-auto">
            <span className="inline-block bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600">
              要エントリー
            </span>
          </div>
        )}
      </div>

      {/* Decorative corner triangle as seen in image */}
      <div className="absolute bottom-0 right-0 h-0 w-0 border-r-[12px] border-t-[12px] border-r-rose-500 border-t-transparent"></div>
    </div>
  );
};

export default CampaignCard;
