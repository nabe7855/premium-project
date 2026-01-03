export interface CastMember {
  id: number;
  name: string;
  age: number;
  compatibility: number;
  imageUrl: string;
  status: string;
}

export type Rarity = 'R' | 'SR' | 'SSR';

export interface Character {
  id: number;
  name: string;
  rarity: Rarity;
  imageUrl: string; // 表面
  backImageUrl: string; // 裏面
}

export type AnimationStep =
  | 'idle'
  | 'descending'
  | 'hovering'
  | 'flashing_and_flipping'
  | 'revealed';

export enum MatchState {
  START = 'START',
  TRANSITION = 'TRANSITION',
  RESULTS = 'RESULTS',
}
