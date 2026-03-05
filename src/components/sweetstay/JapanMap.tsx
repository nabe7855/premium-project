'use client';

import { RegionId } from '@/types/lovehotels';
import React, { useEffect, useState } from 'react';
import { DETAILED_MAP_DATA } from './MapData';

export interface Prefecture {
  code: string;
  name: string;
  en: string;
  id: string; // slug
}

export interface Region {
  id: RegionId;
  name: string;
  prefs: string[];
  prefectures: Prefecture[];
}

export const REGIONS_DATA: Region[] = [
  {
    id: 'hokkaido',
    name: '北海道',
    prefs: ['01'],
    prefectures: [{ code: '01', name: '北海道', en: 'Hokkaido', id: 'hokkaido' }],
  },
  {
    id: 'tohoku',
    name: '東北',
    prefs: ['02', '03', '04', '05', '06', '07'],
    prefectures: [
      { code: '02', name: '青森県', en: 'Aomori', id: 'aomori' },
      { code: '03', name: '岩手県', en: 'Iwate', id: 'iwate' },
      { code: '04', name: '宮城県', en: 'Miyagi', id: 'miyagi' },
      { code: '05', name: '秋田県', en: 'Akita', id: 'akita' },
      { code: '06', name: '山形県', en: 'Yamagata', id: 'yamagata' },
      { code: '07', name: '福島県', en: 'Fukushima', id: 'fukushima' },
    ],
  },
  {
    id: 'kanto',
    name: '関東',
    prefs: ['08', '09', '10', '11', '12', '13', '14'],
    prefectures: [
      { code: '08', name: '茨城県', en: 'Ibaraki', id: 'ibaraki' },
      { code: '09', name: '栃木県', en: 'Tochigi', id: 'tochigi' },
      { code: '10', name: '群馬県', en: 'Gumma', id: 'gumma' },
      { code: '11', name: '埼玉県', en: 'Saitama', id: 'saitama' },
      { code: '12', name: '千葉県', en: 'Chiba', id: 'chiba' },
      { code: '13', name: '東京都', en: 'Tokyo', id: 'tokyo' },
      { code: '14', name: '神奈川県', en: 'Kanagawa', id: 'kanagawa' },
    ],
  },
  {
    id: 'chubu',
    name: '中部',
    prefs: ['15', '16', '17', '18', '19', '20', '21', '22', '23'],
    prefectures: [
      { code: '15', name: '新潟県', en: 'Niigata', id: 'niigata' },
      { code: '16', name: '富山県', en: 'Toyama', id: 'toyama' },
      { code: '17', name: '石川県', en: 'Ishikawa', id: 'ishikawa' },
      { code: '18', name: '福井県', en: 'Fukui', id: 'fukui' },
      { code: '19', name: '山梨県', en: 'Yamanashi', id: 'yamanashi' },
      { code: '20', name: '長野県', en: 'Nagano', id: 'nagano' },
      { code: '21', name: '岐阜県', en: 'Gifu', id: 'gifu' },
      { code: '22', name: '静岡県', en: 'Shizuoka', id: 'shizuoka' },
      { code: '23', name: '愛知県', en: 'Aichi', id: 'aichi' },
    ],
  },
  {
    id: 'kansai',
    name: '関西',
    prefs: ['24', '25', '26', '27', '28', '29', '30'],
    prefectures: [
      { code: '24', name: '三重県', en: 'Mie', id: 'mie' },
      { code: '25', name: '滋賀県', en: 'Shiga', id: 'shiga' },
      { code: '26', name: '京都府', en: 'Kyoto', id: 'kyoto' },
      { code: '27', name: '大阪府', en: 'Osaka', id: 'osaka' },
      { code: '28', name: '兵庫県', en: 'Hyogo', id: 'hyogo' },
      { code: '29', name: '奈良県', en: 'Nara', id: 'nara' },
      { code: '30', name: '和歌山県', en: 'Wakayama', id: 'wakayama' },
    ],
  },
  {
    id: 'chugoku',
    name: '中国',
    prefs: ['31', '32', '33', '34', '35'],
    prefectures: [
      { code: '31', name: '鳥取県', en: 'Tottori', id: 'tottori' },
      { code: '32', name: '島根県', en: 'Shimane', id: 'shimane' },
      { code: '33', name: '岡山県', en: 'Okayama', id: 'okayama' },
      { code: '34', name: '広島県', en: 'Hiroshima', id: 'hiroshima' },
      { code: '35', name: '山口県', en: 'Yamaguchi', id: 'yamaguchi' },
    ],
  },
  {
    id: 'shikoku',
    name: '四国',
    prefs: ['36', '37', '38', '39'],
    prefectures: [
      { code: '36', name: '徳島県', en: 'Tokushima', id: 'tokushima' },
      { code: '37', name: '香川県', en: 'Kagawa', id: 'kagawa' },
      { code: '38', name: '愛媛県', en: 'Ehime', id: 'ehime' },
      { code: '39', name: '高知県', en: 'Kochi', id: 'kochi' },
    ],
  },
  {
    id: 'kyushu',
    name: '九州',
    prefs: ['40', '41', '42', '43', '44', '45', '46', '47'],
    prefectures: [
      { code: '40', name: '福岡県', en: 'Fukuoka', id: 'fukuoka' },
      { code: '41', name: '佐賀県', en: 'Saga', id: 'saga' },
      { code: '42', name: '長崎県', en: 'Nagasaki', id: 'nagasaki' },
      { code: '43', name: '熊本県', en: 'Kumamoto', id: 'kumamoto' },
      { code: '44', name: '大分県', en: 'Oita', id: 'oita' },
      { code: '45', name: '宮崎県', en: 'Miyazaki', id: 'miyazaki' },
      { code: '46', name: '鹿児島県', en: 'Kagoshima', id: 'kagoshima' },
      { code: '47', name: '沖縄県', en: 'Okinawa', id: 'okinawa' },
    ],
  },
];

