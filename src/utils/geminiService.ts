import { CounselingData } from '@/types/counseling&survey';

/**
 * セラピスト向けのカウンセリング分析サマリーを生成します。
 * (現在はモック実装として動作し、将来的に Gemini API と連携可能です)
 */
export const analyzeCounselingForTherapist = async (data: CounselingData): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const vibe = data.treatmentVibe || '未設定';
  const expectations = data.treatmentExpectation?.join(', ') || '特になし';

  return `【AIアシスタント分析】
お客様は「${vibe}」な雰囲気を好まれており、特に「${expectations}」を重視されています。
NG項目として「${data.ngItems?.join(', ') || 'なし'}」が指定されている点に留意し、丁寧なアプローチが推奨されます。
肌質は「${data.skinType || '普通'}」とのことですので、使用する商材の選定にご注意ください。`;
};
