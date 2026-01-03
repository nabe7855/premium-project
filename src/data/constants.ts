import { CastMember,Character } from '@/types/match';

// 🔹 キャラクターのレアリティを扱う Enum
export enum Rarity {
  R = 'R',
  SR = 'SR',
  SSR = 'SSR',
}

// 🔹 キャラクター情報（ガチャ・演出用）
export const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'トランプ柄2',
    rarity: 'SSR',
    imageUrl: '/トランプ柄2.png',
    backImageUrl: '/トランプ柄2.png',
  },
  {
    id: 2,
    name: 'トランプ柄3',
    rarity: 'SR',
    imageUrl: '/トランプ柄3.png',
    backImageUrl: '/トランプ柄3.png',
  },
  {
    id: 3,
    name: 'トランプ柄ジョーカー',
    rarity: 'R',
    imageUrl: '/トランプ柄ジョーカー.png',
    backImageUrl: '/トランプ柄ジョーカー.png',
  },
];




// 🔹 レアリティごとのスタイル
export const RARITY_STYLES: { [key in Rarity]: { border: string; shadow: string; text: string } } = {
  [Rarity.R]: {
    border: 'border-sky-400',
    shadow: 'shadow-sky-400/50',
    text: 'text-sky-300',
  },
  [Rarity.SR]: {
    border: 'border-violet-400',
    shadow: 'shadow-violet-400/60',
    text: 'text-violet-300',
  },
  [Rarity.SSR]: {
    border: 'border-amber-400',
    shadow: 'shadow-amber-400/70',
    text: 'text-amber-300',
  },
};

// 🔹 マッチング用のダミーキャストデータ
export const DUMMY_CAST_MEMBERS: CastMember[] = [
  {
    id: 1,
    name: 'Yuki',
    age: 24,
    compatibility: 95,
    imageUrl: 'https://picsum.photos/seed/yuki/400/600',
    status: 'Loves cafes and art',
  },
  {
    id: 2,
    name: 'Rina',
    age: 27,
    compatibility: 88,
    imageUrl: 'https://picsum.photos/seed/rina/400/600',
    status: 'Weekend hiking',
  },
  {
    id: 3,
    name: 'Mio',
    age: 22,
    compatibility: 92,
    imageUrl: 'https://picsum.photos/seed/mio/400/600',
    status: 'Movie enthusiast',
  },
];

// 🔹 共通テーマ
export const THEME_EMOJI = '🍓';
