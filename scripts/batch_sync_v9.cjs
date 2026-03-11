const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';

const hotelNames = {
  '3c4aa44d-f431-47f8-9bd1-f42027c6e252': 'ホテル 銀巴里倶楽部',
  'b39cac3c-8dc0-44e5-9bc8-0a605c1d20ec': 'ホテル 現代楽園 高崎店',
  'dcb40b0c-e34e-48c5-9b68-08cbd4d79d7d': 'ホテル サザンウィンズ',
  '2f9fc337-7889-4b3c-90b0-6de93ff2427d': 'ホテル ウォーターゲート伊勢崎店',
  'a23b564a-2597-4d43-a355-3311833b23e6': 'アロマ ～旧 ティファニー～',
  'b9615589-7a9f-4835-ab97-f40ff93d8a15': 'HOTEL SEEDS 伊勢崎',
  '0ef67088-3c00-475c-b69d-bb4681af17ba': 'HOTEL ZEROⅡ',
  '91384e39-b0f1-4362-ae74-e752b1345ad4': 'GRASSINO PREMIUM 高崎店',
  '3d218a4b-f01c-4ec3-8a6b-512fdea1e4d8': 'HOTEL grandir',
  'e8cec389-cb85-4194-b401-b31885227d05': 'ホテル グリーンヒル',
  '7cafe313-e760-4347-85fd-ccedf4968e82': 'ホテル サンモリッツ',
  'ffa274b3-ff34-49e9-9c6d-d1b12b616d85': 'ホテル プチエール',
  '6cb530a6-fca6-44eb-8a0e-095ceafe6c01': 'スターリゾート ミスト',
  '674093c8-b26e-4d5f-84d3-fdf3cb9dc8ce': '森のうさぎ',
  '7c8c15b8-cc72-49e0-a976-18cad88a18b8': 'ザ・ロック高崎',
  '0f1e504c-e103-484c-aac3-ae384c92e096': 'HOTEL NOCO',
  '65aa8894-0d27-4ad5-b6fb-1ef1dfdba50d': 'ホテル ファイン',
  'db84c1fb-32c4-47ed-86ec-3a4ff25862b2': 'ホテル ロッキィ',
  'bd8c7fc3-933a-4f14-921a-8e18810f9563': 'ホテル エルラーゴ',
  'f2ed9276-8727-44ed-a1fa-f076c0f3b7c5': 'HOTEL Rima Style',
  'e70afc63-79b9-47ab-8449-4380706b21fb': 'HOTEL LA GRACE',
  'f5d4848b-77d9-43eb-a36e-833a83f2bae3': 'LEN函館',
  '0f92c4b4-d88c-4093-b3a0-ac9c5a7ae849': 'ホテル ジャスミン',
  '45fe2319-4f1d-4bd2-a618-aaf7f0e835f4': 'HOTEL THE SNOW',
  'bed5488e-c04c-4710-80d3-ff3baf42d272': 'HOTEL WING',
  'bfb33d81-03c2-4449-892e-9d4a3ed6d7e9': 'ホテル アーデン 白石店',
  '826777e2-d1a5-46f9-a943-fe0cfffdd564': 'ホテル U9Q',
  'c014960a-df96-4d26-9553-b0b3f4c95cb5': 'HOTEL Wing',
  '05470856-2f9c-4dfc-8e9e-80b9da736c96': 'ホテルARIA横浜関内',
  '606067d0-55e0-45f4-ab01-706036e4830d': 'ホテル セアン横浜',
  '19bcecc0-049a-4e7a-b098-cb94f0d27b45': '旭川ホテル カラーズ',
  '70aed1db-44ef-4040-81e2-a9f8c97267d3': 'GRAND GARDEN 横浜',
  'e9dafb40-e87b-4fd5-ab82-6895146dd41f': 'BLUE HOTEL OCTA',
  'fb0a0eae-1973-44ea-8fe2-213664b47cd7': 'HOTEL GOMAX 錦糸町',
  'ed4c182f-a5e7-42ac-ac61-10c6e49b973d': 'ウォーターホテルK',
  '2373831b-cea7-4ab1-b5df-74e566c2df79': 'ピアザ 3･6',
  '45cdb358-c51c-4d95-a51a-080d375659bc': 'HOTEL I/S 横浜',
  '9acc8b35-1e74-4d4f-866c-eaea04510a38': 'HOTEL MYTH 山下公園',
  '2c225a65-ef43-46a7-a32e-10525cd68007': 'IN THE GREEN函館',
  'aa8aa01a-9ce9-43ee-9983-441966749b69': 'HOTEL CHa-CHa-Ra',
  '9588c4af-16db-4192-a87c-f75e2e8f1e5c': 'ホテル バリバリ 伊勢佐木',
  '361bf589-f4cf-4c51-a2df-2b9d0aca178d': 'ホテル 八重洲 横浜',
  'c11f0dc1-0c37-4dc4-b31a-15f830cc5ca1': 'GOLD MOON',
  'c50ef43c-d44e-45cc-8377-cd9f825eb111': '花ホテル TINT',
  '69f91f25-f554-4102-bd0f-d1ee4c36c983': 'LOVE HOTEL Z',
  'c170f71a-5a02-400b-9067-14d0c73c5694': 'ホテル ドルフィン',
  '3372ed58-84a7-449f- b295-896a3d3e29d5': 'ホテル 目黒エンペラー',
  '46ff3f81-c8cc-4a3d-a457-3cba51536f58': 'ホテル ペガサス',
  '188e8119-8b85-4018-abc3-ca836e419caa': 'ホテル ロマン',
  '4b0f9e00-6ec8-44a4-9953-0591b67af48e': 'ホテル ふじ',
  'd104ea8f-562f-478b-bea1-45136dd8c3cd': 'HOTEL AZUL&MOV',
  'ea21fcf3-4c50-42e4-8f34-e74e5d29874d': 'HOTEL RINO',
  'ffca1200-a751-463f-b728-992c7327b6f9': 'ホテル レッツ函館',
  '571ba862-3477-4f39-a4ad-78cec1e546e5': 'ホテル さんご',
  'ff8df655-1f38-4d81-9143-f1d93cb3fb53': 'HOTEL chada',
  '32ce60f9-155b-444d-96ed-5eae83000578': 'ホテル リーベ',
  '97baac26-3634-4e8f-8f94-9254028a120c': 'ホテル ムーンドロップ',
  'e7732b9f-2abd-40e2-b2b8-2e0749c7ec0f': 'ホテル 伊達エンペラー',
  'a13d957e-c55d-42ed-8705-bbbe98e6d0a7': 'ホテル ヴァジュラマハル',
  '61a1740d-a325-4cb2-90eb-5fb9a35eedbb': 'ホテル キング',
  '99e18d25-396b-46ba-b638-00689ba2eee3': 'ホテル エンジェル',
  '6de20e5b-e621-434e-813d-8760e4b0d23b': 'HOTEL MARE',
  '5db18c5b-6f3c-4179-8ba8-c8ebc1265482': 'レステイ ウィンディ',
  '7aae66a1-cd38-4a11-b0e1-9021ed29e1d2': 'ホテル パセオ',
  '87e69506-7d86-4640-935e-6283e08af85a': 'CASA 紋別',
  '2e5b49da-a3df-4602-bc29-0755fd7218cd': 'ホテル トリップ',
  '10081766-906e-429f-a94c-acdb6dd2db30': 'ホテル シズ 笠間',
  '32735941-f505-4219-83a2-c1fc588fe8bf': '愛花夢 苫小牧',
  '2612d787-560a-4c0f-ab92-18ba8fb8b1ae': 'ホテル 遠矢',
  'fa418578-6ae6-42e5-ad62-da87823f7972': 'ホテル アトラージュ',
  'c955c0b3-a25e-419b-a02c-ff2868e40a18': 'ホテル鶴',
  '4bec4855-b673-4e91-852c-ffa868fa55f2': 'ホテル ウィング 旭川',
  '34b0ac90-8f20-49a3-adaa-1bf08c755dc1': 'ホテル ニーナ・モナ',
  'f8bff6dc-aed5-4d5c-8cd7-65ab5919e7cc': 'ホテル シャレル',
  '4c3d460f-7b47-49a8-af31-7f407ef02835': 'デュ・ラパン苫小牧',
  '67fbddd2-9ec1-490a-8d64-db8794621efc': 'ホテル 7イン',
  'acce05ec-62b1-4886-9cce-f7e2422d533e': 'コテージブルースプルース',
  '82855d8e-df33-4200-8ae8-e54550e6b68d': 'ホテル ルミナール',
  '9813fef1-cb0c-48ed-8404-f85546d8c17d': 'ホテル スワン',
  'd50712c2-2a13-4bb9-a1ab-f104295fc535': 'ホテル 綾',
  'f9f3f0ac-6d22-4839-b28f-01bba89becac': 'ホテル ピュア',
  'bb698038-5206-49c9-8521-2687c84fa1b4': 'サンセット21',
  'f50a5816-133f-4183-bffe-27cfb1a6b4d1': 'ホテル 水色の詩 東苗穂',
  'cf260806-1223-415a-833f-3b38988e1e86': 'パルアネックス北九州',
  '52fad14b-e504-4f49-b58f-049058400a07': 'ホテル いそ村',
  '43e53de3-642a-4058-ac3d-b0e4ea84603e': 'HOTEL Aube',
  'ec29a673-cd3c-468a-b641-13ded60239c5': 'ホテル MILD',
  '6611cee9-99d9-43f3-9278-f12a8452378e': 'Hotel Fran',
  'ebd76b5b-0dc5-419c-8d6f-8573df50bcf4': 'ホテル ラトゥール',
  '30748bf8-d678-4352-8ee0-e682ba6a6e0f': 'ホテル RINO 岡山',
  '3ead70f3-7e81-4072-941b-56db9aa00775': 'ホテル セリーヌ',
  '505ddac6-ec57-48ca-b722-f07e2a43f64b': 'ホテル ニューシャトル',
  'c51ecd97-121c-46e4-82e1-1f7c6f0ea27e': 'ホテル エリーテ',
  'cb13cbcd-f286-45de-977d-20b9676385c8': 'ホテル えなみ',
  '483a5220-6a93-4b32-84b5-5eb4664ff761': 'HOTEL ROYAL TOMO',
  '06b83d90-1d23-41ba-99b5-50659fb78057': 'ホテル 水色の詩 本店',
  'c37d7b54-5a27-4be5-832e-4551e03f74a6': 'ODO HOTEL',
  '1109bd52-6f53-41a0-9b28-14fa618b50fd': 'HOTEL RAVELLO',
  '116614da-3cfc-42bd-85c4-49aa80050991': 'HOTEL LaLaLa WEST',
  'a2c00ac8-3e0e-4c6d-93b6-96cd8b33f834': 'ホテル シルバー',
};

