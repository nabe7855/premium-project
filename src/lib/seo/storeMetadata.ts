import type { Metadata } from 'next';

const SITE = 'https://www.sutoroberrys.jp';

export function storeMetadata({
  path,
  title,
  description,
  index = true,
}: {
  path: string;
  title: string;
  description: string;
  index?: boolean;
}): Metadata {
  // canonical urlを生成
  const canonical = new URL(path, SITE).toString();
  
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index, follow: index },
    openGraph: { title, description, url: canonical, type: 'website' },
  };
}
