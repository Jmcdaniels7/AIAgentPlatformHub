export type Domain = 'gateway' | 'risk-management' | 'operations';

export type TaskType = 'email' | 'reschedule' | 'outreach' | 'reorder' | 'maintenance' | 'follow-up' | 'analysis';

export type TaskStatus = 'pending' | 'in-review' | 'approved' | 'completed' | 'rejected';

export interface Task {
  id: string | number;
  domain: Domain | string;
  type: TaskType | string;
  title: string;
  description: string;
  status: TaskStatus | string;
  timestamp: string;
  priority?: string | null;
  readgatewayresponse1?: string | null;
  readgatewayresponse2?: string | null;
  readriskagentresponse?: string | null;
  readopagentresponse?: string | null;
  writegatewayagentresponse1?: string | null;
  writegatewayresponse2?: string | null;
  writeriskagentresponse?: string | null;
  writeopagentresponse?: string | null;
  accountid?: string;
  details: {
    recipient?: string;
    scheduledDate?: string;
    company?: string;
    quantity?: number;
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    [key: string]: any;
  };
}

export interface ChatMessage {
  id: string;
  domain: Domain;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DomainConfig {
  id: Domain;
  name: string;
  description: string;
  color: string;
  icon: string;
  systemPrompt: string;
}