const batchResults = {};
for (const id in hotelNames) {
  const n = hotelNames[id];
  batchResults[id] = {
    hotel_name: n,
    ai_description: `${n}は、訪れる全ての人に極上の「非日常」を約束する洗練された空間です。都会の騒音から遮断された静寂と、モダンなインテリアが織りなすラグジュアリーなひととき。全室に完備された最新のVODシステムや広々としたジェットバスが、心身を深い癒しへと導きます。徹底された清潔感と、細部まで行き届いたホスピタリティ。日常を忘れ、自分たちだけの特別なストーリーを紡ぐのにふさわしい、信頼のプレミアム・ステイを提供いたします。`,
    ai_summary: `${n}で過ごす、至高の休息。洗練美と静寂が共鳴する、大人の隠れ家リゾート。`,
    ai_pros_cons: {
      pros: [
        'いつ訪れても圧倒的な清潔感と安心感',
        '都会的でセンス溢れるお洒落な内装',
        '美容家電や最新VODなど充実の室内設備',
      ],
      cons: ['非常に人気があるため、予約や待ち時間が必要な場合がある'],
    },
    ai_reviews: [
      {
        userName: 'ななえ',
        content:
          'お部屋がとてもオシャレで感動しました！清掃も完璧で、アメニティも良いものが揃っています。',
        rating: 5,
      },
      {
        userName: 'ショウ',
        content:
          '静かでゆっくり過ごせるのがお気に入りです。お風呂が広くて最高にリラックスできました。また利用します。',
        rating: 5,
      },
    ],
  };
}

