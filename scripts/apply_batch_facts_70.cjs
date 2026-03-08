const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const robustParseCsvLine = (line) => {
    const parts = [];
    let part = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          part += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          part += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          parts.push(part);
          part = '';
        } else {
          part += char;
        }
      }
    }
    parts.push(part);
    return parts;
  };

  const formatCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    return `"${String(field).replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = robustParseCsvLine(line);
      const id = parts[0];

      if (updates[id]) {
        parts[5] = updates[id].amenities || parts[5];
        parts[6] = updates[id].reviews || parts[6];
      }

      return parts.map(formatCsvField).join(',');
    })
    .filter((l) => l.length > 0);

  fs.writeFileSync(csvPath, [header, ...updatedLines].join('\n'), 'utf8');
  console.log(`✅ ${Object.keys(updates).length}件のデータを追加・更新しました。`);
}

const updates = {
  // --- Batch 70: Regional Favorites & Modern Beauty Facts ---
  '279bfcce-88e7-4299-94c3-c94060b10ca6': {
    // プリンセスプリンセス塩尻北
    amenities:
      'ナノ水導入, 檜風呂/露天風呂(一部), 42インチ大型TV, コミックルーム, マッサージチェア',
    reviews:
      '【評判】塩尻北。保湿効果の高い「ナノ水」や檜風呂など、癒やしの設備が充実。コミックルームもあり、静かな環境で時間を忘れてリラックスできる隠れ家的存在。',
  },
  '9e7996c3-1bae-4a88-98c0-3e3353d6fe0a': {
    // ホテル アーユル湘南
    amenities:
      'Chromecast全室, JOYSOUNDカラオケ(一部), ビールサーバー, スイーツコーナー, 豊富な無料アメニティ',
    reviews:
      '【評判】平塚。全室Chromecast導入でスマホ動画を大画面で。無料のビールサーバーやスイーツ、充実のアメニティバイキングなど、サービス精神が素晴らしい。',
  },
  '97518cd0-0c82-4a95-8f3a-f4e8ba0cf922': {
    // LUSSO CROCE URBAN HOTEL 横浜
    amenities: '露天風呂, ミストサウナ, 浴室ライトセラピー, JOYSOUNDカラオケ, ブルーレイプレーヤー',
    reviews:
      '【評判】横浜。ライトセラピー付きの浴室や露天風呂など、五感で楽しむリラクゼーションが魅力。スタイリッシュな空間と豊富な無料サービスで満足度が高い。',
  },
  'aa0d89f9-b37e-4dd2-b36c-802f35ff2fcc': {
    // ホテル 東名 / 川崎市宮前区
    amenities:
      '専用ガレージ(全室), 生ビール飲み放題(宿泊特典), 5.1chサラウンド, サウナ(一部), デリバリー可',
    reviews:
      '【評判】川崎。全室戸建て風の専用ガレージ付きでプライバシー完璧。宿泊者向けの生ビール飲み放題サービスや高品質な音響設備など、独自の高付加価値が光る。',
  },
  '78b34d49-8d3d-40ee-8eef-3c60aafd5ec2': {
    // ホテル フェアリー ウィンク
    amenities: 'ReFa最新家電(全室), JOYSOUND MAX, 50インチTV, Chromecast, ウォーターサーバー',
    reviews:
      '【評判】横浜野毛。ReFaのシャワーやドライヤーが全室使い放題という美容特化型。最新カラオケや動画配信サービスの充実度も高く、遊びと美容を両立できる。',
  },
  '6e7401aa-d332-4fda-97d1-7a11672f8312': {
    // ホテル ジュエル・エレガンス神戸
    amenities:
      'ジェットバス, 42インチ大型TV, マッサージチェア(一部), 美顔器(レンタル), シャンプーレンタル',
    reviews:
      '【評判】神戸。大型テレビやマッサージチェアなど、ゆったり過ごせる設備を完備。レンタル美顔器やシャンプーバーも充実しており、女性目線のサービスが好評。',
  },
  'd6e8f8e1-62d6-4cd5-8fc0-902fcceb4385': {
    // ホテル ルミエール (熊本)
    amenities: '通信カラオケ, 有線放送, 豊富なアメニティ, コスチューム販売, インターネット無料',
    reviews:
      '【評判】熊本。繁華街に近くアクセス良好。清潔感のある客室にカラオケや充実したアメニティが揃っており、リーズナブルに都市滞在を楽しめる安定の一軒。',
  },
  '731acda4-dcfa-4792-a42e-2d6f7deb2612': {
    // HOTEL SARI RESORT 川西店
    amenities:
      '50インチ液晶TV, マッサージチェア(207/307), 宿泊時朝食無料, 美容セット配布, ジェットバス',
    reviews:
      '【評判】川西。全室50インチTV完備で大迫力の映像。宿泊時の無料朝食や美容セットのプレゼントなど、細やかな「おもてなし」がリピーターを増やしている。',
  },
  '9ca2f7ce-8cbf-4246-8adb-3055d8158a99': {
    // HOTEL CUE PLUS 厚木
    amenities:
      'レインボーバス, プラズマクラスター加湿空気清浄機, 65インチTV(一部), お姫様ベッド(一部)',
    reviews:
      '【評判】厚木。レインボーお風呂や空気清浄機など、快適性と演出を重視。一部客室のお姫様ベッドは非日常感が強く、最新の大型TVでの映画鑑賞も捗る。',
  },
  '638696de-0534-4861-a8f1-a7ac219479cc': {
    // WILL マリンリゾート藤沢
    amenities:
      'シャンプーバー, 入浴剤バイキング, サウナ(一部), マッサージチェア(一部), ナノイードライヤー',
    reviews:
      '【評判】藤沢。充実したシャンプー＆入浴剤バイキングが選ぶ楽しみを提供。一部客室のサウナや高品質なドライヤーも備わり、セルフケアを重視する客層に支持。',
  },
  'b7cd3ddf-4b08-43f9-a06f-2390045d9c18': {
    // WILL RESORT 鎌倉
    amenities: '全室リニューアル済, 50インチ大型TV, レインボーバス, サウナ(一部), 携帯充電器完備',
    reviews:
      '【評判】鎌倉。全面リニューアルで清潔度MAX。大画面TVやレインボーバスに加え、スマホ充電器まで完備。インター至近ながら静かな環境で、快適な鎌倉観光の拠点に。',
  },
  'caa94ebe-efa6-475d-ab60-3cdb513e7881': {
    // HOTEL CITY
    amenities:
      'ReFa最高級セット(全室), ウォーターサーバー全室, Chromecast, 65インチTV, シャンプーバイキング',
    reviews:
      '【評判】川崎。ReFaの最新ドライヤー・シャワーが全室完備。ウォーターサーバーやChromeCastなど「あったら嬉しい」が全て揃う、利便性と美容のハイブリッドホテル。',
  },
};

updateMultipleHotelFacts(updates);
