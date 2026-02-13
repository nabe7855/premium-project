import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      target_site,
      content_type,
      title,
      body: content,
      genre,
      scheduled_at,
      status,
      images,
    } = body;

    // バリデーション
    if (!target_site || !content_type || !title || !content) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // データの挿入
    const { data, error } = await supabase
      .from('auto_posts')
      .insert([
        {
          target_site,
          content_type,
          title,
          body: content,
          genre: genre || null,
          images: images || [],
          scheduled_at: scheduled_at || null,
          status: status === 'approved' ? 'approved' : 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ログの記録
    await supabase.from('auto_logs').insert([
      {
        post_id: data.id,
        action: status === 'approved' ? 'approved' : 'created',
        message:
          status === 'approved' ? '記事を承認して予約しました' : '記事を下書きとして保存しました',
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Error (save-post):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
