// スケジュール状態ごとの色＋アニメーション
const scheduleStatusStyles: Record<
  string,
  { base: string; animate?: string; text?: string }
> = {
  '予約可能': {
    base: 'bg-green-200 text-green-800',
    animate: 'animate-blink',
  },
  '残りあとわずか': {
    base: 'bg-red-500 text-white',
    animate: 'animate-pulseLamp',
  },
  '満員御礼': {
    base: 'bg-yellow-200 text-yellow-800',
    animate: 'animate-happy',
  },
  '応相談': {
    base: 'bg-gray-200 text-gray-700',
  },
};
