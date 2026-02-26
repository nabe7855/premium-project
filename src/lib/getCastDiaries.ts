import { CastDiary } from '@/types/cast';
import { supabase } from './supabaseClient';

export async function getCastDiaries(castId: string): Promise<CastDiary[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      id,
      cast_id,
      title,
      content,
      created_at,
      blog_tags (
        blog_tag_master ( name )
      ),
      blog_images (
        image_url
      )
    `,
    )
    .eq('cast_id', castId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ getCastDiaries error:', error.message);
    return [];
  }

  return data.map((blog: any) => ({
    id: blog.id,
    castId: blog.cast_id,
    title: blog.title,
    content: blog.content ?? '',
    images: blog.blog_images?.map((img: any) => img.image_url) ?? [],
    tags: blog.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) ?? [],
    createdAt: blog.created_at,
  }));
}
