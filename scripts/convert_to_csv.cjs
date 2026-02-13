const fs = require('fs');
const path = require('path');

/**
 * スクレイピングデータをCSVインポート形式に変換
 * 著作権に配慮し、紹介文は要約・リライトを行う
 */

// 生データ読み込み
const rawDataPath = path.join(__dirname, '..', 'scraped_data_fukuoka_all.json');
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// エリア名からDB上のIDへのマッピング
// city_id: "fukuoka-city"(福岡市), "kitakyushu-city"(北九州市), "Kurume-shi"(久留米市), その他住所判断
// area_id: 区名やエリア名。DBにない場合はnullまたは住所から推測
const AREA_MAPPING = {
  // --- 福岡市エリア ---
  '天神・中洲・博多': { city: 'fukuoka-city', area: 'Hakata-ku' }, // 代表として博多区。住所で中央区に補正するロジックを追加予定
  '福岡空港・大野城': { city: 'fukuoka-city', area: 'Hakata-ku' }, // 空港周辺は博多区多し。大野城は市外だが便宜上
  '平尾・薬院': { city: 'fukuoka-city', area: 'Chuo-ku' },
  '那の津・港': { city: 'fukuoka-city', area: 'Chuo-ku' },
  '姪浜・糸島': { city: 'fukuoka-city', area: 'Nishi-ku' },
  '西新・城南': { city: 'fukuoka-city', area: 'Jonan-ku' },
  '新宮・粕屋': { city: 'fukuoka-city', area: 'Higashi-ku' }, // 近隣
  '宗像・福津': { city: 'fukuoka-city', area: 'Higashi-ku' }, // 近隣
  箱崎: { city: 'fukuoka-city', area: 'Higashi-ku' },

  // --- 北九州市エリア ---
  '小倉・門司': { city: 'kitakyushu-city', area: 'Kokurakita-ku' }, // 代表
  '黒崎・八幡': { city: 'kitakyushu-city', area: 'Yahatanishi-ku' },

  // --- 久留米エリア ---
  久留米: { city: 'Kurume-shi', area: 'Kurume' }, // area_idは適当な値（DBになければnullになるがcsv上は入る）

  // --- その他（正しい市へ割り当て）---
  遠賀: { city: 'Nakama-shi', area: 'Onga' }, // 遠賀・中間 → 中間市（代表）
  飯塚: { city: 'Iizuka-shi', area: 'Iizuka' },
  '大牟田・柳川': { city: 'Omuta-shi', area: 'Omuta' },
  '行橋・京築': { city: 'Yukuhashi-shi', area: 'Yukuhashi' },
  '八女・筑後': { city: 'Yame-shi', area: 'Yame' },
  '朝倉・小郡': { city: 'Asakura-shi', area: 'Asakura' },
  '筑紫野・那珂川': { city: 'Chikushino-shi', area: 'Chikushino' },
  '直方・鞍手': { city: 'Nogata-shi', area: 'Nogata' },
  田川: { city: 'Tagawa-shi', area: 'Tagawa' },
  '宗像・福津': { city: 'Munakata-shi', area: 'Munakata' }, // 宗像市
  '新宮・粕屋': { city: 'Koga-shi', area: 'Koga' }, // 古賀市・粕屋郡（代表）
};

// テキストから料金を抽出（簡易版）
function extractPrice(text, type = 'rest') {
  const patterns = {
    rest: /休憩[：:]\s*([0-9,]+)円|休憩料金[：:]\s*([0-9,]+)|休憩\s+([0-9,]+)円/i,
    stay: /宿泊[：:]\s*([0-9,]+)円|宿泊料金[：:]\s*([0-9,]+)|宿泊\s+([0-9,]+)円/i,
  };

  const match = text.match(patterns[type]);
  if (match) {
    const price = (match[1] || match[2] || match[3]).replace(/,/g, '');
    return parseInt(price);
  }
  return null;
}

// テキストから住所を抽出
function extractAddress(text) {
  const addressMatch = text.match(/(?:住所|所在地)[：:]\s*([^\n]+)/);
  if (addressMatch) {
    return addressMatch[1].trim();
  }
  // 福岡県〜で始まる行を探す
  const fukuokaMatch = text.match(/福岡県[^\n]+/);
  if (fukuokaMatch) {
    return fukuokaMatch[0].trim();
  }
  return '福岡県';
}

// テキストから電話番号を抽出
function extractPhone(text) {
  const phoneMatch = text.match(/(?:電話|TEL|Tel)[：:]\s*([\d-]+)/);
  if (phoneMatch) {
    return phoneMatch[1].trim();
  }
  return '';
}

