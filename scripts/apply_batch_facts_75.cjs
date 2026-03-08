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
  // --- Batch 75: Volume + Accuracy Trade-off Facts ---
  'a8f2cf9e-e965-4e2a-a893-8567e19047ba': {
    // シャルム目黒
    amenities: 'シャンプーバー完備, 各種充電器無料レンタル, 大理石内装(一部), 広いルーム間取り',
    reviews:
      '【評判】目黒。間取りが広く清潔感がある。最上階の部屋からは晴れた日に富士山が見えるなど、景色と居住性のバランスが素晴らしい。',
  },
  'ca5d41a2-28bf-4ff5-9a08-76b84026c76f': {
    // ホテル キャメルイン 立川
    amenities: 'DVDデッキ完備, 通信カラオケ, 有線放送, 広めの浴室サイズ, 基本アメニティ充実',
    reviews:
      '【評判】立川。派手さはないが、清潔でシンプルイズベストな構成が魅力。価格もリーズナブルで、落ち着いて休みたいときにぴったり。',
  },
  'd09cdda1-ab27-43d7-b603-ae614add5810': {
    // ホテル Sプリ 阿佐ヶ谷
    amenities: '裏口からの入室システム, 大判バスタオル, 無料サービスドリンク, ジェットバス(一部)',
    reviews:
      '【評判】阿佐ヶ谷。ネット上の口コミ満点の超優良店。人目を気にせず入れる動線、清潔な部屋、ドリンクサービスなど利用者の痒い所に手が届く接客が好評。',
  },
  'c7d24e31-a2d0-4a96-bed3-1db98e513539': {
    // ホテル マリンビュー 門司
    amenities:
      '関門海峡一望の絶景ロケーション, VOD全室完備, 美容グッズルーム, コスプレルーム, ジェットバス(一部)',
    reviews:
      '【評判】門司。海峡を望む最高のロケーションが何よりの強み。美容グッズなどのサービスも豊富で、観光とホテルステイの両方を充実させたいカップルに人気。',
  },
  'e661fb65-48f1-4ac9-b511-2d3bd756d1b3': {
    // ラフェスタ国分寺
    amenities: '通信カラオケ完備, レインボーバス(一部), 大型テレビ, 多様なアメニティ貸出',
    reviews:
      '【評判】国分寺。駅近でアクセスの良さが抜群。カラオケや広々としたお風呂など設備が揃っており、長時間のサービスタイム利用を含めたコスパの高さが強み。',
  },
  'c79a2480-2aa4-4ff5-b238-c57f36b01548': {
    // ホテル 新御苑 四谷
    amenities:
      '完全禁煙ルームあり, 全室無料Wi-Fi, ウェルカムドリンクサービス, リーズナブルな価格設定',
    reviews:
      '【評判】四谷。禁煙ルームが用意されており清潔感に優れる。ウェルカムドリンクの無料サービスなど、手頃な価格帯ながら利用者に寄り添ったサービスが嬉しい。',
  },
  '8bb337fd-6678-4b73-8dd8-5fde2edc6d0a': {
    // HOTEL G7 歌舞伎町
    amenities: '最新リニューアル済み, ルームサービス対応, 全室無料Wi-Fi完備, 電子レンジ設置',
    reviews:
      '【評判】歌舞伎町。リニューアルに伴い非常に綺麗な空間に生まれ変わった。清潔な専用バスルームやルームサービスがあり、歌舞伎町内で安心して過ごせる安定感がある。',
  },
  '58893c07-a7c3-4926-9b16-ab92fb2801f7': {
    // Hotel Prestige 堀之内
    amenities: 'レインボーバス(一部), 大型TV(一部), 駐車場34台(ハイルーフ可), VODシステム',
    reviews:
      '【評判】足立。清掃が行き届いた清潔感のある部屋が高評価。ハイルーフ対応駐車場を完備し、マイカーでのドライブデート時にも気軽に立ち寄れる使い勝手の良さ。',
  },
  '197caf5a-0537-4f4b-a793-533e8594d894': {
    // レステイ小野路 町田
    amenities: '開放感ある露天風呂(一部), 無料駐車場完備, 無料Wi-Fi, 充実したルームサービス',
    reviews:
      '【評判】町田。露天風呂付きの部屋の開放感が素晴らしい。無料駐車場やルームサービスなど基本がしっかりしており、混雑を避けたお忍び利用に最適。',
  },
  '339e97a5-2a15-4ca7-aa40-ebdcc5381c69': {
    // ホテル ゆたか 神楽坂
    amenities: '冷蔵庫内ドリンク無料, 女性用スキンケア完備, ジェットバス(一部), アメニティ充実',
    reviews:
      '【評判】神楽坂。創業50年を超えるアットホームな老舗。冷蔵庫のドリンクが全て無料という太っ腹なサービスと、手ぶらで泊まれるほどのアメニティがリピーターを生む。',
  },
  'f10036b3-309c-4a74-8ad6-88fa4aeb02ab': {
    // HOTEL MASHA 池袋
    amenities:
      '本格ドライサウナ特別室(501/502号), 無料ミネラルウォーター2本, 迅速なヘアアイロン貸出',
    reviews:
      '【評判】池袋。とにかく「部屋が広くて綺麗」と評判。特別室には本格サウナがあり、フロントからアイロン等の貸出品がすぐに届くなどサービス水準の高さが際立つ。',
  },
  '83aaa40d-d836-46b3-9874-ea5efa45e06e': {
    // ホテル桜ヶ丘 多摩
    amenities: 'フランスベッド製寝具全室, アニメ聖地巡礼推奨, ジェットバス(一部), アメニティ充実',
    reviews:
      '【評判】多摩。全室フランスベッドで快眠を保証。アニメ聖地巡礼の拠点としても公式で推奨されており、一人利用からビジネスまで幅広く受け入れる懐の深いホテル。',
  },
  '25ffbf8a-b43f-42ae-a930-075c6b0168bd': {
    // Villa City aoto 青戸
    amenities: 'ブラックライト演出(一部), 通信カラオケ, 浴室広め, ヘアアイロン＆充電器貸出',
    reviews:
      '【評判】青戸。駅から徒歩1分という圧倒的な近さ。建物はレトロだが、広めのお風呂や良心的なサービスタイム価格など、「安くてゆったりできる」コスパの良さが人気。',
  },
  '33b185a7-678b-40fd-bd24-6fc181b174f0': {
    // HOTEL MYTH-L 千葉
    amenities:
      'レインボーブロアバス全室, 2Wayアイロン全室完備, ブルーレイプレーヤー全室, 浴室TV(一部)',
    reviews:
      '【評判】千葉。全室にレインボーバスや2Wayアイロンを備えるなど標準設備のレベルが非常に高い。手ぶらで来店しても確実に快適な時間を過ごすことができる。',
  },
  'c69e0a88-eef3-46b9-afe8-0d79615eb251': {
    // Hotel SANA resort 新小岩
    amenities: '丸型ベッド(一部), LGスタイラー(一部), フェイススチーマー, 充実の入浴剤アメニティ',
    reviews:
      '【評判】新小岩。リニューアルによりLGスタイラー(自動衣服ケア)や丸型ベッドなど最新設備を導入。接客の優しさやホットアイマスクなどの細やかな気配りも完璧。',
  },
  'df862470-5e74-48ad-8e85-b62829114339': {
    // KOYADO HOTEL 根岸
    amenities:
      '高級和風内装(石と木), 完全非対面自動チェックイン, 寝心地良い特注ベッド, 清潔感抜群のタイル床シャワー',
    reviews:
      '【評判】鶯谷/根岸。無人フロントで誰にも会わずに入室可能。部屋はコンパクトだが高級感のある和風デザインで、上質なベッドと清潔さにより極上の「隠れ家」として人気。',
  },
};

updateMultipleHotelFacts(updates);
