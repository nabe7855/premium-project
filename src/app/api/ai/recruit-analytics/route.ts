import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { stats, period } = await req.json();

    if (!stats) {
      return NextResponse.json({ error: '統計データが必要です' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `
      あなたは高度なデータ分析スキルを持つ採用コンサルタントです。
      以下の求人応募統計（期間: ${period}）に基づいて、現状の分析と今後の改善アクションプランを提案してください。

      【統計データ】
      - 総応募数: ${stats.totalCount}
      - 流入経路別: ${JSON.stringify(stats.sources)}
      - ステータス分布: ${JSON.stringify(stats.statuses)}
      - 店舗別応募数: ${JSON.stringify(stats.stores)}
      - 主な応募動機・キーワード傾向: ${JSON.stringify(stats.keywords)}

      【期待する回答構成】
      1. 現状の総評（ポジティブな点と課題点）
      2. 媒体（リファラー）の投資対効果（どの媒体に注力すべきか、または改善が必要か）
      3. 具体的な改善アクション（求人原稿の修正案、ターゲット層へのアピール、面接フローの改善など）
      4. 今後の予測（このペースで進んだ場合の着地予想）

      【トーン】
      論理的でありながら、運営者のモチベーションを高める建設的なアドバイス。
      専門用語は適宜解説し、今日からできる具体的なアクションを含めてください。
      出力はHTMLタグを含まないプレーンなマークダウン形式でお願いします。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Recruit Analytics Error:', error);
    return NextResponse.json({ error: 'AIによる分析に失敗しました。' }, { status: 500 });
  }
}
