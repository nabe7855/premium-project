// src/lib/updateCast.ts
import { CastProfile } from '@/types/cast';
import { supabase } from './supabaseClient';

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
      is_active: cast.isActive, // ✅ snake_case に修正
      mbti_id: cast.mbtiId ?? null,
      animal_id: cast.animalId ?? null,
      face_id: cast.faceId ?? null,
      catch_copy: cast.catchCopy ?? null,
      sexiness_level: cast.sexinessLevel ?? null,
      blood_type: cast.bloodType ?? null,
      manager_comment: cast.managerComment ?? null,
    })
    .eq('id', cast.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
