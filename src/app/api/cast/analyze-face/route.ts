import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API KEY の初期化
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

// 顔タイプの定義（マップに基づく）
const FACE_TYPE_DETAILS = {
  '章姫（あきひめ）': 'スウィート×まろやか×ソフト。優しくてふんわりしたマイルドな愛され系。塩顔よりの可愛い顔立ち。',
  'とちおとめ': 'スウィート×まろやか×リッチ。目がぱっちりでエネルギッシュ！王道の可愛い弟系。',
  'パールホワイト': 'スウィート×すっきり×ソフト。白いちごのような透明感。爽やかで繊細なあっさり塩顔ボーイ。',
  'さがほのか': 'スウィート×すっきり×リッチ。キリッと爽やかでスポーティ。男らしさもあるアクティブ系。',
  '淡雪（あわゆき）': 'ビター×まろやか×ソフト。ピンク色のいちごのような上品さ。色気がありつつアンニュイな雰囲気。',
  'あまおう': 'ビター×まろやか×リッチ。大粒で濃厚。華やかでパーツが大きく、圧倒的な大人の色気。',
  'ゆめのか': 'ビター×すっきり×ソフト。知的で洗練された印象。シュッとした綺麗な顔立ちの涼しげなイケメン。',
  'スカイベリー': 'ビター×すっきり×リッチ。スタイリッシュで美しい形。直線的で彫りが深く、頼れるクールな大人。',
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
    console.log(`📸 画像データ処理完了: ${image.name} (${image.type}), Size: ${image.size} bytes`);

    // Gemini へのプロンプト設定
    if (!apiKey) {
       console.error('❌ CRITICAL: GEMINI_API_KEY is missing');
    } else {
       console.log(`🔑 API Key status: Present, Length: ${apiKey.length}, Prefix: ${apiKey.substring(0, 6)}...`);
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `分析対象の人物の顔を分析し、以下の「顔タイプ（Face Type）」の理論に基づいて最適と思われるカテゴリーを1つ選んでください。
判定基準：
1. 【子供顔 vs 大人顔】: 顔の重心の低さ、パーツの配置（目と目の間隔、目の大きさ、顔の卵型具合など）
2. 【直線 vs 曲線】: 顔立ちのシャープさ、パーツの形（アーモンド型の目なら直線、丸い目なら曲線など）

以下のカテゴリーから最も適切なものを1つだけ選び、以下のJSON形式で返してください：
${JSON.stringify(Object.keys(FACE_TYPE_DETAILS), null, 2)}

出力フォーマット（必ずこのJSON1つだけを出力してください）：
{
  "faceType": "カテゴリー名",
  "reason": "なぜそのカテゴリーになったかの簡潔な理由（日本語）",
  "features": ["子供/大人どちらか", "直線/曲線どちらか", "全体の雰囲気を表す単語"]
}
`;

    console.log('🤖 Gemini API へのリクエスト送信開始...');
    const result = await model.generateContent([
      {
        text: prompt,
      },
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type || 'image/jpeg',
        },
      },
    ]);

    console.log('⏳ Gemini API からのレスポンス待機中...');
    const response = await result.response;
    
    // 安全性チェックなどでレスポンスが空の場合のチェック
    let text = '';
    try {
      text = response.text();
    } catch (e: any) {
      console.error('❌ Gemini レスポンス抽出失敗:', e);
      // 詳細なエラー情報を取得
      const safetyRatings = response.promptFeedback?.safetyRatings;
      console.error('🛡️ Safety Ratings:', JSON.stringify(safetyRatings));
      
      return NextResponse.json({ 
        error: 'AI analysis was blocked or failed to provide text.', 
        detail: e.message,
        safetyRatings: safetyRatings
      }, { status: 500 });
    }

    console.log('📩 Gemini レスポンス取得成功: ', text.substring(0, 50) + '...');
    
    // JSON 部分を抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Gemini からの異常なレスポンス (JSONなし):', text);
      return NextResponse.json({ 
        error: 'Analysis failed to produce JSON',
        debugText: text 
      }, { status: 500 });
    }

    try {
      const diagnosis = JSON.parse(jsonMatch[0]);
      console.log('✅ 診断完了:', diagnosis.faceType);
      return NextResponse.json(diagnosis);
    } catch (e: any) {
      console.error('❌ JSON パースエラー:', e);
      return NextResponse.json({ 
        error: 'Failed to parse AI response',
        detail: e.message,
        raw: text
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ AI顔診断エラー詳細:', error);
    return NextResponse.json({ 
      error: 'Server error during analysis', 
      detail: error.message || String(error) 
    }, { status: 500 });
  }
}
