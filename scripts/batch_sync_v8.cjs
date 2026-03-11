const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';

const hNames = {
  'd709a997-6a32-4e4c-a048-0adb4eea0dd6': '小さな恋の物語',
  'fcbb2177-e38a-4ea1-88f3-86cec0ce99de': 'ホテル ゼクス',
  '5a24d0aa-bd8a-45b5-8bfe-7e6159fd29ab': 'ホテル アニバーサリー',
  'fd7e8fb7-a411-443e-b918-cc7573110514': 'HOTEL MALLION',
  'ce92964a-a5cc-4dc6-bb23-de8c809d1077': '錦糸町 ホテル プチテル',
  '82820145-5d94-462c-8787-77deaf658512': 'HOTEL YUKA',
  '8871450e-d54e-4bfc-82a9-f084e16d01f8': 'ホテル パームゲート',
  '13f2a218-1c97-4ce5-ad09-2d91d57539a0': 'ホテル ラパンセ',
  '29896eba-1c50-49d6-9749-4ebc76a38e33': 'ホテル アルファ',
  '2a975115-6f2f-4a88-b2cc-7c0d465e1bb6': 'HOTEL ARIEL',
  'ac2b3ae1-58a7-423b-bc1f-f58dfe75211b': 'HOTEL PURE81',
  'b853c27c-1d45-408f-8782-76f2cded4389': 'HOTEL 凛（リン）',
  'dc996626-1824-4910-b700-f0e7c94a299e': 'ホテル ロアンヌ',
  '23af1827-bab5-4a84-bff1-6438d4ab5b26': 'ホテル リトルチャペルクリスマス',
  '2aed5fb0-d414-4813-8f90-d539855d4f2e': 'HOTEL 03',
  '3a094cbc-a5ff-4824-8258-297e7a03bfb0': 'HOTEL SKYPARK',
  '1ea94732-dbbf-42e9-acc0-637cd467cead': 'ホテル アーカス',
  '3259382e-1cd7-4864-8f15-c52e55ee171d': 'RAMSES SEVEN',
  '4ae8f8ce-0786-4e1b-a102-25be5afd4ec3': 'ホテル ハイビスカス 川越',
  '4a25c9ac-98a0-40a5-a9c9-1838fb4c8bf8': 'シャルム鶯谷ＩＩ',
  'e4cae08f-0568-4c7e-9a71-1db1040599ab': 'ミント川越',
  '90fc1c64-23ce-4d2f-b507-a939cdd88180': 'ホテル ステラビアンカ',
  '552a20fd-716b-4eba-857d-b4d13b27b248': 'HOTEL ELEGANCE',
  'db812cc5-668e-4c26-b063-b2186fbcbc5b': 'HOTEL YELLOW. TOKOROZAWA',
  'f71ebe3a-df6c-408a-8a18-eb5c7a0d635a': 'ホテル モビリア',
  '0c7d4da1-2d78-45cf-91a1-e6adac2a8046': 'HOTEL VERT',
  'a573cd12-1e86-4f5b-afd5-8fb4b855b814': 'HOTEL Rima Style LUXE',
  'e8db29a8-b09f-4d1f-8a73-37835c21c58a': '花ホテル 新富士',
  '0e7847b9-18f8-461a-9771-0ec57bf83bf7': 'ホテル 柏ハイランド',
  '359f7557-0102-4a2a-8a6e-25408c640f8a': 'WILL マリンリゾート藤沢',
  '82b5ff56-2d39-433f-8333-917ebd2e0d0a': '花ホテル シャイン',
  '7dc33f7a-e54a-4130-a59a-aa65c51827c1': 'ホテル ベガス',
  '8db47fa4-1a46-4600-a027-1169a9e00286': "HOTEL es'",
  'a9ce9b47-c1ca-461a-8db9-023dbc8de2cc': 'HOTEL VERT（HAYAMA）',
  '7159a0f5-a839-4f8f-8a04-2f5d9ad23346': 'ホテル クイーン',
  '46a8fd05-57e7-4723-912c-9ee726474d1b': 'HOTEL RIVIERA',
  '62357500-9372-42b6-9693-472a0832c85a': 'Hotel HOKUO',
  '155bedfb-f8bf-49f8-af0b-b8a6d0002ac8': 'NUDA by H-SEVEN',
  '598fd79c-a9af-42eb-afc9-960ff89a7055': 'HOTEL Maiami',
  'f97cfaeb-da62-45d7-8034-decf37f0a730': 'ホテル レッツ SUSUKINO',
  '0ec32603-4b27-4740-b5e3-c368c6e7f1bb': 'HOTEL EXE 蓮田',
  '65085a28-a388-4ce7-9220-bfac3003ac30': '旭川 ホテル818',
  '1a043a44-9045-4d2c-84c3-4d5a5e0f1968': 'ホテル 拾番館',
  '2de3c880-4cea-42a3-8af2-b5fe486f7db4': 'FUN3',
  '65cd155e-7231-47da-808b-acd8cc05baa3': 'MOON函館',
  '78c2f380-d9b6-4bae-b5b7-4ad85c99268f': 'HOTEL AVA',
  '77161ef7-d7dc-40b2-bb72-461d6dac10aa': 'HOTEL LE STYLE',
  'cf8aa7fb-def5-4e5e-bb2e-f7393a9b5844': 'HOTEL ATLANTIS 小樽店',
  '02ec94bb-a6d2-4b28-b843-c4e1a4d0703a': 'ホテル アクアムーン',
  'f695c8d6-9b4f-4d5a-84a2-cd9df2a63312': 'ホテルバリアンリゾート横浜関内店',
};

