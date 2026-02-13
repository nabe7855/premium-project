import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // 'approved', 'posted', 'failed', 'draft'

    let query = supabase
      .from('auto_posts')
      .select('*')
      .order('scheduled_at', { ascending: true })
      .order('created_at', { ascending: false });

    if (status) {
      if (status === 'scheduled') {
        query = query.in('status', ['approved', 'draft']);
      } else if (status === 'history') {
        query = query.in('status', ['posted', 'failed']);
      } else {
        query = query.eq('status', status);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Fetch Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error (get-posts):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
    }

    const { error } = await supabase.from('auto_posts').delete().eq('id', id);

    if (error) {
      console.error('Supabase Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error (delete-post):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
