export type WorkflowStepId = 'counseling' | 'consent' | 'review' | 'survey' | 'reflection';

export interface WorkflowStep {
  id: WorkflowStepId;
  label: string;
  isCompleted: boolean;
  type: 'pre' | 'post';
}

export interface Reservation {
  id: string;
  customerName: string;
  visitCount: number; // 1 = 初回, 2+ = リピート
  dateTime: string;
  status: 'pending' | 'completed';
  steps: WorkflowStep[];
}
