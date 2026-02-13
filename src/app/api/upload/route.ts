import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ファイル拡張子の取得
    const fileExt = file.name.split('.').pop();
    // タイムスタンプを含めた一意のファイル名
    const fileName = `${Date.now()}.${fileExt}`;
    // 保存パスの構築 (デフォルトは banners バケット)
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Supabase Storage にアップロード
    // バケット名は既存のコードに従い 'banners' を使用
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error(' Supabase Upload Error:', uploadError);
      return NextResponse.json(
        { error: 'Upload failed', details: uploadError.message },
        { status: 500 },
      );
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('banners').getPublicUrl(filePath);

    console.log(' Upload Success:', publicUrl);
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error(' API Upload Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
