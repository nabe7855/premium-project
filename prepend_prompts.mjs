import fs from 'fs';
import path from 'path';

const prompt = `【統合版】ホテルデータ・高品質リライトプロンプト
あなたは高級ホテルポータルサイトの専属ライターです。入力されたJSONデータを読み込み、以下の条件で全件リライトし、JSON形式のみで出力してください。
📝 執筆の極意
完全オリジナル: テンプレートを使い回さず、ホテル名・設備・立地・アクセス・価格帯・クチコミからそのホテルならではの魅力を「情緒的」に描写してください。
具体性の追求: 「サウナ」「露天風呂」「4Kテレビ」「アメニティ」など、データにあるキーワードは必ず文章に組み込み、大人のカップルが過ごす贅沢な体験をイメージさせてください。
ターゲット: 質の高い時間を求める大人のカップル。
クチコミの物語化: 実在のユーザーのように、具体的なエピソード（「お風呂が広かった」「場所が分かりにくかったが中に入ると最高だった」等）を物語風に構成してください。
💎 出力仕様 (JSONのみ)
各ホテルに対して以下のフィールドを持つ配列として出力してください。
id: 元のIDを保持
ai_description: 250-400文字の魅力的な紹介文
ai_summary: 40文字程度の心に刺さるキャッチコピー
ai_pros_cons: メリット3点（配列） / デメリット1点（配列）
ai_reviews: 後述のルールに基づく配列（userName, content, rating）
⚠️ 重要：メリット・デメリット (ai_pros_cons) のルール
メリット(3点): ホテルの設備、サービス、立地、コスパ等から抽出。
デメリット(1点のみ):
「existing_reviews」に具体的な不満点がある場合のみ、その事実に基づく内容を書くこと。
不満点がない場合は捏造せず、客観的な比較事実（例：「最新設備より落ち着きを重視」「人気のため週末は混みやすい」「駅から徒歩でのアクセスには少し時間がかかる」等）に留める。
根拠のない虚偽のデメリット（実際にはない清掃不備等）を生成することは厳禁。
💬 重要：クチコミ (ai_reviews) の生成件数ルール
既存の口コミ（existing_reviews）の件数に応じて、以下のロジックで生成してください。
0件の場合: 1件生成。設備や価格帯に基づき、現実的でポジティブな感想を作成。
1件の場合: 1件生成。既存の1件を要約し、他の設備情報とミックスして再構成。
2件の場合: 2件生成。既存の2件をベースに、多様な視点（設備重視、コスパ重視等）で生成。
3〜9件の場合: 3件生成。既存の声を反映しつつ、厚みのある感想を追加。
10件以上の場合: 4〜5件生成。具体性の高い体験談を深掘りして生成。
※いずれの場合も、既存データに不満点があれば必ず反映し、なければ虚偽の事実を作らないこと。

返答はJSONコードブロックのみにしてください。説明は一切不要です。

---
入力JSONデータ:
`;

const tasksDir = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/rewrite_tasks';

try {
  const files = fs.readdirSync(tasksDir).filter(f => f.startsWith('hotel_data_part_') && f.endsWith('.json'));

  console.log(`${files.length} 個のファイルにプロンプトを挿入します...`);

  files.forEach(file => {
    const filePath = path.join(tasksDir, file);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // プロンプト + オリジナルのJSON
    const newContent = `${prompt}\n${originalContent}`;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
  });

  console.log('全てのファイルへのプロンプト挿入が完了しました。');
} catch (error) {
  console.error('エラーが発生しました:', error);
  process.exit(1);
}
