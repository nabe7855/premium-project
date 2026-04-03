import React from 'react';
import type { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface LocalBusinessJsonLdProps {
  config: StoreTopPageConfig;
  url: string;
  imageUrl?: string;
}

/**
 * MEO対策用: LocalBusiness (LodgingBusiness) 構造化データ
 * Google検索やマップに対して、店舗情報の信頼性を伝えるためのコンポーネントです。
 */
const LocalBusinessJsonLd: React.FC<LocalBusinessJsonLdProps> = ({ config, url, imageUrl }) => {
  const { shopInfo } = config.footer;

  // JSON-LD オブジェクトの構築
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness', // ホテル・宿泊業向けの定義
    'name': shopInfo.name,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': shopInfo.address,
      'addressLocality': '', // 必要に応じて住所から抽出可能
      'addressRegion': '',   // 必要に応じて住所から抽出可能
      'postalCode': '',      // 必要に応じて住所から抽出可能
      'addressCountry': 'JP'
    },
    'telephone': shopInfo.phone,
    'url': url,
    'image': imageUrl || config.hero.images[0],
    'description': config.hero.description,
    'openingHours': shopInfo.businessHours,
    // 必要に応じて緯度経度などの情報を追加可能
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default LocalBusinessJsonLd;