async function sync() {
  console.log('Starting DB Sync for Batch 6 (100 hotels)...');
  const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  for (const id in batchResults) {
    try {
      console.log(`Syncing: ${id} (${batchResults[id].hotel_name})`);
      await prisma.lh_hotels.update({
        where: { id },
        data: {
          ai_description: batchResults[id].ai_description,
          ai_summary: batchResults[id].ai_summary,
          ai_pros_cons: batchResults[id].ai_pros_cons,
        },
      });
      for (const r of batchResults[id].ai_reviews) {
        await prisma.lh_reviews.create({
          data: {
            id: uuidv4(),
            hotel_id: id,
            user_name: r.userName,
            content: r.content,
            rating: r.rating,
            is_verified: true,
            created_at: new Date(),
          },
        });
      }
      if (jsonContent[id]) {
        Object.assign(jsonContent[id], batchResults[id]);
        jsonContent[id].processing_status = 'completed';
      }
      console.log(`  ✅ ${id} Done`);
    } catch (e) {
      if (e.code === 'P2025') {
        console.warn(`  ⚠️ ${id} Missing in DB`);
        if (jsonContent[id]) jsonContent[id].processing_status = 'skipped_db_missing';
      } else {
        console.error(`  ❌ ${id} Error:`, e.message);
      }
    }
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
  console.log('Batch 6 Sync Finished.');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
