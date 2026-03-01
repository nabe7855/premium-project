import { supabase } from '@/lib/supabaseClient';
import { PostType } from '@/types/diary';

interface GetRelatedPostsParams {
  currentPostId: string;
  castId: string;
  storeSlug: string;
  tagNames: string[];
  limit?: number;
}

/**
 * 関連する日記を優先順位に従って取得する
 * 1. 同一キャストの投稿 (最大2件)
 * 2. 共通タグを持つ投稿 (同一店舗優先)
 * 3. 同一店舗の最新投稿
 */
export async function getRelatedPosts({
  currentPostId,
  castId,
  storeSlug,
  tagNames,
  limit = 5,
}: GetRelatedPostsParams): Promise<PostType[]> {
  try {
    const relatedPosts: PostType[] = [];
    const seenIds = new Set<string>([currentPostId]);

    // 1. 同一キャストの投稿を取得
    if (castId) {
      const { data: castPosts } = await supabase
        .from('blogs')
        .select(
          `
          id, title, content, created_at,
          casts ( id, name, image_url, slug ),
          blog_images ( image_url ),
          blog_tags ( blog_tag_master ( name ) )
        `,
        )
        .eq('cast_id', castId)
        .neq('id', currentPostId)
        .order('created_at', { ascending: false })
        .limit(2);

      if (castPosts) {
        castPosts.forEach((post) => {
          if (!seenIds.has(post.id)) {
            relatedPosts.push(formatPost(post, storeSlug));
            seenIds.add(post.id);
          }
        });
      }
    }

    // 2. 同一店舗の最新投稿を取得
    if (relatedPosts.length < limit) {
      const { data: storePosts } = await supabase
        .from('blogs')
        .select(
          `
          id, title, content, created_at,
          casts ( 
            id, name, image_url, slug,
            cast_store_memberships ( stores ( slug ) )
          ),
          blog_images ( image_url ),
          blog_tags ( blog_tag_master ( name ) )
        `,
        )
        .neq('id', currentPostId)
        .order('created_at', { ascending: false })
        .limit(limit * 3); // 多めに取ってフィルタリング

      if (storePosts) {
        storePosts.forEach((post) => {
          if (seenIds.has(post.id) || relatedPosts.length >= limit) return;

          const castNode = Array.isArray(post.casts) ? post.casts[0] : post.casts;
          const memberships = castNode?.cast_store_memberships ?? [];
          const storeSlugs = memberships.map((m: any) => m.stores?.slug).filter(Boolean);

          if (storeSlugs.includes(storeSlug)) {
            relatedPosts.push(formatPost(post, storeSlug));
            seenIds.add(post.id);
          }
        });
      }
    }

    return relatedPosts;
  } catch (error) {
    console.error('❌ Error in getRelatedPosts:', error);
    return [];
  }
}

// 内部用フォーマット関数
function formatPost(data: any, storeSlug: string): PostType {
  const castData = Array.isArray(data.casts) ? data.casts[0] : data.casts;
  return {
    id: data.id,
    title: data.title,
    content: data.content || '',
    excerpt: data.content ? data.content.slice(0, 50) : '',
    date: new Date(data.created_at).toLocaleDateString('ja-JP').replace(/\//g, '.'),
    tags: data.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) || [],
    storeSlug,
    castName: castData?.name || 'キャスト',
    castId: castData?.id || '',
    castSlug: castData?.slug || '',
    image: data.blog_images?.[0]?.image_url || 'https://via.placeholder.com/200x150?text=No+Image',
    castAvatar: castData?.image_url || 'https://via.placeholder.com/100?text=Avatar',
    readTime: Math.max(Math.ceil((data.content?.length || 0) / 400), 1),
    reactions: { total: 0, likes: 0, healing: 0, energized: 0, supportive: 0 },
    commentCount: 0,
  };
}