interface JapanMapProps {
  onRegionSelect?: (region: Region) => void;
  onPrefectureSelect?: (pref: Prefecture) => void;
  selectedRegion?: Region | null;
  className?: string;
}

interface RegionVisualData {
  id: RegionId;
  hue: number;
  label: string;
  labelPos: { x: number; y: number };
}

const REGION_VISUALS: RegionVisualData[] = [
  { id: 'hokkaido', hue: 220, label: '北海道', labelPos: { x: 346, y: 239 } },
  { id: 'tohoku', hue: 190, label: '東北', labelPos: { x: 899, y: 218 } },
  { id: 'kanto', hue: 275, label: '関東', labelPos: { x: 836, y: 590 } },
  { id: 'chubu', hue: 145, label: '中部', labelPos: { x: 689, y: 457 } },
  { id: 'kansai', hue: 42, label: '関西', labelPos: { x: 537, y: 635 } },
  { id: 'chugoku', hue: 25, label: '中国', labelPos: { x: 319, y: 584 } },
  { id: 'shikoku', hue: 0, label: '四国', labelPos: { x: 367, y: 717 } },
  { id: 'kyushu', hue: 330, label: '九州・沖縄', labelPos: { x: 323, y: 800 } },
];

const getSlotColor = (hue: number, slot: 'A' | 'B' | 'C' | 'D', isHovered = false) => {
  const variations = {
    A: { s: 90, l: 55 },
    B: { s: 80, l: 65 },
    C: { s: 75, l: 45 },
    D: { s: 85, l: 50 },
  };
  const { s, l } = variations[slot];
  return `hsl(${hue}, ${s}%, ${isHovered ? l + 10 : l}%)`;
};

