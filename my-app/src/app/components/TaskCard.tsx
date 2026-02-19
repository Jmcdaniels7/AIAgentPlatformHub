import { Domain, Task } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Calendar, Users, Package, Wrench, ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const taskTypeIcons = {
  email: Mail,
  reschedule: Calendar,
  outreach: Users,
  reorder: Package,
  maintenance: Wrench,
  'follow-up': ArrowRight,
  analysis: Clock
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  'in-review': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-700 border-green-500/20',
  completed: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  rejected: 'bg-red-500/10 text-red-700 border-red-500/20'
};

const priorityColors = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-red-600'
};

export function TaskCard({ task, onViewDetails, onStatusChange }: TaskCardProps) {
  const Icon = taskTypeIcons[task.type] || Mail;
  const timeAgo = formatDistanceToNow(new Date(task.timestamp), { addSuffix: true });

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            </div>
            <Badge variant="outline" className={statusColors[task.status]}>
              {task.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="capitalize">{task.type.replace('-', ' ')}</span>
            <span>•</span>
            <span>{timeAgo}</span>
            {task.details.priority && (
              <>
                <span>•</span>
                <span className={`capitalize font-medium ${priorityColors[task.details.priority]}`}>
                  {task.details.priority} priority
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(task)}
              className="text-xs h-7"
            >
              View Details
            </Button>
            
            {task.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(task.id, 'approved')}
                  className="text-xs h-7 text-green-600 border-green-600 hover:bg-green-50"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(task.id, 'rejected')}
                  className="text-xs h-7 text-red-600 border-red-600 hover:bg-red-50"
                >
                  Reject
                </Button>
              </>
            )}
            
            {task.status === 'approved' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(task.id, 'completed')}
                className="text-xs h-7"
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}