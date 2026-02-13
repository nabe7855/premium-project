import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { topic, site_type } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
      あなたは人気店舗のSNS運用担当者です。
      読者が興味を持ち、かつSEOに強い魅力的な記事を作成してください。
      サイト種別ごとの制約：
      - ${
        site_type === 'kaikan'
          ? 'お店のニュース: タイトルは「60文字以内」で、記記号や絵文字を適度に使って目立たせてください。ジャンル（自慢情報、お得情報、お店情報、セラピ情報）を意識した内容にしてください。'
          : site_type === 'kaikanwork'
            ? '店長ブログ: 親しみやすく、お店のこだわりや雰囲気が伝わる内容にしてください。'
            : '求人ニュース: セラピスト大募集などの求人情報。給与や待遇などのメリットが伝わる、応募したくなる内容にしてください。'
      }
      
      以下の形式でJSONで返してください：
      {
        "title": "記事のタイトル",
        "body": "記事の内容（適度に改行を含める）",
        "genre": "${site_type === 'kaikan' ? 'お得情報' : ''}" 
      }
    `;

    const userPrompt = `テーマ: ${topic || '最近の店舗の様子について'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
