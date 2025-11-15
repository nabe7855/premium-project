import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: 'age-verified',
    value: 'true',
    path: '/', // ← 重要！
    httpOnly: false, // ← false にすることでブラウザでも見える
    sameSite: 'lax', // ← 'strict' だとサブリダイレクト後に送られない場合がある
    secure: false, // ← localhost環境ではfalseに（本番はtrue）
    maxAge: 60 * 60 * 24 * 30, // 30日
  });

  return response;
}
