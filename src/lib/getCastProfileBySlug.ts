// lib/getCastProfileBySlug.ts
import { supabase } from './supabaseClient'
import { Cast } from '@/types/cast'
import { normalizeCast } from './normalizeCast'
import { getCastQuestions } from './getCastQuestions'

export async function getCastProfileBySlug(slug: string): Promise<Cast | null> {
  console.log('🔍 getCastProfileBySlug called with slug:', slug)

  // 1. キャスト本体
  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select(`
      id,
      name,
      slug,
      age,
      height,
      profile,
      voice_url,
      is_active,
      mbti_id,
      animal_id,
      face_id,
      catch_copy,
      sexiness_level,
      blood_type,
      created_at
    `)
    .eq('slug', slug)
    .maybeSingle()

  console.log('📦 cast data:', cast)
  console.log('❌ cast error:', castError)

  if (castError || !cast) {
    console.error('🚨 キャストが見つかりません')
    return null
  }

  // 2. ギャラリー画像
  const { data: gallery, error: galleryError } = await supabase
    .from('gallery_items')
    .select(`id, image_url, caption, is_main, created_at`)
    .eq('cast_id', cast.id)
    .order('created_at', { ascending: false })

  console.log('🖼️ gallery data:', gallery)
  console.log('❌ gallery error:', galleryError)

  const mainImage = gallery?.find((g) => g.is_main) ?? gallery?.[0]

  // 3. 特徴データ
  const { data: features, error: featureError } = await supabase
    .from('cast_features')
    .select(`
      feature_id,
      level,
      feature_master:cast_features_feature_id_fkey (
        id,
        category,
        name,
        label_en
      )
    `)
    .eq('cast_id', cast.id)

  console.log('⭐ features data:', features)
  console.log('❌ features error:', featureError)

  // 4. ステータス
  const { data: statuses, error: statusError } = await supabase
    .from('cast_statuses')
    .select(`
      id,
      cast_id,
      status_id,
      is_active,
      created_at,
      status_master (
        id,
        name,
        label_color,
        text_color
      )
    `)
    .eq('cast_id', cast.id)

  console.log('📋 statuses data:', statuses)
  console.log('❌ statuses error:', statusError)

  // 5. Q&A
  console.log('🔎 Fetching castQuestions for cast.id:', cast.id)
  const castQuestions = await getCastQuestions(cast.id)
  console.log('❓ castQuestions:', castQuestions)

  // 6. 整形して返却
  const normalized = normalizeCast(
    {
      ...cast,
      main_image_url: mainImage?.image_url ?? null,
    },
    features ?? [],
    statuses ?? [],
    gallery ?? []
  )

  console.log('✅ normalized cast:', normalized)

  return {
    ...normalized,
    castQuestions: castQuestions ?? [],
  }
}
