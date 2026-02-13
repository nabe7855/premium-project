// 国土地理院のGeoJSONから福岡県の市区町村SVGを生成するスクリプト
// データソース: https://geoshape.ex.nii.ac.jp/city/geojson/

const fs = require('fs');
const https = require('https');

// 福岡県の市区町村コード一覧（主要な市のみ）
const FUKUOKA_CITIES = [
  { code: '40100', name: '北九州市' },
  { code: '40101', name: '北九州市門司区' },
  { code: '40103', name: '北九州市若松区' },
  { code: '40105', name: '北九州市戸畑区' },
  { code: '40106', name: '北九州市小倉北区' },
  { code: '40107', name: '北九州市小倉南区' },
  { code: '40108', name: '北九州市八幡東区' },
  { code: '40109', name: '北九州市八幡西区' },
  { code: '40130', name: '福岡市' },
  { code: '40131', name: '福岡市東区' },
  { code: '40132', name: '福岡市博多区' },
  { code: '40133', name: '福岡市中央区' },
  { code: '40134', name: '福岡市南区' },
  { code: '40135', name: '福岡市西区' },
  { code: '40136', name: '福岡市城南区' },
  { code: '40137', name: '福岡市早良区' },
  { code: '40202', name: '大牟田市' },
  { code: '40203', name: '久留米市' },
  { code: '40204', name: '直方市' },
  { code: '40205', name: '飯塚市' },
  { code: '40206', name: '田川市' },
  { code: '40207', name: '柳川市' },
  { code: '40210', name: '八女市' },
  { code: '40211', name: '筑後市' },
  { code: '40212', name: '大川市' },
  { code: '40213', name: '行橋市' },
  { code: '40214', name: '豊前市' },
  { code: '40215', name: '中間市' },
  { code: '40216', name: '小郡市' },
  { code: '40217', name: '筑紫野市' },
  { code: '40218', name: '春日市' },
  { code: '40219', name: '大野城市' },
  { code: '40220', name: '宗像市' },
  { code: '40221', name: '太宰府市' },
  { code: '40223', name: '古賀市' },
  { code: '40224', name: '福津市' },
  { code: '40225', name: 'うきは市' },
  { code: '40226', name: '宮若市' },
  { code: '40227', name: '嘉麻市' },
  { code: '40228', name: '朝倉市' },
  { code: '40229', name: 'みやま市' },
  { code: '40230', name: '糸島市' },
];

console.log('福岡県の市区町村GeoJSONデータをダウンロード中...');
console.log('データソース: https://geoshape.ex.nii.ac.jp/');
console.log('');
console.log('このスクリプトは参考用です。実際のデータ取得は以下の手順で行います：');
console.log('');
console.log('1. https://geoshape.ex.nii.ac.jp/city/ にアクセス');
console.log('2. 福岡県を選択');
console.log('3. GeoJSON形式でダウンロード');
console.log('4. ダウンロードしたファイルを scripts/fukuoka_cities.geojson として保存');
console.log('');
console.log('または、国土数値情報ダウンロードサービスを利用：');
console.log('https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2024.html');
console.log('');
console.log('市区町村コード一覧:');
FUKUOKA_CITIES.forEach((city) => {
  console.log(`  ${city.code}: ${city.name}`);
});
