import React from 'react';
import { CastProfile, CastSNS } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
}

export default function SnsInput({ form, onChange }: Props) {
  const sns: CastSNS = form.sns || {};

  const handleSnsChange = (key: keyof CastSNS, value: string) => {
    onChange('sns', { ...sns, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-[#06C755]">LINE URL</label>
        <input
          type="text"
          value={sns.line ?? ''}
          onChange={(e) => handleSnsChange('line', e.target.value)}
          className="w-full mt-1 border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://line.me/..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-black">X (旧Twitter) URL</label>
        <input
          type="text"
          value={sns.twitter ?? ''}
          onChange={(e) => handleSnsChange('twitter', e.target.value)}
          className="w-full mt-1 border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://x.com/..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-pink-600">Instagram URL</label>
        <input
          type="text"
          value={sns.instagram ?? ''}
          onChange={(e) => handleSnsChange('instagram', e.target.value)}
          className="w-full mt-1 border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://instagram.com/..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-black">TikTok URL</label>
        <input
          type="text"
          value={sns.tiktok ?? ''}
          onChange={(e) => handleSnsChange('tiktok', e.target.value)}
          className="w-full mt-1 border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://tiktok.com/@..."
        />
      </div>
      
      {/* 既存のURL用フォールバック */}
      <div className="pt-4 border-t border-neutral-100">
        <label className="block text-sm font-medium text-neutral-500">その他のリンク (Webサイト等)</label>
        <input
          type="text"
          value={form.snsUrl ?? ''}
          onChange={(e) => onChange('snsUrl', e.target.value)}
          className="w-full mt-1 border border-neutral-300 rounded-md px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
