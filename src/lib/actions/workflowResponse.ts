'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

/** 完了済みワークフローステップの回答データを取得 */
export async function getStepResponse(
  reservationId: string,
  stepId: 'counseling' | 'consent' | 'review' | 'survey',
) {
  switch (stepId) {
    case 'counseling': {
      const { data } = await supabaseAdmin
        .from('workflow_counseling')
        .select('*')
        .eq('reservation_id', reservationId)
        .maybeSingle();
      return data ?? null;
    }
    case 'consent': {
      const { data } = await supabaseAdmin
        .from('workflow_consent')
        .select('*')
        .eq('reservation_id', reservationId)
        .maybeSingle();
      return data ?? null;
    }
    case 'review': {
      const { data } = await supabaseAdmin
        .from('reviews')
        .select(
          `
          id,
          user_name,
          rating,
          comment,
          created_at,
          user_age_group,
          review_tag_links (
            review_tag_master ( name )
          )
        `,
        )
        .eq('reservation_id', reservationId)
        .maybeSingle();
      return data ?? null;
    }
    case 'survey': {
      const { data } = await supabaseAdmin
        .from('workflow_survey')
        .select('*')
        .eq('reservation_id', reservationId)
        .maybeSingle();
      return data ?? null;
    }
    default:
      return null;
  }
}
