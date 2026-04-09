import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { transcript, tone = 'standard' } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompts: Record<string, string> = {
      standard: `
        あなたは人気店舗のトップセラピストとして、お客様に向けた「写メ日記」を執筆します。
        親しみやすく丁寧な言葉遣い（です・ます調）で、読み手が安心感を持てる内容にしてください。
      `,
      cute: `
        あなたはアイドルのような可愛らしいセラピストとして日記を書きます。
        絵文字や感嘆符を多めに使い、語尾を「〜だょ」「〜だね❤️」など少し崩して、甘い雰囲気で親近感を持たせてください。
      `,
      professional: `
        あなたは技術に自信のある、凜としたプロのセラピストとして日記を書きます。
        誠実で落ち着いた言葉遣い（です・ます調）で、施術のこだわりやお客様への真摯な姿勢が伝わる内容にしてください。
      `,
      casual: `
        あなたは飾らない性格の、ネットに慣れ親しんだセラピストとして日記を書きます。
        2ちゃんねるやSNSのようなラフで砕けた口調（だ・である調を織り交ぜる）で、
        「〇〇ワロタ」「〜すぎて草」といったネットスラングを不自然にならない程度に使い、
        本音で喋っているような「ジャンキーなブログ感」を出してください。
      `
    };

    const systemPrompt = `
      ${systemPrompts[tone] || systemPrompts.standard}
      
      【文章構成の共通ガイドライン】
      - 文字数は 300〜500文字 程度を目指してください。
      - 文字起こし特有の「えー」「あのー」や重複は自然に削除・修正してください。
      - 最後にお客様へのご来店を促すメッセージで締めくくってください。
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
