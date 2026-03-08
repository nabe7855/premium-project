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
  // --- Batch 64: Landmark Entertainment & Resort Facts ---
  '066d24fa-98d9-4c17-8518-bd9eb8cffb53': {
    // ホテル リージェント (名古屋)
    amenities: '室内ウォータースライダー, メリーゴーランド, プライベートプール, 広大駐車場',
    reviews:
      '【評判】名古屋。もはやホテルの域を超えたアミューズメント施設。室内ウォータースライダーやメリーゴーランドなど、日本でも唯一無二の衝撃的な設備が大人気。',
  },
  '1ad720bf-a478-4089-84fc-437cd942f6ac': {
    // ホテル アマーレ (福岡須崎町)
    amenities: '那珂川リバービュー, ジャグジーバス, ミラブルシャワー, 50型以上大型TV',
    reviews:
      '【評判】福岡。中洲まで徒歩圏内の好立地。那珂川を望むリバービューの客室が人気で、ミラブルシャワーなどの美容設備も充実している安定した一軒。',
  },
  'cb4c545e-b355-4c68-a480-29aae4d6d927': {
    // 天然温泉 HOTEL 海 KAI (福岡)
    amenities: '高アルカリ天然温泉, マッサージチェア, 浴室TV, 50型以上大型TV/VOD',
    reviews:
      '【評判】福岡。トロトロの肌触りが自慢の高アルカリ天然温泉を全室で楽しめる。本格的なマッサージチェアもあり、温泉旅館のような癒しを得られると絶賛の声。',
  },
  '1b71d08e-6a7c-44f6-b3cb-04325c4e9ec7': {
    // HOTEL555 秦野 UTSUTSU
    amenities: 'セルフロウリュサウナ(一部), ビリヤード/ダーツ, レコードプレーヤー, 和モダンルーム',
    reviews:
      '【評判】秦野。555グループならではの洗練された空間。本格サウナやレコードなど、大人の趣味を愉しめる設備が揃っており、都会の喧騒を忘れて寛げる。',
  },
  '1ba3b560-99d3-4842-9eb4-9f9d5823501b': {
    // 555 MOTEL SHONAN (藤沢)
    amenities: 'アメリカンモーテルスタイル, 江の島至近, 全室Wi-Fi/最新VOD, 広いカースペース',
    reviews:
      '【評判】鵠沼海岸。湘南観光の拠点に最適なアメリカンモーテル。新しく清潔な客室、江の島まで徒歩圏内の立地が、感度の高い若者層から支持されている。',
  },
  'a1888215-db14-48c3-ba00-59c7f2b830b5': {
    // HOTEL LOTUS 横浜店
    amenities: '大正ロマンコンセプト, 露天風呂(一部), 共有ビリヤード/ダーツ, スマートTV(YouTube可)',
    reviews:
      '【評判】横浜。大正ロマンがテーマの豪華絢爛なリゾート。露天風呂付き客室や充実の共有施設など、記念日にふさわしい贅沢な時間が約束されている。',
  },
  'b36efa99-a7dc-4e67-8958-8b40e6ba29c6': {
    // 天然温泉 HOTEL 森の湯 wooods (飯塚)
    amenities: '天然温泉、絶景露天風呂(一部), ワイドテラス, 5.1chサラウンド(一部)',
    reviews:
      '【評判】飯塚。高台から街を一望できる露天風呂とワイドテラスが圧巻。天然温泉でリラックスしながら、開放的なプライベート空間を満喫できる隠れ家的名店。',
  },
  'ba3aa881-734a-4ea0-811e-65c7ac84856e': {
    // HOTEL ONE NINE (高知)
    amenities: '全室Chromecast完備, お姫様ベッド(一部), 浴室水中照明, 広い浴室',
    reviews:
      '【評判】高知。全室でスマホの動画をTVで楽しめるChromecastを完備。プリンセスベッドなどの夢のある内装と、広い浴室での水中照明が非日常を演出。',
  },
  '05ad364a-4785-4b60-8c7f-94341dd63c14': {
    // HOTEL ELDIA 山梨店
    amenities: 'レインアロマバス, 発光バスタブ, 敷地内ゲームセンター(太鼓の達人等), 露天風呂',
    reviews:
      '【評判】笛吹。巨大なゲームセンター併設でカップルから家族連れまで楽しめる。レインシャワーや光るお風呂など、エンタメ性の高いバスタイムが魅力。',
  },
  '40c65559-457d-4ee3-9ef4-67ef2b6f9ef4': {
    // ルトゥール姫路
    amenities: '男塾ホテルグループ, 広々システムバス, 最新カラオケ, 24hフード提供',
    reviews:
      '【評判】姫路。清掃が行き届いた広い部屋と、本格的な食事が自慢。男塾グループならではの安定したサービスとコスパの良さで、リピート率が非常に高い。',
  },
};

updateMultipleHotelFacts(updates);
