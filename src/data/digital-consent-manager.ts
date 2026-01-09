import { GuidelineItem } from '@/types/digital-consent-manager';

export const GUIDELINES: GuidelineItem[] = [
  { id: 0, text: '本番行為（性交、類似性交行為等）は一切禁止されています。' },
  { id: 1, text: '担当者への強要行為、暴力、迷惑行為は一切行いません。' },
  { id: 2, text: '施術（性的サービス）をうけることに同意し、その内容を理解しました。' },
  { id: 3, text: '店内のルールを遵守し、健全なサービスの提供に協力します。' },
];

export const APP_NAME = 'ConsentPlus';
export const SYSTEM_INST_TEXT =
  '本同意書は法的記録として保存されます。必ずご本人様が内容を確認し、同意を行ってください。';

export const THERAPIST_PLEDGE_TEXT =
  '私は、お客様が嫌がる行為や不快に感じる行為、合意のない行為は一切行わないことを誓約いたします。';
