
export interface StoreLinksConfig {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    isVisible: boolean;
  };
  categories: {
    id: string;
    label: string;
    emoji: string;
    desc: string;
    isVisible: boolean;
  }[];
  seo: {
    title: string;
    description: string;
  };
}

export const DEFAULT_STORE_LINKS_CONFIG: StoreLinksConfig = {
  hero: {
    title: 'おすすめパートナーサイト',
    subtitle: 'Partner Sites',
    description: '私たちが厳選した、信頼できる女性用風俗情報サイト・求人サイト・関連メディアをご紹介します。',
    isVisible: true,
  },
  categories: [
    { 
      id: 'general', 
      label: '女性用風俗 情報サイト', 
      emoji: '🌸', 
      desc: '信頼できる女風情報をまとめたサイト',
      isVisible: true
    },
    { 
      id: 'recruit', 
      label: '求人・募集サイト', 
      emoji: '💼', 
      desc: '業界の求人・採用情報サイト',
      isVisible: true
    },
    { 
      id: 'media', 
      label: '関連メディア', 
      emoji: '📰', 
      desc: '女性向け風俗・癒しのメディア',
      isVisible: true
    },
  ],
  seo: {
    title: '女性用風俗 おすすめサイト一覧 | ストロベリーボーイズ',
    description: 'ストロベリーボーイズが信頼するパートナーサイトをご紹介。信頼できるサイトのみを厳選掲載しています。',
  }
};
