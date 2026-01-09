export enum Step {
  GUIDELINES = 0,
  CLIENT_INFO = 1,
  THERAPIST_INFO = 2,
  CONFIRMATION = 3,
  COMPLETED = 4
}

export interface ConsentFormData {
  isOver18: boolean | null;
  clientNickname: string;
  therapistName: string;
  consentDate: string;
  guidelinesAgreed: boolean[];
  therapistPledgeAgreed: boolean;
  consentTextSnapshot: string;
  logId: string;
}

export interface GuidelineItem {
  id: number;
  text: string;
}
