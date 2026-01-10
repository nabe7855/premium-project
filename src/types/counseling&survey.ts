export type AppView = 'intro' | 'counseling' | 'transition' | 'survey' | 'complete' | 'admin';

export interface CounselingData {
  // A. Atmosphere
  treatmentExpectation: string[];
  treatmentVibe: string;
  trigger: string;

  // B. Body
  massageType: string;
  troubleAreas: string[];
  skinType: string;

  // C. Experience
  experienceLevel: string;
  sensitivity: string;
  wetness: string;
  erogenousZones: string;
  easyToOrgasm: {
    clitoris: string; // 'none' | 'weak' | 'medium' | 'strong'
    internal: string;
  };

  // D. Boundaries
  ngItems: string[];
  tongueUsage: string;
  closeness: string;
  toys: string;
  shower: string;
  allowableActions: string[];

  // E. Final
  additionalNotes: string;
}

export interface SurveyData {
  nickname: string;
  ageGroup: string;
  partnerStatus: string;
  inflowChannel: string[];
  searchKeyword: string;
  resistanceToTalking: number | 'none';
  sexualSatisfaction: number | 'none';
  interestReason: string[];
  priorityToday: string[];
  surveySkipped: boolean;
}

export interface SessionRecord {
  id: string;
  nickname: string;
  counseling: CounselingData;
  survey?: SurveyData;
  createdAt: string;
  deviceType: string;
  formVersion: string;
}

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale';

export interface CounselingQuestion {
  id: string;
  label: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  optional?: boolean;
  hasOther?: boolean;
}

export interface CounselingSection {
  id: string;
  title: string;
  questions: CounselingQuestion[];
}

export interface SurveyQuestion {
  id: string;
  label: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  hasOther?: boolean;
  minLabel?: string;
  maxLabel?: string;
}

export interface SurveySection {
  id: string;
  title: string;
  questions: SurveyQuestion[];
}
