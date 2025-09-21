// lib/getCastBySlug.ts
import { supabase } from './supabaseClient';
import { Cast, CastStatus, Status } from '@/types/cast';

export async function getCastBySlug(castSlug: string): Promise<Cast | null> {
  const { data, error } = await supabase
    .from('casts')
    .select(`
      id,
      slug,
      name,
      age,
      catch_copy,
      main_image_url,
      image_url,
      is_active,
      sexiness_level,
      mbti:mbti_id ( name ),
      face:face_id ( name ),
      cast_statuses (
        id,
        status_id,
        is_active,
        created_at,
        status_master (
          id,
          name,
          label_color,
          text_color
        )
      )
    `)
    .eq('slug', castSlug)
    .maybeSingle();

  if (error || !data) {
    console.error('❌ getCastBySlug エラー:', error?.message);
    return null;
  }

  // 🎤 Supabase Storage の音声URL
  const { data: urlData } = supabase.storage
    .from('cast-voices')
    .getPublicUrl(`voice-${data.id}.webm`);

  // ✅ statuses を CastStatus[] に整形
  const statuses: CastStatus[] =
    (data.cast_statuses ?? []).map((s: any) => ({
      id: s.id,
      cast_id: data.id, // ← 必須の cast_id を補完
      status_id: s.status_id,
      isActive: s.is_active,
      created_at: s.created_at,
      status_master: {
        id: s.status_master.id,
        name: s.status_master.name,
        label_color: s.status_master.label_color,
        text_color: s.status_master.text_color,
      } as Status, // ✅ null を許容しないようにキャスト
    }));

return {
  id: data.id,
  slug: data.slug,
  name: data.name,
  age: data.age ?? undefined,
  catchCopy: data.catch_copy ?? undefined,
  mainImageUrl: data.main_image_url ?? undefined,
  imageUrl: data.image_url ?? undefined,
  isActive: data.is_active,

  // 🎯 単一選択なので配列チェック不要
  mbtiType: (data.mbti as any)?.name ?? undefined,
  faceType: data.face ? [(data.face as any).name] : [],

  statuses, // CastStatus[]
  sexinessLevel: data.sexiness_level ?? 3,
  sexinessStrawberry: '🍓'.repeat(data.sexiness_level ?? 3),
  voiceUrl: urlData?.publicUrl ?? undefined,
};

}
