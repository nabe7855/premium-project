const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const formatCsvField = (field) => {
    if (!field) return '""';
    return `"${field.replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = parseCsvLine(line);
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
  // --- Batch 44: Fukushima & Osaka Precision Enrichment ---
  'bb1354a7-4d6b-407f-a806-b72b3ae40d5a': {
    // 新舞子シーサイドホテル
    amenities: '日焼けマシン, ブラックライト, ウォーターサーバー, 空気清浄機',
    reviews:
      '【評判】いわき。日焼けマシンやブラックライトなど、遊び心のある設備が特徴。ウォーターサーバー完備で、海辺の滞在を快適にサポート。',
  },
  'b0638bdb-f883-46f8-b1ae-370df2d340fd': {
    // ホテル カムオン グーン
    amenities: '全室専用ガレージ, 5.1chサラウンド, レインボーバス(一部), 42インチ以上大型TV',
    reviews:
      '【評判】泉崎。全室に専用ガレージがありプライバシー抜群。5.1chサラウンドの臨場感あふれる音響で、映画鑑賞にも最適。',
  },
  '4a67331b-8931-4fea-a460-ab9017b1a87e': {
    // HOTEL LAX resort Ⅱ
    amenities: 'デザイナーズスタイリッシュルーム, 豊富なレンタル品, 充実のフードメニュー',
    reviews:
      '【評判】福島。スタイリッシュで遊び心のある内装が若者に人気。アメニティやレンタル品が非常に豊富で、急な宿泊でも安心。',
  },
  '92456f0f-b4d3-4f4b-8dd6-d52cbe8295e8': {
    // ホテル シャルム (二本松)
    amenities: 'マッサージチェア(一部), レインボーバス(一部), 42インチ以上TV, 全室VOD/Wi-Fi',
    reviews:
      '【評判】二本松。ゆったりとした室内にはマッサージチェアやレインボーバスを備える。Wi-Fi環境も整っており、長時間滞在も快適。',
  },
  'c1777d1e-62fc-4f89-b975-4fbf37be0228': {
    // ホテル シャトー
    amenities: '無料ミネラルウォーター2本, 浴室TV全室, VOD/YouTube, 全室個別レイアウト',
    reviews:
      '【評判】郡山。全室に浴室TVを完備し、バスタイムを楽しく演出。無料のミネラルウォーター2本サービスなど、細かな気配りが光る。',
  },
  '33f1c61b-232b-44df-9734-233cdd888524': {
    // ホテル フロス
    amenities:
      '50インチ以上巨大TV, ブルーレイプレーヤー, ハンドマッサージャー, ヘアアイロンレンタル',
    reviews:
      '【評判】いわき。50インチ以上の大画面TVを全室に完備。ブルーレイプレーヤーやハンドマッサージャーもあり、室内エンタメが極めて充実。',
  },
  '49e183e1-5471-4ff2-b987-3f42582b47af': {
    // HOTEL ZEN 平野 (大阪)
    amenities: '75インチ大型4Kテレビ(一部), ナノ水風呂, Chromecast全室, マイクロバブルバス',
    reviews:
      '【評判】大阪平野。75インチの巨大4Kテレビとサウンドバーによる圧倒的迫力。ナノ水とマイクロバブルのダブル効果でお肌も喜ぶ最高級スパ体験。',
  },
  '9e200a14-98ab-4157-bc93-0384e21c4b2f': {
    // HOTEL ALPHA
    amenities:
      'AIスピーカー(Alexa等), 露天風呂(一部), 日本最多級の漫画ルーム, サウナ, Netflix/PrimeVideo',
    reviews:
      '【評判】福島。AIスピーカー全室導入の先進性。日本屈指の蔵書を誇る漫画ルームや、露天風呂・サウナもあり、飽きることのない滞在。',
  },
  'cb1d8e39-c6a6-4a53-a3b1-0562f4051b6e': {
    // ホテル アビラリゾート
    amenities: '100インチプロジェクター(一部), BBＱルーム新設, 展望露天バス, スチームサウナ',
    reviews:
      '【評判】いわき。新設されたBBQルームや100インチプロジェクターなど、もはやアミューズメント施設。展望露天バスからの眺めも格別。',
  },
  'a8d46232-b38c-443a-b751-b9b006b997c6': {
    // FINE (会津若松)
    amenities: '屋上テラスラウンジ(予約貸切可), スロットマシン, 空気清浄機, 持ち込み用DVD',
    reviews:
      '【評判】会津若松。予約貸切ができる屋上テラスラウンジが最大の魅力。開放的な夜空の下、二人だけの特別な時間を過ごせる。',
  },
  '4669fb74-5490-42e2-8fb4-89e6d3836bba': {
    // La・Vita (南相馬)
    amenities: '生ビール/ソフトドリンク1杯無料, 露天風呂/天蓋ベッド(一部), 42インチ以上TV',
    reviews:
      '【評判】南相馬。来店時のウェルカムドリンクサービスが嬉しい。一部の部屋には露天風呂や天蓋ベッドがあり、南相馬トップクラスの豪華さ。',
  },
  '2f1b28eb-1230-4695-bde7-fe9a25defe1b': {
    // イースト (会津若松)
    amenities: '展望夜景客室あり, 岩盤浴/スチームサウナ(一部), 洗濯機完備ルーム',
    reviews:
      '【評判】会津若松。高層階からの夜景が美しく、ロマンチックな一夜に。岩盤浴や洗濯機付きの部屋もあり、連泊や長期滞在にも対応。',
  },
  'd61c1542-07f0-437c-85f0-ab559383e705': {
    // ホテル ベリエ
    amenities: 'ウェルカムスイーツサービス, 最新型カラオケ(高ランク室), 美味しい無料朝食',
    reviews:
      '【評判】いわき。オープン間もなく非常に清潔。ウェルカムスイーツや、宿泊者向けの温かな無料朝食など、サービス精神が旺盛。',
  },
  '56bccf28-838f-4e14-866a-b386484181e6': {
    // ホテル ナッツインリゾート
    amenities: 'ブラックライト演出, 浴室TV, マッサージチェア全室, 大型42インチ以上TV',
    reviews:
      '【評判】大玉。幻想的なブラックライトと浴室TVで大人のリラックスタイム。全室にマッサージチェアがあり、ドライブの疲れを癒やせる。',
  },
  'c0acd974-374b-4523-8842-174eb7eb19b2': {
    // ホテル 天使 (須賀川)
    amenities: '本格水餃子2人前無料サービス, 5.1chサラウンド(一部), 42インチ以上TV',
    reviews:
      '【評判】須賀川。驚きの「水餃子無料サービス」が名物。5.1chサラウンド搭載のシアタールームもあり、お腹も心も満たされる。',
  },
  '4e05d181-9d15-43fd-87d8-6556960656d7': {
    // ホテル 牡丹
    amenities: '露天風呂(一部), 本格サウナ, 50インチ以上TV, 通信カラオケ, マッサージチェア',
    reviews:
      '【評判】須賀川。露天風呂やサウナを備えた本格スパ・ホテル。50インチ以上の大画面TVもあり、設備へのこだわりが随所に。',
  },
  'e6011736-7475-4c3c-95df-8ee0689b6521': {
    // ヒミツホテル (郡山)
    amenities: '全室水中照明ブロアバス, ハンディマッサージャー, 42インチプラズマTV',
    reviews:
      '【評判】郡山。全室完備の水中照明付きブロアバスが幻想的。手頃な価格設定ながら、充実の浴室設備でコスパ重視派に大人気。',
  },
  '3f5a1492-0fe0-46c4-af4c-4712b9891c95': {
    // 100％ HOTEL (郡山)
    amenities: '国産牛すき焼き無料サービス(宿泊), 岩盤浴(一部), 浴室TV, プロ級ジェットバス',
    reviews:
      '【評判】郡山。宿泊者向けの「国産牛すき焼き」無料サービスが衝撃的。18回利用で全額OFFなど、規格外の特典でファンが多い。',
  },
  '1e5084c7-395b-4c5f-84be-0cd3ea1d9780': {
    // Love Rabbit (新潟)
    amenities: '露天風呂/岩盤浴完備, 美容器具多数レンタル, 豊富な本格フードメニュー',
    reviews:
      '【評判】新潟秋葉。隠れ家的な静かな立地で露天風呂や岩盤浴を楽しめる。美容器具の貸出が豊富で、女性からの支持が圧倒的に高い。',
  },
  '1efc69a7-7242-4ef2-8d14-940488ac2c95': {
    // ホテル うねめ
    amenities: 'JOYSOUNDカラオケ(104号室), 映画/YouTube見放題VOD, 無料ドリンク/お茶1本',
    reviews:
      '【評判】郡山。104号室のJOYSOUNDカラオケが人気。映画やYouTube見放題のVODに加え、無料飲料サービスなど基本の質が高い。',
  },
  '6171251a-68a0-4ade-a847-1059ed91108a': {
    // ホテル ギンザ (いわき)
    amenities: '天蓋ベッド(お姫様ベッド), カップ麺/軽食セルフ販売, 水中照明ジェットバス',
    reviews:
      '【評判】いわき。乙女心をくすぐる天蓋ベッドが人気。セルフ販売の軽食コーナーもあり、夜中に小腹が空いた際も安心で使い勝手が良い。',
  },
  'd2438c05-d8e2-47ea-bfa1-18ffbde9a85f': {
    // ホテル ジョイロード
    amenities: 'コタツ付き和室(一部), 65インチ巨大TV, マイクロバブルバス, 浴室20インチTV',
    reviews:
      '【評判】いわき。珍しいコタツ付き和室があり、冬場は最高に寛げる。65インチの大型TVやマイクロバブルバスなど、最新設備への更新も万全。',
  },
  '1a94ce48-2219-4513-ae2e-586418fb43d3': {
    // ホテル クイーンナッツ
    amenities: '有線放送全室, 持ち込みドリンク可, 静かな隠れ家環境, クレンジング/メンズアメニティ',
    reviews:
      '【評判】泉崎。喧騒から離れた非常に静かな環境で、落ち着いて休めると評判。派手な設備はないが、必要十分なアメニティが揃う実店舗。',
  },
};

updateMultipleHotelFacts(updates);
