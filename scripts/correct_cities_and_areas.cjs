const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. 今回追加する正規の市区町村リスト
const NEW_CITIES = [
  { id: 'Iizuka-shi', name: '飯塚市', prefecture_id: ' Fukuoka' },
  { id: 'Omuta-shi', name: '大牟田市', prefecture_id: ' Fukuoka' },
  { id: 'Chikushino-shi', name: '筑紫野市', prefecture_id: ' Fukuoka' },
  { id: 'Nogata-shi', name: '直方市', prefecture_id: ' Fukuoka' },
  { id: 'Yukuhashi-shi', name: '行橋市', prefecture_id: ' Fukuoka' },
  { id: 'Yame-shi', name: '八女市', prefecture_id: ' Fukuoka' },
  { id: 'Asakura-shi', name: '朝倉市', prefecture_id: ' Fukuoka' },
  { id: 'Nakama-shi', name: '中間市', prefecture_id: ' Fukuoka' },
  { id: 'Tagawa-shi', name: '田川市', prefecture_id: ' Fukuoka' },
  { id: 'Koga-shi', name: '古賀市', prefecture_id: ' Fukuoka' },
  { id: 'Munakata-shi', name: '宗像市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Dazaifu-shi', name: '太宰府市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Itoshima-shi', name: '糸島市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Kasuga-shi', name: '春日市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Onojo-shi', name: '大野城市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Fukutsu-shi', name: '福津市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Ukiha-shi', name: 'うきは市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Miyama-shi', name: 'みやま市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Yanagawa-shi', name: '柳川市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Chikugo-shi', name: '筑後市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Ogori-shi', name: '小郡市', prefecture_id: ' Fukuoka' }, // 追加
  { id: 'Nakagawa-shi', name: '那珂川市', prefecture_id: ' Fukuoka' }, // 追加
];

// 2. エリアIDと正規の市区町村IDのマッピング修正
const AREA_UPDATE_MAPPING = [
  // 飯塚エリア -> 飯塚市
  { id: 'Iizuka', city_id: 'Iizuka-shi' },
  // 大牟田・柳川エリア -> 大牟田市（代表）
  { id: 'Omuta', city_id: 'Omuta-shi' },
  // 筑紫野・那珂川エリア -> 筑紫野市（代表）
  { id: 'Chikushino', city_id: 'Chikushino-shi' },
  // 直方・鞍手エリア -> 直方市
  { id: 'Nogata', city_id: 'Nogata-shi' },
  // 行橋・京築エリア -> 行橋市
  { id: 'Yukuhashi', city_id: 'Yukuhashi-shi' },
  // 八女・筑後エリア -> 八女市
  { id: 'Yame', city_id: 'Yame-shi' },
  // 朝倉・小郡エリア -> 朝倉市
  { id: 'Asakura', city_id: 'Asakura-shi' },
  // 遠賀・中間エリア -> 中間市
  { id: 'Onga', city_id: 'Nakama-shi' },
  // 田川エリア -> 田川市
  { id: 'Tagawa', city_id: 'Tagawa-shi' },
  // 宗像・福津 -> 宗像市
  { id: 'Munakata', city_id: 'Munakata-shi' }, // まだエリア未登録かもだが念のため
  // 古賀・新宮 -> 古賀市
  { id: 'Koga', city_id: 'Koga-shi' }, // 同上
];

async function registerCorrectData() {
  console.log('--- 正しい市区町村データの登録開始 ---');

  // 1. 市区町村の登録 (upsert)
  for (const city of NEW_CITIES) {
    try {
      await prisma.lh_cities.upsert({
        where: { id: city.id },
        update: {
          name: city.name,
          prefecture_id: city.prefecture_id,
        },
        create: {
          id: city.id,
          name: city.name,
          prefecture_id: city.prefecture_id,
          count: 0,
        },
      });
      console.log(`[OK] 市区町村: ${city.name} (${city.id})`);
    } catch (e) {
      console.error(`[ERROR] 市区町村登録失敗 ${city.name}: ${e.message}`);
    }
  }

  // 2. エリア情報の更新（正しい市へ紐付け直し）
  console.log('\n--- エリアの所属市変更 ---');
  for (const mapping of AREA_UPDATE_MAPPING) {
    try {
      // エリアが存在するか確認してから更新
      const area = await prisma.lh_areas.findUnique({ where: { id: mapping.id } });
      if (area) {
        await prisma.lh_areas.update({
          where: { id: mapping.id },
          data: { city_id: mapping.city_id },
        });
        console.log(`[OK] エリア ${mapping.id} を ${mapping.city_id} に移動しました。`);
      } else {
        console.log(`[SKIP] エリア ${mapping.id} はまだ登録されていません。`);
      }
    } catch (e) {
      console.error(`[ERROR] エリア更新失敗 ${mapping.id}: ${e.message}`);
    }
  }

  console.log('\n--- 完了 ---');
  await prisma.$disconnect();
}

registerCorrectData();
