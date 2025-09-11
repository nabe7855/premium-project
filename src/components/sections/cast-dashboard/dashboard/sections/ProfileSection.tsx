'use client';

import React from 'react';
import ProfileEditor from '../profile-editor/ProfileEditor';
import { CastProfile, FeatureMaster, QuestionMaster } from '@/types/cast';
import { updateCast } from '@/lib/updateCast';
import { updateCastFeatures } from '@/lib/updateCastFeatures';
import { updateCastServices } from '@/lib/updateCastServices';
import { updateCastQuestions } from '@/lib/updateCastQuestions';

interface Props {
  cast: CastProfile;
  featureMasters: FeatureMaster[];
  questionMasters: QuestionMaster[];
  refreshCastProfile: (castId: string) => Promise<void>;
}

export default function ProfileSection({
  cast,
  featureMasters,
  questionMasters,
  refreshCastProfile,
}: Props) {
  return (
    <ProfileEditor
      cast={{
        ...cast,
        personalityIds: cast.personalityIds ?? [],
        appearanceIds: cast.appearanceIds ?? [],
        services: cast.services ?? {},
        questions: cast.questions ?? {},
        voiceUrl: cast.voiceUrl ?? undefined, // ✅ 音声URLを正しく型に合わせる
      }}
      featureMasters={featureMasters}
      questionMasters={questionMasters}
      onSave={async (updated) => {
        try {
          // ✅ voiceUrl も一緒に更新対象に含める
          await updateCast({
            ...updated,
            voiceUrl: updated.voiceUrl ?? null,
          });

          const multi = [
            ...(updated.personalityIds ?? []),
            ...(updated.appearanceIds ?? []),
          ];
          await updateCastFeatures(updated.id, multi);
          await updateCastServices(
            updated.id,
            updated.services ?? {},
            featureMasters,
          );
          await updateCastQuestions(updated.id, updated.questions ?? {});
          await refreshCastProfile(updated.id);
          alert('保存しました！');
        } catch (err) {
          console.error('保存エラー:', err);
          alert('保存に失敗しました');
        }
      }}
    />
  );
}
