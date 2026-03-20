/**
 * リンク内の {slug} プレースホルダーを実際の店舗スラグに置換します
 */
export function resolveStoreLink(href: string, slug: string, phoneNumber?: string): string {
  if (!href) return '#';

  // {slug} や [slug] を置換 (URLエンコードされた文字にも対応)
  let resolved = href.replace(/(?:\{slug\}|\[slug\]|%7Bslug%7D|%5Bslug%5D)/g, slug);

  // {phone} を置換
  if (phoneNumber) {
    resolved = resolved.replace(/(?:\{phone\}|%7Bphone%7D)/g, phoneNumber);
  }

  // 絶対パスやURL、ページ内リンクはそのまませず、
  // 相対パスの補完が必要な場合に備える (Header.tsx の getAbsoluteHref 相当の処理)
  if (
    resolved.startsWith('http') ||
    resolved.startsWith('//') ||
    resolved.startsWith('#') ||
    resolved.startsWith('/') ||
    resolved.startsWith('tel:') ||
    resolved.startsWith('mailto:')
  ) {
    return resolved;
  }

  return `/${resolved}`;
}
