import { CounselingData } from '@/types/counseling&survey';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

export const generateAIContent = async (
  prompt: string,
  modelName: string = 'gemini-2.5-flash',
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const generateHotelDescription = async (
  hotelName: string,
  rawDescription: string,
): Promise<string> => {
  const prompt = `
あなたは高級ホテルポータルサイトの編集者です。
以下のホテルの「生データ」を元に、ユーザーが泊まりたくなるような魅力的で清潔感のある紹介文（300文字程度）を作成してください。

ターゲットは20代〜30代のカップルや、女子会利用の層です。

ホテル名: ${hotelName}
生データ: ${rawDescription}
`;
  return generateAIContent(prompt);
};