const JapanMap: React.FC<JapanMapProps> = ({
  onRegionSelect,
  onPrefectureSelect,
  selectedRegion,
  className = '',
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);
  const nationalViewBox = '0 0 1000 1000';
  const [currentViewBox, setCurrentViewBox] = useState(nationalViewBox);

  useEffect(() => {
    if (selectedRegion) {
      const b = DETAILED_MAP_DATA[selectedRegion.id].bbox;
      // 加えた余白を最小限にし、全県が表示されるように調整
      const padding = 20;
      const x = b.x - padding;
      const y = b.y - padding;
      const w = b.width + padding * 2;
      const h = b.height + padding * 2;
      setCurrentViewBox(`${x} ${y} ${w} ${h}`);
    } else {
      setCurrentViewBox(nationalViewBox);
    }
  }, [selectedRegion]);

  const handleRegionClick = (regionId: RegionId) => {
    const region = REGIONS_DATA.find((r) => r.id === regionId);
    if (region && onRegionSelect) {
      onRegionSelect(region);
    }
  };

  const handlePrefClick = (prefCode: string, regionId: RegionId) => {
    const region = REGIONS_DATA.find((r) => r.id === regionId);
    if (!region) return;

    // codeをゼロ埋め2桁に統一して一致を探す
    const normalizedCode = prefCode.padStart(2, '0');
    const pref = region.prefectures.find((p) => p.code === normalizedCode || p.code === prefCode);
    if (pref && onPrefectureSelect) {
      onPrefectureSelect(pref);
    }
  };

  return (
    <div className={`relative h-full w-full transition-all duration-700 ${className}`}>
      <svg
        viewBox={currentViewBox}
        className="duration-[1200ms] h-full w-full transition-all ease-in-out"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.12))' }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g>
          {REGION_VISUALS.map((rv) => {
            const isRegionActive = selectedRegion?.id === rv.id;
            const isNational = !selectedRegion;
            const detail = DETAILED_MAP_DATA[rv.id];

            return (
              <g
                key={rv.id}
                className={`transition-all duration-500 ${isNational ? 'cursor-pointer' : ''}`}
                onClick={() => isNational && handleRegionClick(rv.id)}
                onMouseEnter={() => isNational && setHoveredRegion(rv.id)}
                onMouseLeave={() => isNational && setHoveredRegion(null)}
                opacity={!selectedRegion || isRegionActive ? 1 : 0.1}
              >
                {detail.prefectures.map((pref) => {
                  const isHovered = hoveredRegion === rv.id;

                  const fillColor = isNational
                    ? getSlotColor(rv.hue, 'A', isHovered)
                    : isRegionActive
                      ? getSlotColor(rv.hue, pref.colorSlot)
                      : 'rgba(200,200,200,0.2)';

                  return (
                    <path
                      key={pref.code}
                      d={pref.path}
                      onClick={(e) => {
                        if (!isNational) {
                          e.stopPropagation();
                          handlePrefClick(pref.code, rv.id);
                        }
                      }}
                      className={`transition-all duration-700 ease-out ${
                        !isNational && isRegionActive ? 'cursor-pointer hover:opacity-80' : ''
                      }`}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth={isRegionActive ? 1.5 : 0.5}
                      strokeOpacity={0.8}
                    />
                  );
                })}

                {/* Region Label (Only in National View) */}
                {isNational && (
                  <text
                    x={rv.labelPos.x}
                    y={rv.labelPos.y}
                    textAnchor="middle"
                    className={`pointer-events-none fill-white text-[32px] font-black transition-all duration-500 ${
                      hoveredRegion === rv.id ? 'scale-110 opacity-100' : 'opacity-100'
                    }`}
                    style={{
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      transformOrigin: `${rv.labelPos.x}px ${rv.labelPos.y}px`,
                    }}
                  >
                    {rv.label}
                  </text>
                )}

                {/* Prefecture Labels (Only in Regional View) */}
                {!isNational &&
                  isRegionActive &&
                  detail.prefectures.map((pref, idx) => (
                    <text
                      key={`label-${pref.code}`}
                      x={pref.labelPos.x}
                      y={pref.labelPos.y}
                      textAnchor="middle"
                      className="pointer-events-none fill-white text-[16px] font-black duration-700 animate-in fade-in zoom-in"
                      style={{
                        textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.8)',
                        animationDelay: `${idx * 50}ms`,
                        transformOrigin: `${pref.labelPos.x}px ${pref.labelPos.y}px`,
                      }}
                    >
                      {pref.name}
                    </text>
                  ))}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default JapanMap;
