import { Domain, Task, ChatMessage, DomainConfig } from '../types';

const TASKS_KEY = 'ai-agent-tasks';
const MESSAGES_KEY = 'ai-agent-messages';

export const domainConfigs: DomainConfig[] = [
  {
    id: 'gateway',
    name: 'Logistics AI agent',
    description: 'Handle outreach, follow-ups, and deal management',
    color: 'bg-blue-500',
    icon: '💼',
    systemPrompt: 'You are a logistics AI assistant. Help with risk-management and operation domains.'
  },
  {
    id: 'risk-management',
    name: 'Risk Management AI Agent',
    description: 'Manage support tickets and customer communications',
    color: 'bg-green-500',
    icon: '🎧',
    systemPrompt: 'You are a customer service AI assistant. Help with support responses, issue resolution, and customer satisfaction.'
  },
  {
    id: 'operations',
    name: 'Operations AI Agent',
    description: 'Coordinate schedules, reorders, and logistics',
    color: 'bg-purple-500',
    icon: '⚙️',
    systemPrompt: 'You are an operations AI assistant. Help with scheduling, inventory reorders, logistics coordination, and operational efficiency.'
  },
];

export function getTasks(): Task[] {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(task: Omit<Task, 'id' | 'timestamp'>): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  tasks.unshift(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTaskStatus(taskId: string, status: TaskStatus): void {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = status;
    saveTasks(tasks);
  }
}

export function getMessages(domain?: Domain): ChatMessage[] {
  const data = localStorage.getItem(MESSAGES_KEY);
  const allMessages: ChatMessage[] = data ? JSON.parse(data) : [];
  return domain ? allMessages.filter(m => m.domain === domain) : allMessages;
}

export function saveMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const messages = getMessages();
  const newMessage: ChatMessage = {
    ...message,
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  return newMessage;
}

export function getDomainConfig(domain: Domain): DomainConfig | undefined {
  return domainConfigs.find(d => d.id === domain);
}