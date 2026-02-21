export type Domain = 'gateway' | 'risk-management' | 'operations';

export type TaskType = 'email' | 'reschedule' | 'outreach' | 'reorder' | 'maintenance' | 'follow-up' | 'analysis';

export type TaskStatus = 'pending' | 'in-review' | 'approved' | 'completed' | 'rejected';

export interface Task {
  id: string;
  domain: Domain;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  timestamp: string;
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
