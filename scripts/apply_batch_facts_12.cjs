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
  '06b83d90-1d23-41ba-99b5-50659fb78057': {
    // ホテル 水色の詩 函館
    amenities:
      '露天風呂客室あり, 65型大画面TV, ReFaシャワーヘッド, サロニアヘアアイロン, ダイソンドライヤー(一部), 無料Wi-Fi',
    reviews:
      '【評判】函館。設備へのこだわりが凄まじく、最新の美容家電が使い放題。YouTubeでの情報発信も積極的で、女性人気が非常に高い。',
  },
  'c37d7b54-5a27-4be5-832e-4551e03f74a6': {
    // ODO HOTEL 福岡
    amenities:
      '全室防音設計, 無料の駄菓子/ポップコーン, 美容器具貸出豊富, ジャグジーバス(一部), 無料Wi-Fi, 駐車場予約不要',
    reviews:
      '【評判】福岡小戸。評価8.6。清潔感とスタッフの温かい対応が絶賛されている。無料の軽食サービスなどの遊び心が嬉しい。',
  },
  '1109bd52-6f53-41a0-9b28-14fa618b50fd': {
    // HOTEL RAVELLO 戸畑
    amenities:
      '全28室, コスプレルームあり(約15着常備), 駐車場ハイルーフ対応, 国道沿いでアクセス良好',
    reviews:
      '【評判】北九州戸畑。コスチュームの品揃えが豊富で、イベント気分を楽しみたいカップルに選ばれている。',
  },
  '116614da-3cfc-42bd-85c4-49aa80050991': {
    // HOTEL LaLaLa WEST 福井
    amenities: 'エアブローバス全室, 水中照明, 浴室TV完備, 50インチTV, VOD, 空気清浄機',
    reviews:
      '【評判】福井。手頃な価格でラグジュアリーな雰囲気を味わえる「水中照明付きお風呂」がロマンチックと好評。',
  },
  'a2c00ac8-3e0e-4c6d-93b6-96cd8b33f834': {
    // ホテル シルバー 久留米
    amenities: '格安ルーム料金, 駐車場ハイルーフ対応(14台), 清潔な室内, 丁寧な接客',
    reviews:
      '【評判】久留米。地域最安値クラスながら、清掃が行き届いておりスタッフの対応も良く、非常にコスパが良い。',
  },
  '68db2ff0-b4eb-4bee-b2dd-498bfe8a5053': {
    // レステイ SakuRa 函館
    amenities:
      '美味しい室内朝食, 豊富なアメニティバー, 全室カラオケ完備, 無料Wi-Fi, ビジネスプランあり',
    reviews:
      '【評判】函館。清潔感が非常に高く、朝食のパンが美味しいと評判。アメニティの選択肢も多く、手ぶらでの宿泊も安心。',
  },
  '11da512b-b2f8-48be-9c18-ed4860a1adde': {
    // HOTEL LOTUS 盛岡
    amenities:
      'ビリヤード台付き客室あり, 無料会員ドリンク/食事サービス, 巨大プロジェクター(一部), 豊富なアメニティ',
    reviews:
      '【評判】盛岡。とにかく部屋が広く、ビリヤードなどで遊べる設備が充実。会員向けの無料サービスが手厚い人気店。',
  },
  '123254d8-9252-4a83-b89c-090233b598ed': {
    // Open Heart 城 千葉
    amenities:
      '馬車ベッド(コンセプトルーム), お城のような外観, ユニークな内装, 無料Wi-Fi, 駐車場完備',
    reviews:
      '【評判】千葉大網白里。まるでお姫様気分になれるレトロで豪華な内装。ディズニー帰りのカップルにも「夢の続き」として人気。',
  },
  '1265704c-f9c7-4372-85dd-03c85d4f95d2': {
    // HOTEL ZEROⅡ 横浜
    amenities:
      'VIPルーム特大(TV2台/サウナ/マッサージチェア), 駐車場32台, 天蓋ベッド(一部), セレクトシャンプー豊富',
    reviews:
      '【評判】横浜菅田。周辺のビジネスホテルより圧倒的に広く、VIPルームの豪華設備は圧巻。コスパ重視派も満足の広さ。',
  },
  '12e6059e-325c-4488-ad30-9dfaeccad0db': {
    // Hotel You & You 富山
    amenities:
      'リニューアル済み客室, 浴室TV(一部), ジェットバス, コスプレアイテム貸出, 市内中心部アクセス良好',
    reviews:
      '【評判】富山。外観以上に中が綺麗。手頃な価格設定と、リニューアルされた清潔な空間が利用者に喜ばれている。',
  },
};

updateMultipleHotelFacts(updates);
