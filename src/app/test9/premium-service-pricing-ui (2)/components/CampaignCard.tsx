
import React from 'react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="bg-white border border-rose-100 rounded-sm overflow-hidden flex flex-col relative h-full shadow-sm">
      {/* Image Area - Stylized as in the reference */}
      <div className="relative aspect-[16/9] overflow-hidden bg-rose-900 group">
        <img 
          src={campaign.imageUrl} 
          alt="" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-white text-xs font-bold mb-1 tracking-wider">{campaign.accentText}</p>
          <h4 className="text-white text-xl md:text-2xl font-black leading-tight mb-2 drop-shadow-lg">
            {campaign.priceInfo && <span className="block text-rose-400 text-3xl mb-1">{campaign.priceInfo}</span>}
            {campaign.title.split('！')[0]}
          </h4>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm text-rose-900 font-bold leading-relaxed mb-4">
          {campaign.title}
        </p>
        <p className="text-[11px] text-rose-400 leading-relaxed mb-4">
          {campaign.description}
        </p>

        {campaign.needEntry && (
          <div className="mt-auto">
            <span className="inline-block bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-1">
              要エントリー
            </span>
          </div>
        )}
      </div>

      {/* Decorative corner triangle as seen in image */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[12px] border-t-transparent border-r-[12px] border-r-rose-500"></div>
    </div>
  );
};

export default CampaignCard;
