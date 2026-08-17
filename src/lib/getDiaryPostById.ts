import { getSupabasePublicUrl } from '@/lib/image-url';
import { PostType } from '@/types/diary';
import { supabase } from './supabaseClient';

export async function getDiaryPostById(postId: string, slug: string): Promise<(PostType & { storeSlugs: string[]; primaryStoreSlug: string }) | null> {
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
      casts ( id, name, image_url, slug, is_active, cast_store_memberships ( stores ( slug ) ) ),
      blog_images ( image_url ),
      blog_tags ( blog_tag_master ( name ) ),
      is_comment_enabled,
      blog_comments ( count )
    `,
    )
    .eq('id', postId)
    .in('status', ['published', 'scheduled'])
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const castData = Array.isArray(data.casts) ? data.casts[0] : data.casts;
  if (!castData || castData.is_active === false) {
    return null;
  }

  const JP_STORES = ['fukuoka', 'yokohama'];
  const memberships = castData?.cast_store_memberships ?? [];
  const storeSlugs: string[] = Array.isArray(memberships)
    ? memberships.map((m: any) => m.stores?.slug).filter(Boolean)
    : [];

  const jpStoreSlugs = storeSlugs.filter((s) => JP_STORES.includes(s));

  if (jpStoreSlugs.length === 0) {
    return null; // .jp サイト内に正規店舗を持たない日記は 404
  }

  // アクセス中の店舗が .jp 内の所属店舗であればその店舗自身を canonical とする。そうでなければ .jp 内の第一所属店舗。
  const primaryStoreSlug = jpStoreSlugs.includes(slug) ? slug : jpStoreSlugs[0];

  const rawImage = data.blog_images?.[0]?.image_url;
  const rawImages = (data.blog_images?.map((img: any) => getSupabasePublicUrl(img.image_url)).filter(Boolean) as string[]) || [];
  const rawAvatar = castData?.image_url;

  const castName = castData?.name || 'セラピスト';
  const publishedDate = new Date(data.published_at || data.created_at);
  const jstFormattedDate = publishedDate.toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fallbackTitle = `${castName}の日記（${jstFormattedDate}）`;

  return {
    id: data.id,
    title: data.title && data.title.trim() !== '' ? data.title : fallbackTitle,
    content: data.content || '',
    excerpt: data.content ? data.content.slice(0, 100) : '',
    date: publishedDate
      .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
      .replace(/\//g, '.'),
    tags: data.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) || [],
    storeSlug: slug,
    storeSlugs: jpStoreSlugs,
    primaryStoreSlug,
    castName: castData?.name || '不明なキャスト',
    castId: castData?.id || '',
    castSlug: castData?.slug || '',
    image: (rawImage ? getSupabasePublicUrl(rawImage) : undefined) ||
      'https://images.unsplash.com/photo-1516280440614-37939bbddcd2?q=80&w=800&auto=format&fit=crop',
    images: rawImages,
    castAvatar: (rawAvatar ? getSupabasePublicUrl(rawAvatar) : undefined) ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(castData?.name || 'anonymous')}`,
    readTime: Math.max(Math.ceil((data.content?.length || 0) / 400), 1),
    commentCount: data.blog_comments?.[0]?.count || 0,
    isCommentEnabled: data.is_comment_enabled ?? true,
    reactions: { total: 0, likes: 0, healing: 0, energized: 0, supportive: 0 },
  };
}
