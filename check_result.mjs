import fs from 'fs';

const originalPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/rewrite_tasks/hotel_data_part_1.json';
const resultPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/import_results/result_1.json';

try {
  // Read original
  // It starts with prompt text, then "---" and "入力JSONデータ:\n", followed by JSON.
  const originalContent = fs.readFileSync(originalPath, 'utf8');
  const jsonStartIndex = originalContent.indexOf('入力JSONデータ:\n') + '入力JSONデータ:\n'.length;
  const originalJsonString = originalContent.slice(jsonStartIndex);
  const originalData = JSON.parse(originalJsonString);
  const originalCount = Object.keys(originalData).length;

  console.log(`✅ 元データ (part 1) の件数: ${originalCount}件`);

  // Read result
  const resultContent = fs.readFileSync(resultPath, 'utf8');
  let resultData;
  
  try {
    // If it's wrapped in a markdown code block, extract the JSON
    const match = resultContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      resultData = JSON.parse(match[1]);
    } else {
      resultData = JSON.parse(resultContent);
    }
  } catch (err) {
    console.error('❌ リザルトJSONのパースに失敗しました（JSON形式が正しくない可能性があります）:', err.message);
    process.exit(1);
  }

  const resultCount = Array.isArray(resultData) ? resultData.length : Object.keys(resultData).length;
  
  console.log(`✅ リライト結果の件数: ${resultCount}件`);
  console.log('---');

  if (originalCount === resultCount) {
    console.log('🎉 件数が一致しています！');
  } else {
    console.log('⚠️ 件数が一致していません！元の件数と出力件数に差異があります。');
  }

  // Check structure
  if (Array.isArray(resultData)) {
    console.log('--- データ構造チェック ---');
    let validCount = 0;
    resultData.forEach((item, index) => {
      const keys = ['id', 'ai_description', 'ai_summary', 'ai_pros_cons', 'ai_reviews'];
      const missingKeys = keys.filter(key => !(key in item));
      if (missingKeys.length > 0) {
        console.log(`⚠️ インデックス [${index}] (ID: ${item.id}): 必須フィールドが不足しています: ${missingKeys.join(', ')}`);
      } else {
        validCount++;
      }
    });

    if (validCount === resultCount) {
      console.log('✅ 全てのデータで必須フィールドが揃っています（出力形式は正常です）。');
    }

  } else {
    console.log('⚠️ 結果が配列形式ではありません。プロンプトでは「配列として出力」と指定されていました。');
  }

} catch (err) {
  console.error('エラー:', err);
}