// 紹介文を生成（著作権に配慮したリライト）
function generateDescription(name, text, area) {
  // キーワード抽出
  const hasRotenburo = /露天風呂|露天|ジャグジー/.test(text);
  const hasParking = /駐車場|パーキング/.test(text);
  const hasBreakfast = /朝食|モーニング/.test(text);
  const hasWifi = /Wi-Fi|WiFi|無線LAN/.test(text);
  const isNearStation = /駅近|駅から/.test(text);
  const hasKaraoke = /カラオケ/.test(text);

  // 特徴を組み合わせて新しい文章を生成
  let desc = `${name}は、${area}エリアに位置するホテルです。`;

  const features = [];
  if (hasRotenburo) features.push('露天風呂やジャグジーを完備');
  if (hasParking) features.push('駐車場あり');
  if (isNearStation) features.push('駅からのアクセスも良好');
  if (hasKaraoke) features.push('カラオケ設備');
  if (hasWifi) features.push('Wi-Fi完備');

  if (features.length > 0) {
    desc += features.slice(0, 3).join('、') + 'で、快適なひとときをお過ごしいただけます。';
  } else {
    desc += '充実した設備とサービスで、お客様をお迎えいたします。';
  }

  return desc;
}

// CSV行を生成
function generateCSVRow(hotel) {
  // マッピング取得
  let mapping = AREA_MAPPING[hotel.area] || { city: 'fukuoka-city', area: 'Hakata-ku' };

  // 住所から補正（特に福岡市内）
  const address = extractAddress(hotel.raw_text);
  if (address.includes('中央区')) {
    mapping = { city: 'fukuoka-city', area: 'Chuo-ku' };
  } else if (address.includes('博多区')) {
    mapping = { city: 'fukuoka-city', area: 'Hakata-ku' };
  } else if (address.includes('東区')) {
    mapping = { city: 'fukuoka-city', area: 'Higashi-ku' };
  } else if (address.includes('南区')) {
    mapping = { city: 'fukuoka-city', area: 'Minami-ku' };
  } else if (address.includes('西区')) {
    mapping = { city: 'fukuoka-city', area: 'Nishi-ku' };
  } else if (address.includes('城南区')) {
    mapping = { city: 'fukuoka-city', area: 'Jonan-ku' };
  } else if (address.includes('早良区')) {
    mapping = { city: 'fukuoka-city', area: 'Sawara-ku' };
  } else if (address.includes('久留米市')) {
    mapping = { city: 'Kurume-shi', area: 'Kurume' };
  } else if (address.includes('北九州市')) {
    mapping = { city: 'kitakyushu-city', area: 'Kokurakita-ku' }; // デフォルト
    if (address.includes('小倉北区')) mapping.area = 'Kokurakita-ku';
    if (address.includes('小倉南区')) mapping.area = 'Kokuraminami-ku';
    if (address.includes('八幡西区')) mapping.area = 'Yahatanishi-ku';
    if (address.includes('八幡東区')) mapping.area = 'Yahatahigashi-ku';
    if (address.includes('門司区')) mapping.area = 'Moji-ku';
  }

  const phone = extractPhone(hotel.raw_text);
  const restPrice = extractPrice(hotel.raw_text, 'rest') || '';
  const stayPrice = extractPrice(hotel.raw_text, 'stay') || '';
  const description = generateDescription(hotel.name, hotel.raw_text, hotel.area);

  // CSVエスケープ処理
  const escape = (str) => {
    if (!str) return '';
    str = String(str).replace(/"/g, '""');
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str}"`;
    }
    return str;
  };

  // ※DBのエリア・City IDに合わせる
  return [
    '', // hotel_id (新規)
    escape(hotel.name),
    escape(address),
    escape(phone),
    escape(hotel.url),
    '', // image_url
    escape(description),
    escape(mapping.area), // DBにあるID、なければ文字列そのまま入る（インポート側で無視orエラーになる可能性あり）
    escape(mapping.city), // DBにあるID
    ' Fukuoka', // prefecture_id (先頭スペース注意)
    restPrice,
    stayPrice,
    '', // rating
    '', // review_id
    '', // review_user
    '', // review_rating
    '', // review_content
    '', // review_date
  ].join(',');
}

// メイン処理
console.log('データ変換を開始します...');
console.log(`対象: ${rawData.length}件のホテル`);

// 重複除外（URL基準）
const uniqueHotels = [];
const seenUrls = new Set();

for (const hotel of rawData) {
  if (!seenUrls.has(hotel.url)) {
    seenUrls.add(hotel.url);
    uniqueHotels.push(hotel);
  }
}

console.log(`重複除外後: ${uniqueHotels.length}件`);

// CSV生成
const csvHeader =
  'hotel_id,hotel_name,address,phone,website,image_url,description,area_id,city_id,prefecture_id,min_price_rest,min_price_stay,rating,review_id,review_user,review_rating,review_content,review_date';
const csvRows = [csvHeader];

for (const hotel of uniqueHotels) {
  try {
    const row = generateCSVRow(hotel);
    csvRows.push(row);
  } catch (err) {
    console.error(`エラー (${hotel.name}):`, err.message);
  }
}

// ファイル出力
const outputPath = path.join(process.cwd(), 'hotels_fukuoka_import.csv');
fs.writeFileSync(outputPath, csvRows.join('\n'), 'utf8');

console.log(`\n完了！`);
console.log(`出力: ${outputPath}`);
console.log(`${csvRows.length - 1}件のホテルデータを生成しました。`);
console.log(`\n次のステップ: /admin/hotels からこのCSVをアップロードしてください。`);
