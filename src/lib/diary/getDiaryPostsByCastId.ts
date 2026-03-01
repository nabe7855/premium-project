import { PostType } from '@/types/diary';
import { supabase } from '../supabaseClient';

export async function getDiaryPostsByCastId(
  castId: string,
  storeSlug: string,
): Promise<PostType[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      id,
      title,
      content,
      created_at,
      casts (
        id,
        name,
        image_url,
        slug
      ),
      blog_images (
        image_url
      ),
      blog_tags (
        blog_tag_master ( name )
      )
    `,
    )
    .eq('cast_id', castId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ getDiaryPostsByCastId error:', error.message);
    return [];
  }

  return (
    data?.map((post: any) => {
      const castData = Array.isArray(post.casts) ? post.casts[0] : post.casts;
      return {
        id: post.id,
        title: post.title,
        content: post.content ?? '',
        excerpt: post.content?.slice(0, 100) ?? '',
        date: new Date(post.created_at).toLocaleDateString('ja-JP').replace(/\//g, '.'),
        tags: post.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) || [],
        storeSlug,
        castName: castData?.name ?? '不明なキャスト',
        castId: castData?.id || '',
        castSlug: castData?.slug || '',
        image:
          post.blog_images?.[0]?.image_url || 'https://via.placeholder.com/800x600?text=No+Image',
        image_url: post.blog_images?.[0]?.image_url,
        castAvatar: castData?.image_url || '/images/avatar-placeholder.png',
        readTime: Math.max(Math.ceil((post.content?.length || 0) / 400), 1),
        commentCount: 0,
        reactions: {
          total: 0,
          likes: 0,
          healing: 0,
          energized: 0,
          supportive: 0,
        },
      };
    }) ?? []
  );
}
