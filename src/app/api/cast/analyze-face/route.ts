import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API KEY の初期化
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

// 顔タイプの定義（マップに基づく）
const FACE_TYPE_DETAILS = {
  'フレッシュハード': '子供要素×直線的。爽やかで芯があり、スポーティな印象。',
  'フレッシュソフト': '子供要素×直線要素を含む。爽やかで親しみやすく、清潔感のある印象。',
  'チャーミングハード': '子供要素×曲線的。元気でアクティブ、若々しくエネルギッシュな印象。',
  'チャーミングソフト': '子供要素×曲線的。優しく可愛い、親しみやすく若々しい印象。',
  'クールハード': '大人要素×直線的。ダンディでワイルド、強い意志を感じるクールな印象。',
  'クールソフト': '大人要素×直線的要素を含む。紳士的で上品、優しく落ち着いたクールな印象。',
  'エレガントハード': '大人要素×曲線的。華やかでセクシー、強い存在感のある印象。',
  'エレガントソフト': '大人要素×曲線的要素を含む。優しく上品、フェミニンで軽やかな印象。',
};

export async function POST(req: NextRequest) {
  console.log('🚀 AI顔診断リクエスト受信');
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY が設定されていません');
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      console.warn('⚠️ 画像が送信されていません');
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // 画像データをメモリに読み込み
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString('base64');
    console.log('📸 画像データ処理完了 (Base64)');

    // Gemini へのプロンプト設定
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `分析対象の人物の顔を分析し、以下の「顔タイプ（Face Type）」の理論に基づいて最適と思われるカテゴリーを1つ選んでください。
判定基準：
1. 【子供顔 vs 大人顔】: 顔の重心の低さ、パーツの配置（目と目の間隔、目の大きさ、顔の卵型具合など）
2. 【直線 vs 曲線】: 顔立ちのシャープさ、パーツの形（アーモンド型の目なら直線、丸い目なら曲線など）

以下のカテゴリーから最も適切なものを1つだけ選び、JSON形式で返してください：
${JSON.stringify(Object.keys(FACE_TYPE_DETAILS), null, 2)}

出力フォーマット：
{
  "faceType": "カテゴリー名",
  "reason": "なぜそのカテゴリーになったかの簡潔な理由（日本語）",
  "features": ["子供/大人どちらか", "直線/曲線どちらか", "全体の雰囲気を表す単語"]
}
`;

    console.log('🤖 Gemini API呼び出し開始...');
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    console.log('📩 Gemini APIレスポンス取得完了');
    
    // JSON 部分を抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Gemini からの異常なレスポンス (JSONなし):', text);
      return NextResponse.json({ error: 'Analysis failed to produce JSON' }, { status: 500 });
    }

    const diagnosis = JSON.parse(jsonMatch[0]);
    console.log('✅ 診断完了:', diagnosis.faceType);
    return NextResponse.json(diagnosis);

  } catch (error: any) {
    console.error('❌ AI顔診断エラー詳細:', error);
    // モデルが見つからない、またはAPI制限などの詳細を返す（開発中のみ、商用ではラップ推奨）
    return NextResponse.json({ 
      error: 'Server error during analysis', 
      detail: error.message || String(error) 
    }, { status: 500 });
  }
}
