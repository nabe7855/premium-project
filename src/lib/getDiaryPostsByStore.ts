import { DiaryPost } from '@/types/diary';
import { supabase } from './supabaseClient';

export async function getDiaryPostsByStore(storeSlug: string): Promise<DiaryPost[]> {
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
        cast_store_memberships (
          stores (
            slug
          )
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ getDiaryPostsByStore error:', error.message);
    return [];
  }

  // ✅ 店舗ごとにフィルタリング
  return (
    data
      ?.filter((post: any) => {
        const memberships = post.casts?.cast_store_memberships ?? [];
        const storeSlugs = memberships.map((m: any) => m.stores?.slug).filter(Boolean);
        return storeSlugs.includes(storeSlug);
      })
      .map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content ?? '',
        excerpt: post.content?.slice(0, 100) ?? '',
        date: post.created_at,
        storeSlug,
        castName: post.casts?.name ?? '不明なキャスト',
        castId: post.casts?.id ?? '',
        castSlug: post.casts?.slug ?? '',
        tags: [],
        reactions: { total: 0 },
        commentCount: 0,
      })) ?? []
  );
}
