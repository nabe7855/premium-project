import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // OpenAI Whisper に送信するために File コンストラクタを使用（Node.js 18+ / Next.js 環境）
    const file = new File([audioFile], 'recording.wav', { type: 'audio/wav' });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'ja',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('Transcription Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
