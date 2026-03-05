'use client';

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
  const [mapLabels, setMapLabels] = useState<{ id: string; name: string; x: number; y: number }[]>(
    [],
  );

  const getPrefIdFromElement = (el: SVGElement): string | null => {
    let current: SVGElement | null = el;
    while (current && current.tagName !== 'svg') {
      const className = current.getAttribute('class') || '';
      const classes = className.split(' ');
      const found = classes.find((c) => PREFECTURES_FLAT.some((p) => p.id === c));
      if (found) return found;
      current = current.parentElement as any;
    }
    return null;
  };

  const handlePrefIdClick = (prefId: string) => {
    console.log('[JapanMap] Handling Click for PrefID:', prefId);
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
    fetch(`/map-mobile.svg?v=${Date.now()}`)
      .then((res) => res.text())
      .then((svg) => {
        console.log('[JapanMap] SVG fetched, length:', svg.length);
        setSvgContent(svg);
      })
      .catch((err) => console.error('[JapanMap] Failed to fetch SVG', err));
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) {
      console.error('[JapanMap] SVG element not found in DOM');
      return;
    }

    console.log('[JapanMap] SVG DOM detected. Initializing styles...');

    svgElement.style.width = '100%';
    svgElement.style.height = 'auto';
    svgElement.style.display = 'block';
    svgElement.style.pointerEvents = 'auto';

    // ATTACH CLICK HANDLER TO SVG ROOT
    (svgElement as any).onclick = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      console.log(
        '[JapanMap] SVG Click intercepted:',
        target.tagName,
        'Class:',
        target.getAttribute('class'),
      );
      const prefId = getPrefIdFromElement(target);
      console.log('[JapanMap] Resolved PrefID from click:', prefId);
      if (prefId) {
        e.preventDefault();
        e.stopPropagation();
        handlePrefIdClick(prefId);
      }
    };

    const labels: { id: string; name: string; x: number; y: number }[] = [];
    let matchedPrefs = 0;

    REGIONS_DATA.forEach((region) => {
      const isRegionSelected = selectedRegion?.id === region.id;
      let rMinX = Infinity,
        rMinY = Infinity,
        rMaxX = -Infinity,
        rMaxY = -Infinity;
      let rFound = false;

      region.prefectures.forEach((pref) => {
        const els = svgElement.querySelectorAll(`.${pref.id}`);
        if (els.length > 0) matchedPrefs++;

        els.forEach((node) => {
          const el = node as SVGGraphicsElement;
          el.style.cursor = 'pointer';
          el.style.transition = 'fill 0.3s ease, opacity 0.3s ease';

          // Robust coloring logic
          const baseColor = selectedRegion
            ? isRegionSelected
              ? getRegionColor('selected')
              : '#f1f5f9'
            : getRegionColor(region.id);

          el.setAttribute('fill', baseColor);
          el.style.fill = baseColor;
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '1');

          if (selectedRegion && !isRegionSelected) {
            el.style.opacity = '0.3';
            el.style.pointerEvents = 'none';
          } else {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          }

          // Hover
          (el as any).onmouseenter = () => {
            if (!selectedRegion || isRegionSelected) el.style.filter = 'brightness(1.05)';
          };
          (el as any).onmouseleave = () => {
            el.style.filter = 'none';
          };

          // Label calculation
          try {
            const bbox = el.getBBox();
            if (!selectedRegion) {
              rMinX = Math.min(rMinX, bbox.x);
              rMinY = Math.min(rMinY, bbox.y);
              rMaxX = Math.max(rMaxX, bbox.x + bbox.width);
              rMaxY = Math.max(rMaxY, bbox.y + bbox.height);
              rFound = true;
            } else if (isRegionSelected && !labels.some((l) => l.id === pref.id)) {
              labels.push({
                id: pref.id,
                name: pref.name.replace(/都|道|府|県$/, ''),
                x: bbox.x + bbox.width / 2,
                y: bbox.y + bbox.height / 2,
              });
            }
          } catch (e) {}
        });
      });

      if (!selectedRegion && rFound) {
        labels.push({
          id: region.id,
          name: region.name,
          x: rMinX + (rMaxX - rMinX) / 2,
          y: rMinY + (rMaxY - rMinY) / 2,
        });
      }
    });

    console.log(`[JapanMap] Applied styles to ${matchedPrefs} prefectures.`);
    setMapLabels(labels);

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
        try {
          const bbox = el.getBBox();
          minX = Math.min(minX, bbox.x);
          minY = Math.min(minY, bbox.y);
          maxX = Math.max(maxX, bbox.x + bbox.width);
          maxY = Math.max(maxY, bbox.y + bbox.height);
          found = true;
        } catch (e) {}
      }
    });
    if (found) {
      const padding = 20;
      svg.setAttribute(
        'viewBox',
        `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`,
      );
    }
  };

  const resetZoom = (svg: SVGSVGElement) => {
    svg.setAttribute('viewBox', '0 0 1000 1000');
  };

  return (
    <div className={`relative w-full ${className} flex items-center justify-center p-4`}>
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ pointerEvents: 'auto' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {/* Percentage Based Labels Overlay can go here if needed later */}
    </div>
  );
};

const getRegionColor = (regionId: string) => {
  switch (regionId) {
    case 'hokkaido':
      return '#60a5fa';
    case 'tohoku':
      return '#2dd4bf';
    case 'kanto':
      return '#8b5cf6';
    case 'chubu':
      return '#10b981';
    case 'kansai':
      return '#f59e0b';
    case 'chugoku':
      return '#f97316';
    case 'shikoku':
      return '#ef4444';
    case 'kyushu':
      return '#ec4899';
    case 'selected':
      return '#4EA2F0';
    default:
      return '#ffe4ef';
  }
};

export default JapanMap;
