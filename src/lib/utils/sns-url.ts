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

export function parseCastSns(snsUrl: string | null | undefined): Record<string, string> | undefined {
  if (!snsUrl) return undefined;
  
  try {
    const parsed = JSON.parse(snsUrl);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {
    // Plain text URL fallback
    const snsObj: Record<string, string> = {};
    const lower = snsUrl.toLowerCase();
    
    // Check if there's a URL in the text
    const urlMatch = snsUrl.match(/https?:\/\/[^\s<>()]+/);
    const targetStr = urlMatch ? urlMatch[0] : snsUrl;
    const targetLower = targetStr.toLowerCase();

    if (targetLower.includes('x.com') || targetLower.includes('twitter.com')) {
      snsObj.twitter = targetStr;
    } else if (targetLower.includes('instagram.com')) {
      snsObj.instagram = targetStr;
    } else if (targetLower.includes('lin.ee') || targetLower.includes('line.me')) {
      snsObj.line = targetStr;
    } else if (targetLower.includes('tiktok.com')) {
      snsObj.tiktok = targetStr;
    }

    return Object.keys(snsObj).length > 0 ? snsObj : undefined;
  }
  return undefined;
}
