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
      <div className="space-y-3">
        {serviceOptions.map((service) => (
          <div key={service} className="flex items-center gap-3">
            <span className="w-48 text-sm">{service}</span>
            <div className="flex gap-2">
              {serviceLevels.map((level) => {
                const isSelected = services[service] === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange(service, level)}
                    className={`px-3 py-1 rounded-full border text-xs transition ${
                      isSelected
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
