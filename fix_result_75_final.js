const fs = require('fs');

const filePath =
  'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\import_results\\result_75.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // JSONとして成立させるため、壊れている末尾などを強引に補完・修正する
  // 1. マークダウン記号の削除
  content = content.replace(/```json/g, '').replace(/```/g, '');

  // 2. 配列の開始位置と終了位置を探す
  const allJsonParts = content.match(/\{[\s\S]*?\}(?=\s*,|\s*\])/g);

  if (!allJsonParts) {
    throw new Error('有効なオブジェクトが見つかりませんでした');
  }

  // 各オブジェクトを個別にパースしてみる
  const results = [];
  allJsonParts.forEach((objStr) => {
    try {
      // カンマなどで終わっている可能性があるので掃除
      const cleanStr = objStr.trim();
      const item = JSON.parse(cleanStr);

      // 整形処理
      let prosCons = item.ai_pros_cons || {};
      if (prosCons.cons && typeof prosCons.cons === 'string') {
        prosCons.cons = [prosCons.cons];
      } else if (!prosCons.cons) {
        prosCons.cons = [];
      }

      let reviews = (item.ai_reviews || []).map((rev, index) => {
        return {
          userName: rev.user_name || rev.userName || 'Guest',
          content: rev.comment || rev.content || '',
          rating: rev.rating || (index === 0 ? 5 : 4),
        };
      });

      results.push({
        id: item.id,
        ai_description: item.ai_description,
        ai_summary: item.ai_summary,
        ai_pros_cons: {
          pros: prosCons.pros || [],
          cons: prosCons.cons,
        },
        ai_reviews: reviews,
      });
    } catch (e) {
      // パース失敗したものは無視（末尾の壊れたデータなど）
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`SUCCESS: ${results.length} 件のデータを正常に修正して保存しました。`);
} catch (error) {
  console.error('ERROR:', error.message);
}
