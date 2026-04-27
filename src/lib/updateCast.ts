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
      weight: cast.weight,
      profile: cast.profile,
      image_url: cast.imageUrl,
      voice_url: cast.voiceUrl ?? null,
      is_active: cast.isActive, // ✅ snake_case に修正
      mbti_id: cast.mbtiId ?? null,
      animal_id: cast.animalId ?? null,
      face_id: cast.faceId ?? null,
      catch_copy: cast.catchCopy ?? null,
      sexiness_level: cast.sexinessLevel !== undefined ? Math.max(1, Math.min(5, Math.round(cast.sexinessLevel / 20))) : null,
      blood_type: cast.bloodType ?? null,
      manager_comment: cast.managerComment ?? null,
      sns_url: cast.sns ? JSON.stringify(cast.sns) : (cast.snsUrl ?? null),
    })
    .eq('id', cast.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
