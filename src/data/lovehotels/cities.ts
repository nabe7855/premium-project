// 市区町村マスターデータ
export interface City {
  id: string;
  name: string;
  areaId: string;
  prefectureId: string;
  isPopular?: boolean;
  displayOrder?: number;
}

export const FUKUOKA_CITIES: City[] = [
  // 福岡市
  {
    id: 'hakata',
    name: '博多区',
    areaId: 'fukuoka-city',
    prefectureId: 'fukuoka',
    isPopular: true,
    displayOrder: 1,
  },
  {
    id: 'chuo',
    name: '中央区',
    areaId: 'fukuoka-city',
    prefectureId: 'fukuoka',
    isPopular: true,
    displayOrder: 2,
  },
  { id: 'minami', name: '南区', areaId: 'fukuoka-city', prefectureId: 'fukuoka', displayOrder: 3 },
  { id: 'nishi', name: '西区', areaId: 'fukuoka-city', prefectureId: 'fukuoka', displayOrder: 4 },
  {
    id: 'sawara',
    name: '早良区',
    areaId: 'fukuoka-city',
    prefectureId: 'fukuoka',
    displayOrder: 5,
  },
  { id: 'jonan', name: '城南区', areaId: 'fukuoka-city', prefectureId: 'fukuoka', displayOrder: 6 },
  { id: 'higashi', name: '東区', areaId: 'fukuoka-city', prefectureId: 'fukuoka', displayOrder: 7 },

  // 北九州市
  {
    id: 'kokura-kita',
    name: '小倉北区',
    areaId: 'kitakyushu',
    prefectureId: 'fukuoka',
    isPopular: true,
    displayOrder: 1,
  },
  {
    id: 'kokura-minami',
    name: '小倉南区',
    areaId: 'kitakyushu',
    prefectureId: 'fukuoka',
    displayOrder: 2,
  },
  { id: 'moji', name: '門司区', areaId: 'kitakyushu', prefectureId: 'fukuoka', displayOrder: 3 },
  { id: 'tobata', name: '戸畑区', areaId: 'kitakyushu', prefectureId: 'fukuoka', displayOrder: 4 },
  {
    id: 'wakamatsu',
    name: '若松区',
    areaId: 'kitakyushu',
    prefectureId: 'fukuoka',
    displayOrder: 5,
  },
  {
    id: 'yahata-higashi',
    name: '八幡東区',
    areaId: 'kitakyushu',
    prefectureId: 'fukuoka',
    displayOrder: 6,
  },
  {
    id: 'yahata-nishi',
    name: '八幡西区',
    areaId: 'kitakyushu',
    prefectureId: 'fukuoka',
    displayOrder: 7,
  },

  // 筑豊
  { id: 'iizuka', name: '飯塚市', areaId: 'chikuho', prefectureId: 'fukuoka', displayOrder: 1 },
  { id: 'tagawa', name: '田川市', areaId: 'chikuho', prefectureId: 'fukuoka', displayOrder: 2 },
  { id: 'nogata', name: '直方市', areaId: 'chikuho', prefectureId: 'fukuoka', displayOrder: 3 },
  { id: 'kama', name: '嘉麻市', areaId: 'chikuho', prefectureId: 'fukuoka', displayOrder: 4 },
  { id: 'yamada', name: '山田市', areaId: 'chikuho', prefectureId: 'fukuoka', displayOrder: 5 },

  // 筑後
  {
    id: 'kurume',
    name: '久留米市',
    areaId: 'chikugo',
    prefectureId: 'fukuoka',
    isPopular: true,
    displayOrder: 1,
  },
  { id: 'omuta', name: '大牟田市', areaId: 'chikugo', prefectureId: 'fukuoka', displayOrder: 2 },
  { id: 'yanagawa', name: '柳川市', areaId: 'chikugo', prefectureId: 'fukuoka', displayOrder: 3 },
  { id: 'okawa', name: '大川市', areaId: 'chikugo', prefectureId: 'fukuoka', displayOrder: 4 },
  { id: 'yame', name: '八女市', areaId: 'chikugo', prefectureId: 'fukuoka', displayOrder: 5 },
  { id: 'chikugo', name: '筑後市', areaId: 'chikugo', prefectureId: 'fukuoka', displayOrder: 6 },

  // その他福岡県
  {
    id: 'kasuga',
    name: '春日市',
    areaId: 'fukuoka-other',
    prefectureId: 'fukuoka',
    displayOrder: 1,
  },
  {
    id: 'onojo',
    name: '大野城市',
    areaId: 'fukuoka-other',
    prefectureId: 'fukuoka',
    displayOrder: 2,
  },
  {
    id: 'dazaifu',
    name: '太宰府市',
    areaId: 'fukuoka-other',
    prefectureId: 'fukuoka',
    displayOrder: 3,
  },
  {
    id: 'munakata',
    name: '宗像市',
    areaId: 'fukuoka-other',
    prefectureId: 'fukuoka',
    displayOrder: 4,
  },
  {
    id: 'chikushino',
    name: '筑紫野市',
    areaId: 'fukuoka-other',
    prefectureId: 'fukuoka',
    displayOrder: 5,
  },
];

// 市IDから取得
export const getCityById = (id: string): City | undefined => {
  return FUKUOKA_CITIES.find((city) => city.id === id);
};

// エリアIDから市一覧を取得
export const getCitiesByArea = (areaId: string): City[] => {
  return FUKUOKA_CITIES.filter((city) => city.areaId === areaId).sort(
    (a, b) => (a.displayOrder || 999) - (b.displayOrder || 999),
  );
};

// 人気市を取得
export const getPopularCities = (areaId?: string): City[] => {
  const cities = areaId
    ? FUKUOKA_CITIES.filter((city) => city.areaId === areaId && city.isPopular)
    : FUKUOKA_CITIES.filter((city) => city.isPopular);
  return cities.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
};

// 都道府県IDから全市を取得
export const getCitiesByPrefecture = (prefectureId: string): City[] => {
  return FUKUOKA_CITIES.filter((city) => city.prefectureId === prefectureId);
};
