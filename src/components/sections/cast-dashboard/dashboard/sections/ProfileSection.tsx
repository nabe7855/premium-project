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
        voiceUrl: cast.voiceUrl ?? undefined,
      }}
      featureMasters={featureMasters}
      questionMasters={questionMasters}
      onSave={async (updated) => {
        try {
          console.log('🚀 保存開始:', updated);

          // 1. 基本情報更新
          await updateCast({
            ...updated,
            voiceUrl: updated.voiceUrl ?? null,
          });

          // 2. 特徴タグ更新
          const multi = [
            ...(updated.personalityIds ?? []),
            ...(updated.appearanceIds ?? []),
          ];
          await updateCastFeatures(updated.id, multi);

          // 3. サービス内容（レベル付き）更新
          await updateCastServices(
            updated.id,
            updated.services ?? {},
            featureMasters,
          );

          // 4. 質問回答更新
          await updateCastQuestions(updated.id, updated.questions ?? {});

          // 5. 最新情報を再取得して反映
          await refreshCastProfile(updated.id);
          
          alert('保存しました！');
        } catch (err: any) {
          console.error('❌ 保存エラー [ProfileSection]:', err);
          const errorDetail = err?.message || JSON.stringify(err);
          alert(`保存に失敗しました: ${errorDetail}`);
        }
      }}
    />
  );
}
