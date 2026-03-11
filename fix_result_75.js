const fs = require('fs');
const path = require('path');

const filePath =
  'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\import_results\\result_75.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. マークダウン記号や余計な外側のカッコを掃除
  // ファイルが [ ```json [...] ] ``` ] という特殊な構造になっている可能性があるため、
  // 最も内側の配列を取り出す
  const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (!jsonMatch) {
    throw new Error('JSONの配列部分が見つかりませんでした');
  }

  let data = JSON.parse(jsonMatch[0]);

  // 2. データを整形
  const fixedData = data.map((item) => {
    // デメリットの整形
    let prosCons = item.ai_pros_cons || {};
    if (typeof prosCons.cons === 'string') {
      prosCons.cons = [prosCons.cons];
    }

    // レビューの整形
    let reviews = (item.ai_reviews || []).map((rev, index) => {
      return {
        userName: rev.user_name || rev.userName || 'Guest',
        content: rev.comment || rev.content || '',
        rating: rev.rating || (index === 0 ? 5 : 4), // 1件目は5、2件目は4をデフォルトに
      };
    });

    return {
      id: item.id,
      ai_description: item.ai_description,
      ai_summary: item.ai_summary,
      ai_pros_cons: prosCons,
      ai_reviews: reviews,
    };
  });

  // 3. ファイルを上書き
  fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2), 'utf8');
  console.log('SUCCESS: result_75.json を正常な形式に変換しました。');
} catch (error) {
  console.error('ERROR:', error.message);
}
