import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob;
    const tone = formData.get('tone') as string || 'standard';

    if (!audioBlob) {
      return NextResponse.json({ error: '音声データがありません' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // BlobをArrayBufferに変換
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

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
        あなたは飾らない性格の、親しみやすいセラピストとして日記を書きます。
        SNSやブログのようなラフで砕けた口調（だ・である調を織り交ぜる）で、
        本音で喋っているような、親近感のあるブログを目指してください。
      `
    };

    const prompt = `
      ${systemPrompts[tone] || systemPrompts.standard}
      
      【指示】
      添付された音声データを聞き取り、その内容を元にお客様に向けたブログ日記を作成してください。
      
      【文章構成ガイドライン】
      - 文字数は 300〜500文字 程度。
      - 音声特有の「えー」「あのー」などは削除し、読み物として完成させてください。
      - 最後にお客様へのご来店を促すメッセージで締めくくってください。
      - 出力は日記の本文のみ（タイトルやタグは不要）。
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: audioBlob.type,
          data: base64Audio
        }
      },
      { text: prompt },
    ]);

    const response = await result.response;
    const content = response.text();

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Gemini Voice Assist Error:', error);
    return NextResponse.json({ error: 'AIによる日記生成に失敗しました。' }, { status: 500 });
  }
}
