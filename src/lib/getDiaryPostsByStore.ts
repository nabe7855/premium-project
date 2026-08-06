import { DiaryPost } from '@/types/diary';
import { supabase } from './supabaseClient';

export async function getDiaryPostsByStore(storeSlug: string): Promise<(DiaryPost & { primaryStoreSlug: string })[]> {
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
      casts (
        id,
        name,
        slug,
        is_active,
        cast_store_memberships (
          stores (
            slug
          )
        )
      )
    `,
    )
    .in('status', ['published', 'scheduled'])
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  if (error) {
    console.error('❌ getDiaryPostsByStore error:', error.message);
    return [];
  }

  // ✅ 店舗ごとにフィルタリング (非アクティブ・未登録を除外)
  return (
    data
      ?.filter((post: any) => {
        const castObj = Array.isArray(post.casts) ? post.casts[0] : post.casts;
        if (!castObj || castObj.is_active === false) return false;

        const memberships = castObj?.cast_store_memberships ?? [];
        const storeSlugs = memberships.map((m: any) => m.stores?.slug).filter(Boolean);
        return storeSlugs.includes(storeSlug);
      })
      .map((post: any) => {
        const castObj = Array.isArray(post.casts) ? post.casts[0] : post.casts;
        const memberships = castObj?.cast_store_memberships ?? [];
        const storeSlugs = memberships.map((m: any) => m.stores?.slug).filter(Boolean);
        const primaryStoreSlug = storeSlugs[0] || storeSlug;

        return {
          id: post.id,
          title: post.title,
          content: post.content ?? '',
          excerpt: post.content?.slice(0, 100) ?? '',
          date: post.published_at || post.created_at,
          storeSlug,
          primaryStoreSlug,
          castName: castObj?.name ?? '不明なキャスト',
          castId: castObj?.id ?? '',
          castSlug: castObj?.slug ?? '',
          tags: [],
          reactions: { total: 0 },
          commentCount: 0,
        };
      }) ?? []
  );
}
