// エリアマスターデータ
export interface Area {
  id: string;
  name: string;
  prefectureId: string;
  svgRegionKey: string;
  cityIds: string[];
  displayOrder: number;
  description?: string;
}

export const FUKUOKA_AREAS: Area[] = [
  {
    id: 'fukuoka-city',
    name: '福岡市',
    prefectureId: 'fukuoka',
    svgRegionKey: 'fukuoka-city-region',
    cityIds: ['hakata', 'chuo', 'minami', 'nishi', 'sawara', 'jonan', 'higashi'],
    displayOrder: 1,
    description: '福岡県の県庁所在地。博多・天神エリアを含む',
  },
  {
    id: 'kitakyushu',
    name: '北九州市',
    prefectureId: 'fukuoka',
    svgRegionKey: 'kitakyushu-region',
    cityIds: [
      'kokura-kita',
      'kokura-minami',
      'moji',
      'tobata',
      'wakamatsu',
      'yahata-higashi',
      'yahata-nishi',
    ],
    displayOrder: 2,
    description: '福岡県北部の政令指定都市',
  },
  {
    id: 'chikuho',
    name: '筑豊',
    prefectureId: 'fukuoka',
    svgRegionKey: 'chikuho-region',
    cityIds: ['iizuka', 'tagawa', 'nogata', 'kama', 'yamada'],
    displayOrder: 3,
    description: '福岡県中央部の地域',
  },
  {
    id: 'chikugo',
    name: '筑後',
    prefectureId: 'fukuoka',
    svgRegionKey: 'chikugo-region',
    cityIds: ['kurume', 'omuta', 'yanagawa', 'okawa', 'yame', 'chikugo'],
    displayOrder: 4,
    description: '福岡県南部の地域',
  },
  {
    id: 'fukuoka-other',
    name: 'その他福岡県',
    prefectureId: 'fukuoka',
    svgRegionKey: 'fukuoka-other-region',
    cityIds: ['kasuga', 'onojo', 'dazaifu', 'munakata', 'chikushino'],
    displayOrder: 5,
    description: '福岡市・北九州市周辺地域',
  },
];

// エリアIDから取得
export const getAreaById = (id: string): Area | undefined => {
  return FUKUOKA_AREAS.find((area) => area.id === id);
};

// SVGキーから取得
export const getAreaBySvgKey = (svgKey: string): Area | undefined => {
  return FUKUOKA_AREAS.find((area) => area.svgRegionKey === svgKey);
};

// 都道府県IDから全エリアを取得
export const getAreasByPrefecture = (prefectureId: string): Area[] => {
  return FUKUOKA_AREAS.filter((area) => area.prefectureId === prefectureId);
};
