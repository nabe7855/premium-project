// utils/colorThemes.ts
export const colorThemes: Record<string, string> = {
  pink: "from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 shadow-pink-400/50",
  rose: "from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-rose-400/50",
  violet: "from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 shadow-violet-400/50",
};

export function getGradientClass(themeColor?: string) {
  return colorThemes[themeColor ?? "pink"] || colorThemes["pink"];
}
