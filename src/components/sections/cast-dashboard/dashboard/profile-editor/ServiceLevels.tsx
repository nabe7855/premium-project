import React from 'react';
import { CastProfile } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

const serviceOptions = [
  'アイラインタッチなし', 'ドMコース', '洗体コース', 'デート', 'お泊り', '添い寝',
  '3P(女性二人◯,セラピスト2人×)', 'キス', 'クンニ', 'フェラ', '手コキ',
  'モノ鑑賞', '全身リップ', '乳首舐め', 'アナル舐め', '指入れ', 'Gスポット',
  'ポルチオ', 'パウダー性感', 'ソフトSM', 'おもちゃプレイ',
  '指圧マッサージ', 'オイルマッサージ',
];

const serviceLevels: Array<'NG' | '要相談' | '普通' | '得意'> = [
  'NG',
  '要相談',
  '普通',
  '得意',
];

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
}

export default function ServiceLevels({ form, onChange }: Props) {
  const services = form.services ?? {};

  const handleChange = (service: string, level: 'NG' | '要相談' | '普通' | '得意') => {
    onChange('services', { ...services, [service]: level });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">施術内容（4段階）</label>
      <div className="space-y-4">
        {serviceOptions.map((service) => (
          <div key={service} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-3 last:border-0">
            <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:w-48 shrink-0">{service}</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {serviceLevels.map((level) => {
                const isSelected = services[service] === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange(service, level)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
