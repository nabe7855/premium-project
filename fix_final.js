const fs = require('fs');

const filePath =
  'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\import_results\\result_75.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. 各オブジェクト { "id": ... } を力技で探す
  // 閉じるカッコまでを最短一致で探す
  const matches = content.match(/\{\s*"id":\s*"[a-f0-9-]+"[\s\S]*?\}/g) || [];

  const results = [];
  matches.forEach((objStr) => {
    try {
      // カンマなどの不足を補いつつ、なんとかパースを試みる
      // descriptionなどが途切れているものはJSON.parseが失敗するのでフィルタリングされる
      const item = JSON.parse(objStr);

      const prosCons = item.ai_pros_cons || {};
      const cons = typeof prosCons.cons === 'string' ? [prosCons.cons] : prosCons.cons || [];

      const reviews = (item.ai_reviews || []).map((rev, index) => ({
        userName: rev.user_name || rev.userName || 'Guest',
        content: rev.comment || rev.content || '',
        rating: rev.rating || (index === 0 ? 5 : 4),
      }));

      results.push({
        id: item.id,
        ai_description: item.ai_description || '',
        ai_summary: item.ai_summary || '',
        ai_pros_cons: {
          pros: prosCons.pros || [],
          cons: cons,
        },
        ai_reviews: reviews,
      });
    } catch (e) {
      // 途切れているオブジェクトはスキップ
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`SUCCESS: ${results.length} 件を修復しました。`);
} catch (error) {
  console.error('ERROR:', error.message);
}
