import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
      あなたは人気店舗のトップセラピストとして、お客様に向けた「写メ日記」を執筆します。
      入力された「音声の文字起こしデータ」をもとに、以下のガイドラインに従って日記本文を生成してください。

      【ガイドライン】
      - 魅力的な導入から始め、読み手が親しみを感じる言葉遣い（丁寧語）で書いてください。
      - 文字数は 300〜500文字 程度を目指してください。
      - 文字起こし特有の「えー」「あのー」や重複は自然に削除・修正してください。
      - 適度な絵文字を使用して、華やかでプレミアムな雰囲気にしてください。
      - 最後にお客様へのご来店を促すメッセージで締めくくってください。
      
      【出力形式】
      - 純粋な日記の本文のみを出力してください（タイトルやタグは不要）。
    `;

    const userPrompt = `【文字起こしデータ】\n${transcript}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '申し訳ありません。日記の生成に失敗しました。';

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Diary Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
