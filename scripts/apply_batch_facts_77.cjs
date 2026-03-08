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
  // --- Batch 77:茨城・千葉高クオリティ設備 ---
  '1b06bacf-afa5-4d1e-9a9f-966461a24ba4': {
    // リバージュ
    amenities: '75インチ超大型テレビ(一部), 室内QR決済対応, ウェルカムドリンク, 清潔感重視',
    reviews:
      '【評判】那珂。75インチの特大テレビや室内でのスマホ決済など、現代の便利さを取り入れつつ、価格以上の清潔感があると好評。',
  },
  '0ce67983-49b7-41b7-9e87-42b87e80ade4': {
    // ウィズ
    amenities: '全室ハンディマッサージャー, クレカ対応自動精算機, 90分休憩プラン, アメニティ充実',
    reviews:
      '【評判】神栖。近年リニューアルされ、最新の自動精算機や2800円からの超良心的なショートタイムが新設された。使い勝手はエリアトップクラス。',
  },
  'e0424bbe-867e-4e28-aa6e-aba90f7781f3': {
    // クラウン
    amenities: '広々とした客室, 途中外出可能, 飲食物持ち込み自由, 全室Wi-Fi/VOD完備',
    reviews:
      '【評判】市原。部屋がとにかく広く、清掃も行き届いている。外出自由・持ち込み自由というルールのため、長時間滞在でもストレスがない。',
  },
  '61c8fa5b-244c-4690-a5b0-0e69ab866c20': {
    // アズマ 東茨城
    amenities: '24時間休憩・ロングタイム対応, クレカ対応自動精算システム, 各種レンタル充実',
    reviews:
      '【評判】茨城町。見た目以上に内装が綺麗。柔軟な24時間対応システムが導入され、いつでも安く長く休める「頼れるホテル」へと進化した。',
  },
  'bb2fc0f7-352c-40c5-a9e5-7269f1a7c332': {
    // マイス ルル
    amenities: '全室炭酸マイクロバブルバス, 豊富なVOD, 当日入会割引システム',
    reviews:
      '【評判】小美玉。全室に炭酸マイクロバブルバスが導入されており、美肌や疲労回復に抜群。当日入会でも割引が効くため、一見さんにも優しい。',
  },
  '43f1f579-21f7-4bd2-9ed0-28c4bbfc7c78': {
    // ファボット
    amenities: 'ミストサウナ(一部), 通信カラオケ, ジェットバス(一部), 無料コスプレ',
    reviews:
      '【評判】つくばみらい。旧ホテルからのリニューアル。特定の部屋にはミストサウナとカラオケというゴールデンコンビが備わっている。',
  },
  'd79352eb-77a4-404a-ae70-ec150c2ecac3': {
    // COVE WEST&EAST
    amenities: '1階無料ビリヤード, プラネタリウム/ハンギングチェア(一部), 大型スマートTV',
    reviews:
      '【評判】神栖。2024年末リニューアル。無料のビリヤード場やダーツ、プラネタリウムなど、ホテル全体が一つの遊園地のようで飽きさせない。',
  },
  '8e6e80a4-461c-49d0-9ba3-70247496ea23': {
    // FLOWERS
    amenities: '花コンセプトデザイナーズ, 電動マッサージャー, ベンチスタイルの特殊浴槽',
    reviews:
      '【評判】水戸。鮮やかな花をモチーフにしたハイセンスな空間。美容家電や座って入れる特殊な浴槽など、設備の一つ一つにこだわりを感じる。',
  },
  'c370b582-4a75-41ce-9d85-c713c038f2e3': {
    // neo WAKABA
    amenities: '浴室サウナ完備(一部), バルコニー(一部), 広々ベッド, 温泉旅館風サービス',
    reviews:
      '【評判】土浦。旅館のような寛ぎを目指しており、スタッフの接客が親切。広い部屋とサウナで、日常から離れたゆったりとしたステイが可能。',
  },
  'e77ca4ed-bec6-45ad-9064-2571b0508c19': {
    // ウィルカリビアン 龍ヶ崎
    amenities: '85度本格サウナ/18度水風呂(一部), 円形ジェットバス, 入浴剤＆アメニティビュッフェ',
    reviews:
      '【評判】龍ヶ崎。一部のサウナ室は本職サウナーも唸るセッティング（85度×水風呂18度）。ビュッフェ形式のアメニティで選ぶ楽しさも充実。',
  },
  'c20da24b-c64d-4c9c-a957-7b4765c2a893': {
    // ニュープリンス 東海村
    amenities: '露天風呂/岩盤浴/サウナ各種, 日焼けマシン(一部), 天蓋ベッド, ホームシアター',
    reviews:
      '【評判】東海村。露天風呂から岩盤浴、さらには日焼けマシンまで、レジャー要素を詰め込んだ「なんでもあり」の圧倒的な設備力が強み。',
  },
  'a45ac09e-b592-4ab4-acbe-709a29c25ab9': {
    // ウィルガーデン つくば
    amenities: 'ウェルカムスイーツ＆アルコール, ドリンク/シャンプー/入浴剤バー, 極上のおもてなし',
    reviews:
      '【評判】つくば。入店した瞬間から充実の無料バーコーナー（スイーツからアルコール、美容まで）が待ち受けており、満足度が極めて高い。',
  },
  'ddbd2cf7-9773-4cd5-9012-5a8f14ed9295': {
    // ヴァンヴェール
    amenities: '24時間チェックインの23時間利用プラン, リーズナブルな価格設定, 各種基本設備完備',
    reviews:
      '【評判】土浦。24時間いつでも入れてそこから23時間滞在できるという、神がかった最強のコスパプランが絶賛されている。',
  },
  'd8bb1e50-4319-481c-8c55-747f0e8b5d54': {
    // ドマーニ 水戸
    amenities:
      '本格ロウリュ対応個室サウナ(一部), 日焼けマシン, ウォーターサーバー, 充実のウェルカム特典',
    reviews:
      '【評判】水戸。自分で水をかけて蒸気を楽しむ「ロウリュサウナ」を完全個室で体験可能。イベント時のお菓子などのサービス精神も旺盛。',
  },
  'fedb60d9-7c55-4e79-8b65-447f31a558ff': {
    // ウィルカリビアン 土浦北店
    amenities: '完全プライベートガレージ, ジェットバス充実, フル無料VOD, マッサージアイテム',
    reviews:
      '【評判】土浦。口コミ投稿サイトで「全項目5点満点」を記録する超優良店。清掃レベルの高さと、顔を合わせないガレージインによる絶対の安心感が理由。',
  },
  '96f21f90-7c7d-48ed-a82f-1ddcbb80fe37': {
    // ルスティカーナ ひたちなか
    amenities:
      '全室4KフルハイビジョンTV, スチームサウナ完備, 高級デザイナーズ空間, ブルーレイプレーヤー',
    reviews:
      '【評判】ひたちなか。県北随一と謳われる高級感。全室4Kの超美麗な映像体験やスチームサウナなど、ワンランク上の大人デートに最適。',
  },
  'c17ad835-ab2d-4e98-aa2e-1cf7c3b17092': {
    // プリモ
    amenities: '全室キングサイズベッド, ミラー壁客室(一部), 大型50インチTV, 無料ウォーターサーバー',
    reviews:
      '【評判】神栖。全室で王様気分になれるキングサイズベッドを完備。鏡張りのちょっとアブノーマルなコンセプトルームも根強い人気がある。',
  },
  '1daa24a9-26af-4512-88f7-30456b9fe1e9': {
    // ツクバランド
    amenities: '設備はクラシックながら清掃徹底, 各種基本アメニティ, 超良心的価格設定',
    reviews:
      '【評判】東金。古き良き昭和のにおいがするが、水回りなどの掃除が信じられないほど徹底されている。「ただ寝るだけ」なら最強の選択肢。',
  },
};

updateMultipleHotelFacts(updates);
