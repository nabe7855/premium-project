// src/lib/updateCast.ts
import { supabase } from './supabaseClient';
import { CastProfile } from '@/types/cast';

export async function updateCast(cast: CastProfile) {
  const { data, error } = await supabase
    .from('casts')
    .update({
      name: cast.name,
      age: cast.age,
      height: cast.height,
      profile: cast.profile,
      image_url: cast.imageUrl,
      voice_url: cast.voiceUrl ?? null,
      isActive: cast.isActive,
      mbti_id: cast.mbtiId ?? null,
      animal_id: cast.animalId ?? null,
      face_id: cast.faceId ?? null,
    })
    .eq('id', cast.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
