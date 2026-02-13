const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- 横浜(県) -> 神奈川県 への移行開始 ---');

  // 1. 新しい「神奈川県」を作成 (なければ)
  let kanagawa = await prisma.lh_prefectures.findUnique({
    where: { id: 'Kanagawa' },
  });

  if (!kanagawa) {
    kanagawa = await prisma.lh_prefectures.create({
      data: {
        id: 'Kanagawa',
        name: '神奈川県',
      },
    });
    console.log(`[CREATE] 神奈川県を作成しました (ID: ${kanagawa.id})`);
  } else {
    console.log(`[EXIST] 神奈川県は既に存在します (ID: ${kanagawa.id})`);
  }

  // 2. 「横浜市」を探し、prefecture_id を Kanagawa に更新
  // IDは "Yokohama-shi" であることがわかっている
  const yokohamaCity = await prisma.lh_cities.findUnique({
    where: { id: 'Yokohama-shi' },
  });

  if (yokohamaCity) {
    if (yokohamaCity.prefecture_id !== 'Kanagawa') {
      await prisma.lh_cities.update({
        where: { id: 'Yokohama-shi' },
        data: { prefecture_id: 'Kanagawa' },
      });
      console.log(`[UPDATE] 横浜市の所属を神奈川県に変更しました`);
    } else {
      console.log(`[SKIP] 横浜市は既に神奈川県に所属しています`);
    }
  } else {
    console.log(`[WARN] 横浜市が見つかりませんでした。新規作成します。`);
    await prisma.lh_cities.create({
      data: {
        id: 'Yokohama-shi',
        name: '横浜市',
        prefecture_id: 'Kanagawa',
      },
    });
    console.log(`[CREATE] 横浜市を作成しました`);
  }

  // 2.5 ホテルデータの県IDも更新 (これが外部キー制約の原因)
  const hotels = await prisma.lh_hotels.updateMany({
    where: { prefecture_id: 'Yokohama' },
    data: { prefecture_id: 'Kanagawa' },
  });
  console.log(`[UPDATE] ${hotels.count}件のホテルデータの県IDを更新しました`);

  // 3. 旧データ「横浜(県)」の削除
  // ... (以降は同じだが、念のため紐づく都市がないか再確認)
  const oldPrefCities = await prisma.lh_cities.count({
    where: { prefecture_id: 'Yokohama' },
  });

  if (oldPrefCities === 0) {
    // 紐づく都市がなければ削除可能 (ホテルも移動済み)
    try {
      await prisma.lh_prefectures.delete({
        where: { id: 'Yokohama' },
      });
      console.log(`[DELETE] 旧データ「横浜(県)」を削除しました`);
    } catch (e) {
      console.error(`[ERROR] 削除に失敗しました: ${e.message}`);
    }
  } else {
    console.log(`[WARN] 旧データ「横浜(県)」にはまだ紐づく都市があります。削除をスキップします。`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
