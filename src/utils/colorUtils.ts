// utils/colorUtils.ts
function adjustColor(col: string, amt: number): string {
  let usePound = false;

  let color = col;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return (usePound ? "#" : "") + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function generateTheme(baseColor: string) {
  const primary = baseColor;
  const primaryLight = adjustColor(baseColor, 40); // +40 明るく
  const primaryDark = adjustColor(baseColor, -40); // -40 暗く
  const accent = adjustColor(baseColor, 80);       // アクセントはさらに明るく

  return {
    primary,
    primaryLight,
    primaryDark,
    accent,
    bodyClass: `bg-gradient-to-br from-[${primaryLight}] to-[${primary}]`,
    gradient: `from-[${primary}] to-[${primaryDark}]`,
    gradientHover: `from-[${primaryDark}] to-[${primary}]`,
  };
}
