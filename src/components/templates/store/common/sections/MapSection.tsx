import React from 'react';

interface MapSectionProps {
  address: string;
  shopName: string;
}

/**
 * MEO対策用: Google Map 埋め込みセクション
 * 公式の地図を埋め込むことで、Googleに対する位置情報の確信度を高めます。
 */
const MapSection: React.FC<MapSectionProps> = ({ address, shopName }) => {
  if (!address) return null;

  // Google Maps Embed URL の構築
  // 住所と店名をエンコードして検索クエリにします
  const encodedQuery = encodeURIComponent(`${address} ${shopName}`);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedQuery}`;

  // APIキーがない場合は、より簡易的な検索URLを使用することも可能ですが、
  // 一般的な埋め込みコード（APIキー不要の公開URL）を推奨します。
  // ここではMEO効果の高い標準的な埋め込みの構成案を示します。
  const simpleMapUrl = `https://maps.google.co.jp/maps?output=embed&q=${encodedQuery}&z=15`;

  return (
    <section id="access" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">ACCESS</h2>
          <p className="text-slate-600">アクセスマップ</p>
        </div>
        
        <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-lg aspect-video w-full">
          <iframe
            title={`${shopName} Access Map`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={simpleMapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
        <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{shopName}</h3>
              <p className="text-slate-600 mt-1">{address}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Googleマップで見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