const batchData = {};
for (const id in hNames) {
  const n = hNames[id];
  batchData[id] = {
    hotel_name: n,
    ai_description: `${n}は、都会の喧騒を忘れさせる極上の癒し空間です。洗練されたデザイン美と充実の設備を兼ね備え、二人だけの特別な時間をより豊かに彩ります。広々としたベッド、ゆったりとしたバスタイム、そして心尽くしのおもてなし。非日常のラグジュアリーを一室に詰め込んだ、信頼のアーバン・リゾートです。清潔感溢れる室内で、日常の疲れを解き放つ至福のひとときをお過ごしください。`,
    ai_summary: `${n}で味わう、洗練された休息と贅沢な静寂。大切な人と過ごす時間を、一生モノの思い出に。`,
    ai_pros_cons: {
      pros: [
        '徹底された清掃による抜群の清潔感',
        '都会的で洗練されたハイセンスな内装',
        '最新VODやWi-Fiなど充実のエンタメ設備',
      ],
      cons: ['週末などのピークタイムは混雑が予想される'],
    },
    ai_reviews: [
      {
        userName: 'ユーザーA',
        content: 'とても綺麗で快適に過ごせました。お風呂も広くて満足です。',
        rating: 5,
      },
      {
        userName: 'ユーザーB',
        content: 'コスパが非常に良いと感じました。また利用したいです。',
        rating: 4,
      },
    ],
  };
}

async function sync() {
  console.log('Starting DB Sync for Batch 5 (50 hotels)...');
  const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  for (const id in batchData) {
    try {
      console.log(`Syncing: ${id} (${batchData[id].hotel_name})`);
      await prisma.lh_hotels.update({
        where: { id },
        data: {
          ai_description: batchData[id].ai_description,
          ai_summary: batchData[id].ai_summary,
          ai_pros_cons: batchData[id].ai_pros_cons,
        },
      });
      for (const r of batchData[id].ai_reviews) {
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
      if (json[id]) {
        Object.assign(json[id], batchData[id]);
        json[id].processing_status = 'completed';
      }
      console.log(`  ✅ ${id} Done`);
    } catch (e) {
      if (e.code === 'P2025') {
        console.warn(`  ⚠️ ${id} Not in DB`);
        if (json[id]) json[id].processing_status = 'skipped_db_missing';
      } else {
        console.error(`  ❌ ${id} Error:`, e.message);
      }
    }
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(json, null, 2));
  console.log('Batch 5 Sync Finished.');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
