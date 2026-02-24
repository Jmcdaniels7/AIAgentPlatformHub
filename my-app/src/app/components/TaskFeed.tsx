import { useState, useEffect } from 'react';
import { Domain, Task } from '../types';
import { getTasks } from '@/app/utils/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';

interface TaskFeedProps {
  domain: Domain | null;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
}

export function TaskFeed({ domain, onTaskStatusChange }: TaskFeedProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    void loadTasks();
    
    const handleStorageChange = () => {
      void loadTasks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tasks-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasks-updated', handleStorageChange);
    };
  }, [domain]);

  const loadTasks = async () => {
    const allTasks = await getTasks();
    const filtered = domain 
      ? allTasks.filter(t => t.domain === domain)
      : allTasks;
    setTasks(filtered);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTaskId((current) => (current === task.id ? null : task.id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Outputs</h2>
        <p className="text-sm text-gray-600">AI-generated tasks for human oversight</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
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
            tasks.map((task) => (
              <div key={task.id}>
                <TaskCard
                  task={task}
                  onViewDetails={handleViewDetails}
                  onStatusChange={onTaskStatusChange}
                />
                {selectedTaskId === task.id && (
                  <div className="mt-3 rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Task Details</h3>
                        <p className="text-sm text-gray-800 font-medium">{task.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                        {task.details.recipient && (
                          <p className="text-xs text-gray-600 mt-2">
                            Recipient: {task.details.recipient}
                          </p>
                        )}
                        {task.details.scheduledDate && (
                          <p className="text-xs text-gray-600">
                            Scheduled: {task.details.scheduledDate}
                          </p>
                        )}
                        {typeof task.details.quantity === 'number' && task.details.quantity > 0 && (
                          <p className="text-xs text-gray-600">
                            Quantity: {task.details.quantity}
                          </p>
                        )}
                        {task.details.notes && (
                          <p className="text-xs text-gray-600 mt-2">Notes: {task.details.notes}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTaskId(null)}
                        className="text-xs h-7"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}