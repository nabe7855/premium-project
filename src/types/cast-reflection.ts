export enum SatisfactionLevel {
  VERY_POOR = 1,
  POOR = 2,
  NEUTRAL = 3,
  GOOD = 4,
  EXCELLENT = 5,
}

export interface SessionInfo {
  sessionId: string;
  castId: string;
  castName: string;
  dateTime: string;
  course: string;
}

export interface ReflectionData {
  satisfaction: number;
  safetyScore: number;
  successPoints: string[];
  successMemo: string;
  improvementPoints: string[];
  nextAction: string;
  customerTraits: string[];
  customerAnalysis: string;
  hasIncident: boolean;
  incidentDetail?: string;
}

export interface SessionLog extends ReflectionData {
  id: string;
  sessionInfo: SessionInfo;
  createdAt: string;
  aiAnalysis?: string;
}
