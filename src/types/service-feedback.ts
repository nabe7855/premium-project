
export type RatingValue = 1 | 2 | 3 | 4 | 5 | 'no_answer';

export interface SurveyResponse {
  sessionId: string;
  submittedAt: string;
  deviceType: string;
  formVersion: string;
  
  // Block A
  overallSatisfaction: RatingValue;
  repeatIntent: RatingValue;
  recommendIntent: RatingValue;
  blockAOther?: string;

  // Block B
  bookingEase: RatingValue;
  arrivalSupport: RatingValue;
  siteUsability: RatingValue;
  priceSatisfaction: RatingValue;
  blockBOther?: string;

  // Block C
  therapistName?: string;
  serviceImpression: string[];
  technicalSatisfaction: RatingValue;
  goodPoints: string[];
  improvementPoints: string[];
  blockCOther?: string;

  // Block D
  storeImprovements: string[];
  desiredServices: string[];
  desiredHpContent: string[];
  blockDOther?: string;

  // Block E
  source: string;
  searchKeyword?: string;
  blockEOther?: string;

  // Block F
  freeText?: string;

  skippedFlag: boolean;
}

export interface StatisticsData {
  totalResponses: number;
  averageSatisfaction: number;
  sourceDistribution: { name: string; value: number }[];
  improvementRequests: { name: string; count: number }[];
  serviceRequests: { name: string; count: number }[];
}
