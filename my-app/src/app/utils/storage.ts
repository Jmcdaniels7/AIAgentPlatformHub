import { Domain, Task, ChatMessage, DomainConfig, TaskStatus } from '../types';

const TASKS_KEY = 'ai-agent-tasks';
const MESSAGES_KEY = 'ai-agent-messages';
const ARCHIVED_TASKS_KEY = 'ai-agent-archived-tasks';

export const domainConfigs: DomainConfig[] = [
  {
    id: 'gateway',
    name: 'Logistics AI agent',
    description: 'Coordinate shipments, track deliveries, address risk concerns, and optimize routes',
    color: 'bg-blue-500',
    icon: '💼',
    systemPrompt: 'You are a logistics AI assistant. Help with risk-management and operation domains.'
  },
  {
    id: 'risk-management',
    name: 'Risk Management AI Agent',
    description: 'Identify potential risks, analyze data, and provide insights to mitigate issues',
    color: 'bg-green-500',
    icon: '🎧',
    systemPrompt: 'You are a risk management AI assistant. Help with identifying risks, analyzing data, and providing mitigation strategies.'
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

export function archiveTask(taskId: string): void {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const [task] = tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  const archived = getArchivedTasks();
  archived.unshift({ ...task, status: 'rejected' });
  saveArchivedTasks(archived);
}

export function getArchivedTasks(): Task[] {
  const data = localStorage.getItem(ARCHIVED_TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveArchivedTasks(tasks: Task[]): void {
  localStorage.setItem(ARCHIVED_TASKS_KEY, JSON.stringify(tasks));
}

export function clearArchivedTasks(): void {
  localStorage.removeItem(ARCHIVED_TASKS_KEY);
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

export function clearMessages(): void {
  localStorage.removeItem(MESSAGES_KEY);
}

export function getDomainConfig(domain: Domain): DomainConfig | undefined {
  return domainConfigs.find(d => d.id === domain);
}