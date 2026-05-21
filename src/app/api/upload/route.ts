import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // メモリ上でバッファに変換
    const buffer = Buffer.from(await file.arrayBuffer());

    // sharp を用いて自動リサイズ・WebP圧縮（最大 1600x1600）
    const converted = await sharp(buffer)
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 拡張子を .webp に変更し、タイムスタンプを含めた一意のファイル名を作成
    const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    // 英数字以外の文字（日本語など）を削除して安全なファイル名にする
    const safeName = originalNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = `${Date.now()}_${safeName || 'image'}.webp`;
    
    // 保存パスの構築 (デフォルトは banners バケット)
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Supabase Storage に WebP としてアップロード
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, converted, {
        contentType: 'image/webp',
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
