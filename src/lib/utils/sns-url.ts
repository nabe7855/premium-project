export function formatSnsUrl(
  url: string | null | undefined,
  platform?: 'line' | 'instagram' | 'twitter' | 'tiktok' | 'other'
): string {
  if (!url) return '';
  let trimmed = url.trim();
  if (!trimmed) return '';

  // 1. もし JSON 文字列が入っていた場合の保護
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (platform && parsed[platform]) {
        return formatSnsUrl(parsed[platform], platform);
      }
      const firstKey = Object.keys(parsed).find((k) => parsed[k]);
      if (firstKey) return formatSnsUrl(parsed[firstKey], firstKey as any);
    } catch {
      // 無視して続行
    }
  }

  // 2. @ハンドル名 の場合の整形
  if (trimmed.startsWith('@')) {
    const handle = trimmed.slice(1);
    switch (platform) {
      case 'instagram':
        return `https://www.instagram.com/${handle}`;
      case 'twitter':
        return `https://x.com/${handle}`;
      case 'tiktok':
        return `https://www.tiktok.com/@${handle}`;
      case 'line':
        return `https://line.me/ti/p/~${handle}`;
      default:
        return `https://www.instagram.com/${handle}`;
    }
  }

  // 3. ドメインなし（単体ID）の場合の整形
  if (!trimmed.includes('.') && !trimmed.includes('/')) {
    switch (platform) {
      case 'instagram':
        return `https://www.instagram.com/${trimmed}`;
      case 'twitter':
        return `https://x.com/${trimmed}`;
      case 'tiktok':
        return `https://www.tiktok.com/@${trimmed}`;
      case 'line':
        return `https://line.me/ti/p/~${trimmed}`;
      default:
        return `https://${trimmed}`;
    }
  }

  // 4. http:// や https:// が付いていない場合は補完（相対パス扱いによる404防止）
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}
