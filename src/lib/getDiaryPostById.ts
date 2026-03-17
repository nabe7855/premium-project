import { PostType } from '@/types/diary';
import { supabase } from './supabaseClient';

export async function getDiaryPostById(postId: string, slug: string): Promise<PostType | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      id,
      title,
      content,
      status,
      published_at,
      created_at,
      casts ( id, name, image_url, slug ),
      blog_images ( image_url ),
      blog_tags ( blog_tag_master ( name ) ),
      is_comment_enabled,
      blog_comments ( count )
    `,
    )
    .eq('id', postId)
    .neq('status', 'draft')
    .lte('published_at', new Date().toISOString())
    .maybeSingle(); // 406 error might occur with .single() if no row matches filter, .maybeSingle() is safer.

  if (error || !data) {
    return null;
  }

  const castData = Array.isArray(data.casts) ? data.casts[0] : data.casts;

  return {
    id: data.id,
    title: data.title,
    content: data.content || '',
    excerpt: data.content ? data.content.slice(0, 100) : '',
    date: new Date(data.published_at || data.created_at)
      .toLocaleDateString('ja-JP')
      .replace(/\//g, '.'),
    tags: data.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) || [],
    storeSlug: slug,
    castName: castData?.name || '不明なキャスト',
    castId: castData?.id || '',
    castSlug: castData?.slug || '',
    image:
      data.blog_images?.[0]?.image_url ||
      'https://images.unsplash.com/photo-1516280440614-37939bbddcd2?q=80&w=800&auto=format&fit=crop',
    castAvatar:
      castData?.image_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(castData?.name || 'anonymous')}`,
    readTime: Math.max(Math.ceil((data.content?.length || 0) / 400), 1),
    commentCount: data.blog_comments?.[0]?.count || 0,
    isCommentEnabled: data.is_comment_enabled ?? true,
    reactions: { total: 0, likes: 0, healing: 0, energized: 0, supportive: 0 },
  };
}
