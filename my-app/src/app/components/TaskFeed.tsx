import { useState, useEffect } from 'react';
import { Domain, Task } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface TaskFeedProps {
  domain: Domain | null;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
}

export function TaskFeed({ domain, onTaskStatusChange }: TaskFeedProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
    
    const handleStorageChange = () => {
      loadTasks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tasks-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasks-updated', handleStorageChange);
    };
  }, [domain]);

  const loadTasks = () => {
    const storedTasks = localStorage.getItem('ai-agent-tasks');
    if (storedTasks) {
      const allTasks: Task[] = JSON.parse(storedTasks);
      const filtered = domain 
        ? allTasks.filter(t => t.domain === domain)
        : allTasks;
      setTasks(filtered);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Outputs</h2>
        <p className="text-sm text-gray-600">AI-generated tasks for human oversight</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-6 pr-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-1">No task outputs yet</p>
              <p className="text-sm text-gray-500">Chat with the AI agent to generate tasks</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className="group relative bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200"
              >
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-xs font-semibold">
                      Output #{index + 1}
                    </span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {task.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {task.details.priority && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Priority:</span>
                      <Badge variant="outline" className={getPriorityColor(task.details.priority)}>
                        {task.details.priority}
                      </Badge>
                    </div>
                  )}
                  
                  {task.details.recipient && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-gray-500">Recipient:</span>
                      <span className="text-xs text-gray-700">{task.details.recipient}</span>
                    </div>
                  )}
                  
                  {task.details.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-gray-700 italic">
                        "{task.details.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}