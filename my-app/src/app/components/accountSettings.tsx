'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTasks, updateTaskStatus, domainConfigs } from '../utils/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { ArrowLeft, Download, Filter, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadTasks();
    
    const handleUpdate = () => loadTasks();
    window.addEventListener('tasks-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    return () => {
      window.removeEventListener('tasks-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, domainFilter, statusFilter, typeFilter]);

  const loadTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    
    if (domainFilter !== 'all') {
      filtered = filtered.filter(t => t.domain === domainFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    setFilteredTasks(filtered);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
    loadTasks();
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Domain', 'Type', 'Title', 'Status', 'Priority', 'Timestamp'];
    const rows = filteredTasks.map(t => [
      t.id,
      t.domain,
      t.type,
      t.title,
      t.status,
      t.details.priority || 'N/A',
      new Date(t.timestamp).toLocaleString()
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    'in-review': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    approved: 'bg-green-500/10 text-green-700 border-green-500/20',
    completed: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20'
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <h1 className="text-xl font-bold text-white">Task Database</h1>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Complete task history and traceability
            </p>
          </div>
          <Button
            onClick={exportToCSV}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-md border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-[180px] border-2">
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domainConfigs.map(d => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.icon} {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-2">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] border-2">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="reschedule">Reschedule</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="reorder">Reorder</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>

            <div className="px-4 py-2 bg-white rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700">
              {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100">
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>
                          {domainConfigs.find(d => d.id === task.domain)?.icon}
                        </span>
                        <span className="capitalize font-medium">{task.domain.replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {task.type.replace('-', ' ')}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.details.priority ? (
                        <Badge variant="outline" className="capitalize">
                          {task.details.priority}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(task.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleStatusChange(task.id, value as Task['status'])}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-review">In Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}