const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function main() {
  console.log('--- 神奈川県・横浜エリアのマスタ登録開始 ---');

  // 1. 都道府県「神奈川県」を作成
  let kanagawa = await prisma.lh_prefectures.findFirst({
    where: { name: { contains: '神奈川' } },
  });

  if (!kanagawa) {
    kanagawa = await prisma.lh_prefectures.create({
      data: {
        id: 'Kanagawa', // 任意のIDですがわかりやすく
        name: '神奈川県',
        name_kana: 'カナガワケン',
        slug: 'kanagawa',
      },
    });
    console.log(`[CREATE] 都道府県: ${kanagawa.name} (${kanagawa.id})`);
  } else {
    console.log(`[EXIST] 都道府県: ${kanagawa.name} (${kanagawa.id})`);
  }

  // 2. 市区町村「横浜市」を作成
  let yokohama = await prisma.lh_cities.findFirst({
    where: {
      prefecture_id: kanagawa.id,
      name: { contains: '横浜市' },
    },
  });

  if (!yokohama) {
    yokohama = await prisma.lh_cities.create({
      data: {
        id: 'Yokohama-shi',
        name: '横浜市',
        name_kana: 'ヨコハマシ',
        slug: 'yokohama',
        prefecture_id: kanagawa.id,
      },
    });
    console.log(`[CREATE] 市: ${yokohama.name} (${yokohama.id})`);
  } else {
    console.log(`[EXIST] 市: ${yokohama.name} (${yokohama.id})`);
  }

  // 3. 他の主要な市（川崎、相模原など）も必要であればここに追加
  // 今回は横浜メインなのでスキップ

  // 4. 横浜市内の主要エリアを作成
  // スクレイピングで出てくるエリア名を想定してIDを振る
  const areas = [
    { name: '横浜駅周辺', slug: 'yokohama-station', id: 'YokohamaStation' },
    { name: '新横浜', slug: 'shin-yokohama', id: 'ShinYokohama' },
    { name: '関内・伊勢佐木町', slug: 'kannai', id: 'Kannai' },
    { name: '元町・中華街', slug: 'motomachi', id: 'Motomachi' },
    { name: '桜木町・みなとみらい', slug: 'minatomirai', id: 'MinatoMirai' },
    { name: '戸塚・東戸塚', slug: 'totsuka', id: 'Totsuka' },
    { name: '港北・都筑', slug: 'kohoku', id: 'Kohoku' },
    { name: '金沢・磯子', slug: 'kanazawa', id: 'Kanazawa' },
    { name: '保土ヶ谷', slug: 'hodogaya', id: 'Hodogaya' },
    { name: '緑・青葉', slug: 'midori', id: 'Midori' },
    { name: '神奈川県その他', slug: 'kanagawa-other', id: 'KanagawaOther' },
    // 必要に応じて追加
  ];

  for (const area of areas) {
    try {
      const result = await prisma.lh_areas.upsert({
        where: { id: area.id },
        update: {
          name: area.name,
          city_id: yokohama.id,
        },
        create: {
          id: area.id,
          name: area.name,
          city_id: yokohama.id,
        },
      });
      console.log(`[UPSERT] エリア: ${result.name} (${result.id})`);
    } catch (e) {
      console.error(`[ERROR] エリア: ${area.name} (${area.id})`);
      console.error(e.message);
    }
  }

  console.log('--- マスタ登録完了 ---');
}

main()
  .catch((e) => {
    console.error('--- ERROR DETAILS ---');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
