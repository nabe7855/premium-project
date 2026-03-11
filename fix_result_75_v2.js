const fs = require('fs');
const path = require('path');

const filePath =
  'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\import_results\\result_75.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. マークダウン記号（```json と ```）を削除
  content = content.replace(/```json/g, '').replace(/```/g, '');

  // 2. 二重の配列構造 [[...]] を解消するため、正規表現で内側の [ ... ] 部分を取り出しを試行
  // 読み込み時に [ と [ が重なっているので、力技で修正
  // 実際には 1行目に [ があり、3行目にも [ がある。

  // 安全な方法: すべてのテキストから [ { ... } ] の部分だけを抽出する
  const startBracket = content.indexOf('[{');
  const endBracket = content.lastIndexOf('}]');

  if (startBracket === -1 || endBracket === -1) {
    throw new Error('有効なJSON配列の開始または終了が見つかりませんでした');
  }

  const jsonStr = content.substring(startBracket, endBracket + 2);
  let data = JSON.parse(jsonStr);

  // 3. データを整形
  const fixedData = data.map((item) => {
    // デメリットの整形
    let prosCons = item.ai_pros_cons || {};
    if (prosCons.cons && typeof prosCons.cons === 'string') {
      prosCons.cons = [prosCons.cons];
    } else if (!prosCons.cons) {
      prosCons.cons = [];
    }

    // レビューの整形
    let reviews = (item.ai_reviews || []).map((rev, index) => {
      return {
        userName: rev.user_name || rev.userName || 'Guest',
        content: rev.comment || rev.content || '',
        rating: rev.rating || (index === 0 ? 5 : 4),
      };
    });

    return {
      id: item.id,
      ai_description: item.ai_description,
      ai_summary: item.ai_summary,
      ai_pros_cons: {
        pros: prosCons.pros || [],
        cons: prosCons.cons,
      },
      ai_reviews: reviews,
    };
  });

  // 4. ファイルを上書き
  fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2), 'utf8');
  console.log('SUCCESS: result_75.json を完全に修正しました。');
} catch (error) {
  console.error('ERROR:', error.message);
}
