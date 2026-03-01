/**
 * リンク内の {slug} プレースホルダーを実際の店舗スラグに置換します
 */
export function resolveStoreLink(href: string, slug: string): string {
  if (!href) return '#';

  // {slug} を置換
  const resolved = href.replace(/\{slug\}/g, slug);

  // 絶対パスやURL、ページ内リンクはそのまませず、
  // 相対パスの補完が必要な場合に備える (Header.tsx の getAbsoluteHref 相当の処理)
  if (
    resolved.startsWith('http') ||
    resolved.startsWith('//') ||
    resolved.startsWith('#') ||
    resolved.startsWith('/')
  ) {
    return resolved;
  }

  return `/${resolved}`;
}
