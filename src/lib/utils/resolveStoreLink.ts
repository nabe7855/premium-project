/**
 * リンク内の {slug} プレースホルダーを実際の店舗スラグに置換します
 */
export function resolveStoreLink(
  href: string,
  slug: string,
  phoneNumber?: string,
  lineUrl?: string,
): string {
  if (!href) return '#';

  // {slug} や [slug] を置換 (URLエンコードされた文字にも対応)
  let resolved = href.replace(/(?:\{slug\}|\[slug\]|%7Bslug%7D|%5Bslug%5D)/g, slug);

  // {phone} を置換 (値が空でも置換を試みる)
  resolved = resolved.replace(
    /(?:\{phone\}|%7Bphone%7D)/g,
    phoneNumber || '',
  );

  // {line} または {line_url} を置換 (値が空でも置換を試みる)
  resolved = resolved.replace(
    /(?:\{line\}|\{line_url\}|%7Bline%7D|%7Bline_url%7D)/g,
    lineUrl || '',
  );

  // LINE ID (@、または誤って /@ から始まる場合) を友だち追加リンクに変換
  if (resolved.startsWith('@')) {
    return `https://line.me/R/ti/p/${resolved}`;
  }
  if (resolved.startsWith('/@')) {
    return `https://line.me/R/ti/p/${resolved.substring(1)}`;
  }

  // 絶対パスやURL、ページ内リンクはそのまませず、
  // 相対パスの補完が必要な場合に備える (Header.tsx の getAbsoluteHref 相当の 処理)
  if (
    resolved.startsWith('http') ||
    resolved.startsWith('//') ||
    resolved.startsWith('#') ||
    resolved.startsWith('/') ||
    resolved.startsWith('tel:') ||
    resolved.startsWith('mailto:')
  ) {
    // 誤って /https://... のようになっている場合は先頭のスラッシュを削除
    if (resolved.startsWith('/http')) {
      return resolved.substring(1);
    }
    return resolved;
  }

  return `/${resolved}`;
}
