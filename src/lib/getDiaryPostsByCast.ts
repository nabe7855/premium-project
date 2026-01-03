import { supabase } from './supabaseClient'
import { PostType } from '@/types/diary'

export async function getDiaryPostsByCast(castId: string): Promise<PostType[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      content,
      created_at,
      blog_images (
        id,
        image_url
      ),
      blog_tags (
        id,
        blog_tag_master (
          id,
          name
        )
      )
    `)
    .eq('cast_id', castId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ getDiaryPostsByCast error:', error.message)
    return []
  }

  return (
    data?.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content ?? '',
      excerpt: post.content?.slice(0, 100) ?? '',
      date: post.created_at,
      tags: post.blog_tags?.map((t: any) => t.blog_tag_master?.name) ?? [],
      images: post.blog_images?.map((img: any) => img.image_url) ?? [],

      // PostType 固有のフィールド
      image: post.blog_images?.[0]?.image_url ?? '',   // ✅ サムネ用
      castName: '',                                    // 必要なら JOIN して埋める
      castAvatar: '/default-avatar.png',               // TODO: キャスト画像があるなら差し替え
      readTime: Math.ceil((post.content?.length ?? 0) / 500), // ✅ ざっくり読了時間
      reactions: { likes: 0, healing: 0, energized: 0, supportive: 0 }, // ✅ 初期値
    })) ?? []
  )
}
