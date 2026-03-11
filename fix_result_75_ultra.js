const fs = require('fs');

const filePath =
  'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\import_results\\result_75.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // JSON構造を無理やり正規表現で抽出
  // 各ホテルのオブジェクト { "id": ... } をすべて見つける
  const matches = [];
  const regex = /\{\s*"id":\s*"[^"]+"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0]);
  }

  // もし末尾のオブジェクトが上記の正規表現で拾えなかった場合の予備（最後の一つ）
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const lastIndex = content.lastIndexOf(lastMatch);
    const remainingContent = content.substring(lastIndex + lastMatch.length);
    const finalMatch = remainingContent.match(/,\s*(\{\s*"id":\s*"[^"]+"[\s\S]*?\})\s*\]/);
    if (finalMatch) {
      matches.push(finalMatch[1]);
    }
  }

  const results = [];
  matches.forEach((objStr) => {
    try {
      const item = JSON.parse(objStr);

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
    } catch (e) {}
  });

  if (results.length === 0) {
    throw new Error('パース可能なオブジェクトが一つも見つかりませんでした。');
  }

  fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`SUCCESS: ${results.length} 件のデータを正常に修正して保存しました。`);
} catch (error) {
  console.error('ERROR:', error.message);
}
