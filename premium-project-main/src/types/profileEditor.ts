// src/types/profileEditor.ts
import { CastProfile } from './cast';

// onChange ハンドラ型
export type OnChangeHandler = <K extends keyof CastProfile>(
  key: K,
  value: CastProfile[K]
) => void;