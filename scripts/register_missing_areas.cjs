const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 追加したいエリアの定義
// city_idは既存のものを割り当てる（本来は市も増やすべきだが、今回は最寄りの市に紐付ける方針）
const NEW_AREAS = [
  // --- 福岡市 (fukuoka-city) ---
  { id: 'Hakata-ku', name: '博多区', city_id: 'fukuoka-city' },
  { id: 'Chuo-ku', name: '中央区', city_id: 'fukuoka-city' },
  { id: 'Higashi-ku', name: '東区', city_id: 'fukuoka-city' },
  { id: 'Minami-ku', name: '南区', city_id: 'fukuoka-city' },
  { id: 'Nishi-ku', name: '西区', city_id: 'fukuoka-city' },
  { id: 'Jonan-ku', name: '城南区', city_id: 'fukuoka-city' },
  { id: 'Sawara-ku', name: '早良区', city_id: 'fukuoka-city' },
  { id: 'Chikushino', name: '筑紫野・那珂川', city_id: 'fukuoka-city' }, // 便宜上
  { id: 'Iizuka', name: '飯塚・筑豊', city_id: 'fukuoka-city' }, // 便宜上

  // --- 北九州市 (kitakyushu-city) ---
  { id: 'Kokurakita-ku', name: '小倉北区', city_id: 'kitakyushu-city' },
  { id: 'Kokuraminami-ku', name: '小倉南区', city_id: 'kitakyushu-city' },
  { id: 'Yahatanishi-ku', name: '八幡西区', city_id: 'kitakyushu-city' },
  { id: 'Yahatahigashi-ku', name: '八幡東区', city_id: 'kitakyushu-city' },
  { id: 'Moji-ku', name: '門司区', city_id: 'kitakyushu-city' },
  { id: 'Onga', name: '遠賀・中間', city_id: 'kitakyushu-city' }, // 便宜上
  { id: 'Yukuhashi', name: '行橋・京築', city_id: 'kitakyushu-city' }, // 便宜上
  { id: 'Nogata', name: '直方・鞍手', city_id: 'kitakyushu-city' }, // 便宜上
  { id: 'Tagawa', name: '田川', city_id: 'kitakyushu-city' }, // 便宜上

  // --- 久留米市 (Kurume-shi) ---
  { id: 'Kurume', name: '久留米市街', city_id: 'Kurume-shi' },
  { id: 'Omuta', name: '大牟田・柳川', city_id: 'Kurume-shi' }, // 便宜上
  { id: 'Yame', name: '八女・筑後', city_id: 'Kurume-shi' }, // 便宜上
  { id: 'Asakura', name: '朝倉・小郡', city_id: 'Kurume-shi' }, // 便宜上
];

async function registerAreas() {
  console.log('エリアの一括登録を開始します...');

  for (const area of NEW_AREAS) {
    try {
      // 存在チェック（upsertを使うと更新日時が変わるため、既存ならスキップするcreateManyか、findUnique推奨）
      const existing = await prisma.lh_areas.findUnique({
        where: { id: area.id },
      });

      if (existing) {
        console.log(`[SKIP] ${area.name} (ID: ${area.id}) は既に存在します。`);
      } else {
        await prisma.lh_areas.create({
          data: {
            id: area.id,
            name: area.name,
            city_id: area.city_id,
          },
        });
        console.log(`[OK] ${area.name} (ID: ${area.id}) を登録しました。`);
      }
    } catch (err) {
      console.error(`[ERROR] ${area.name} (ID: ${area.id}) の登録失敗:`, err.message);
    }
  }

  console.log('完了しました。');
  await prisma.$disconnect();
}

registerAreas();
