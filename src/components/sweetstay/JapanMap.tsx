import React, { useEffect, useRef, useState } from 'react';

export interface Prefecture {
  code: string;
  name: string;
  en: string;
  id: string; // slug
}

export interface Region {
  id: string;
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
    name: '近畿',
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
    name: '九州・沖縄',
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

const PREFECTURES_FLAT = REGIONS_DATA.flatMap((r) => r.prefectures);

interface JapanMapProps {
  onRegionSelect?: (region: Region) => void;
  onPrefectureSelect?: (pref: Prefecture) => void;
  selectedRegion?: Region | null;
  className?: string;
}

const JapanMap: React.FC<JapanMapProps> = ({
  onRegionSelect,
  onPrefectureSelect,
  selectedRegion,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  const handlePrefClick = (el: SVGElement) => {
    const classList = Array.from(el.classList);
    const prefId = classList.find(
      (c) =>
        c !== 'prefecture' &&
        c !== 'geolonia-svg-map-prefecture' &&
        !REGIONS_DATA.some((r) => r.id === c),
    );

    if (!prefId) return;

    const pref = PREFECTURES_FLAT.find((p) => p.id === prefId);
    if (!pref) return;

    const region = REGIONS_DATA.find((r) => r.prefectures.some((p) => p.code === pref.code));
    if (!region) return;

    if (!selectedRegion) {
      if (onRegionSelect) onRegionSelect(region);
    } else {
      if (selectedRegion.id === region.id) {
        if (onPrefectureSelect) onPrefectureSelect(pref);
      }
    }
  };

  useEffect(() => {
    fetch('/map-mobile.svg')
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg))
      .catch((err) => console.error('Failed to load map svg', err));
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    svgElement.style.width = '100%';
    svgElement.style.height = 'auto';
    svgElement.style.display = 'block';

    const prefElements = svgElement.querySelectorAll('.prefecture');

    prefElements.forEach((el) => {
      const element = el as SVGElement;
      element.style.fill = '#ffe4ef'; // rose-100 default
      element.style.stroke = '#fff';
      element.style.strokeWidth = '1';
      element.style.cursor = 'pointer';
      element.style.transition = 'fill 0.3s ease';

      (element as any).onclick = (e: MouseEvent) => {
        e.stopPropagation();
        handlePrefClick(element);
      };
    });

    REGIONS_DATA.forEach((region) => {
      const isRegionSelected = selectedRegion?.id === region.id;

      region.prefectures.forEach((pref) => {
        const el = Array.from(prefElements).find((e) =>
          e.classList.contains(pref.id),
        ) as SVGElement;

        if (el) {
          if (selectedRegion) {
            if (isRegionSelected) {
              el.style.fill = getRegionColor('selected');
              el.style.pointerEvents = 'auto';
            } else {
              el.style.fill = '#fff1f2'; // rose-50
              el.style.pointerEvents = 'none';
            }
          } else {
            el.style.fill = getRegionColor(region.id);
            el.style.pointerEvents = 'auto';
          }
        }
      });
    });

    if (selectedRegion) {
      zoomToRegion(selectedRegion, svgElement);
    } else {
      resetZoom(svgElement);
    }
  }, [svgContent, selectedRegion]);

  const zoomToRegion = (region: Region, svg: SVGSVGElement) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    let found = false;

    region.prefectures.forEach((pref) => {
      const el = svg.querySelector(`.${pref.id}`) as SVGGraphicsElement;
      if (el) {
        const bbox = el.getBBox();
        minX = Math.min(minX, bbox.x);
        minY = Math.min(minY, bbox.y);
        maxX = Math.max(maxX, bbox.x + bbox.width);
        maxY = Math.max(maxY, bbox.y + bbox.height);
        found = true;
      }
    });

    if (found) {
      const padding = 20;
      const vb = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
      svg.setAttribute('viewBox', vb);
    }
  };

  const resetZoom = (svg: SVGSVGElement) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const originalVB = doc.documentElement.getAttribute('viewBox');
    if (originalVB) {
      svg.setAttribute('viewBox', originalVB);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-3xl bg-rose-50/30 ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

const getRegionColor = (regionId: string) => {
  switch (regionId) {
    case 'hokkaido':
      return '#F472B6'; // pink-400
    case 'tohoku':
      return '#FB7185'; // rose-400
    case 'kanto':
      return '#E879F9'; // fuchsia-400
    case 'chubu':
      return '#F87171'; // red-400
    case 'kansai':
      return '#FB923C'; // orange-400
    case 'chugoku':
      return '#FCD34D'; // amber-300
    case 'shikoku':
      return '#A78BFA'; // violet-400
    case 'kyushu':
      return '#C084FC'; // purple-400
    case 'selected':
      return '#E11D48'; // rose-600
    default:
      return '#FDA4AF'; // rose-300
  }
};

export default JapanMap;
