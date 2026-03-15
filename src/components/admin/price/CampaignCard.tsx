import React from 'react';
import { Campaign } from './types';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50">
      {campaign.imageUrl && (
        <div className="relative h-40">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          {campaign.accentText && (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              {campaign.accentText}
            </span>
          )}
          {campaign.priceInfo && (
            <span className="text-lg font-black text-rose-500">
              {campaign.priceInfo}
            </span>
          )}
        </div>
        <h3 className="font-rounded mb-2 text-lg font-bold text-rose-900">
          {campaign.title}
        </h3>
        {campaign.description && (
          <p className="text-sm text-rose-600">{campaign.description}</p>
        )}
        {campaign.needEntry && (
          <div className="mt-4">
            <span className="inline-block bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600">
              要エントリー
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
