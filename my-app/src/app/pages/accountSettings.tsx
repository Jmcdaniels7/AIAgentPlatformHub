'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTasks, getArchivedTasks, updateTaskStatus, domainConfigs, clearArchivedTasks } from '../utils/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TaskStatus } from '@/app/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Download, Filter, Sparkles, Database, Home, Shield, Cog, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredArchivedTasks, setFilteredArchivedTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    loadTasks();
    loadArchivedTasks();
    
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
  }, [tasks, archivedTasks, domainFilter, statusFilter, typeFilter, view]);

  const loadTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
  };

  const loadArchivedTasks = () => {
    const allArchived = getArchivedTasks();
    setArchivedTasks(allArchived);
  };

  const applyFilters = () => {
    const filterTasks = (source: Task[]) => {
      let filtered = [...source];
      
      if (domainFilter !== 'all') {
        filtered = filtered.filter(t => t.domain === domainFilter);
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
      }
      
      if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
      }
      
      return filtered;
    };

    setFilteredTasks(filterTasks(tasks));
    setFilteredArchivedTasks(filterTasks(archivedTasks));
  };

  const isTaskStatus = (status: string): status is TaskStatus => {
    return ['pending', 'in-review', 'approved', 'completed', 'rejected'].includes(status);
  };

  const handleStatusChange = (taskId: string | number, newStatus: string) => {
    if (!isTaskStatus(newStatus)) return;
    updateTaskStatus(String(taskId), newStatus);
    loadTasks();
  };

  const handleClearArchived = () => {
    clearArchivedTasks();
    setArchivedTasks([]);
    setFilteredArchivedTasks([]);
  };

  const exportToCSV = () => {
    const rowsSource = view === 'archived' ? filteredArchivedTasks : filteredTasks;
    const headers = [
      'ID',
      'Domain',
      'Type',
      'Title',
      'Description',
      'Status',
      'Timestamp',
      'Priority',
      'Read Gateway Response 1',
      'Read Gateway Response 2',
      'Read Risk Agent Response',
      'Read Operations Agent Response',
      'Write Gateway Agent Response 1',
      'Write Gateway Response 2',
      'Write Risk Agent Response',
      'Write Operations Agent Response',
      'Account ID',
      'Details'
    ];
    const rows = rowsSource.map(t => [
      t.id,
      t.domain,
      t.type,
      t.title,
      t.description,
      t.status,
      new Date(t.timestamp).toLocaleString(),
      t.priority || t.details.priority || 'N/A',
      t.readgatewayresponse1 || '',
      t.readgatewayresponse2 || '',
      t.readriskagentresponse || '',
      t.readopagentresponse || '',
      t.writegatewayagentresponse1 || '',
      t.writegatewayresponse2 || '',
      t.writeriskagentresponse || '',
      t.writeopagentresponse || '',
      t.accountid || '',
      JSON.stringify(t.details || {})
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

  const getStatusColor = (status: string) => {
    return isTaskStatus(status) ? statusColors[status] : 'bg-gray-500/10 text-gray-700 border-gray-500/20';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-6 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative px-12 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Logistics AI Agent</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Navigation Bar */}
      <nav className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Link
            href="/"
            className="px-4 py-2 hover:bg-white/60 rounded-xl transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:shadow-md"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>

          <span className="text-gray-400">|</span>
          <Link
            href="/?domain=risk-management"
            className="px-4 py-2 hover:bg-white/60 rounded-xl transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:shadow-md"
          >
            <Shield className="w-3.5 h-3.5" />
            Risk Management
          </Link>

          <span className="text-gray-400">|</span>
          <Link
            href="/?domain=operations"
            className="px-4 py-2 hover:bg-white/60 rounded-xl transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            Operations
          </Link>
        
          <span className="text-gray-400">|</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ cursor: 'pointer' }}
              className="px-4 py-2 bg-white text-blue-600 shadow-md rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <Cog className="w-3.5 h-3.5" />
              Settings
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[200px] bg-white rounded-xl shadow-xl border-2 border-gray-200 py-2 z-50">
                <div className="px-2 mb-2">
                  <Link
                    href="/account-settings"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg whitespace-nowrap"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Tasks
                  </Link>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-2 mt-2">
                  <Link
                  //this needs to be changed to the account settings page once that is created, for now it just links back to the main page
                    href="/"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg whitespace-nowrap"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-white/60 backdrop-blur-md border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">Task Database</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Complete task history and traceability
            </p>
          </div>
          <div className="flex items-center gap-3">
            {view === 'archived' && (
              <Button
                onClick={handleClearArchived}
                variant="outline"
                className="gap-2 border-2 hover:bg-red-50 hover:border-red-200"
              >
                Clear Archived
              </Button>
            )}
            <Button
              onClick={exportToCSV}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-md border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white p-1">
              <button
                onClick={() => setView('active')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  view === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setView('archived')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  view === 'archived'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Archived
              </button>
            </div>

            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-[180px] border-2">
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domainConfigs.map(d => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
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
              {view === 'archived'
                ? `${filteredArchivedTasks.length} of ${archivedTasks.length} archived tasks`
                : `${filteredTasks.length} of ${tasks.length} tasks`}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="font-semibold">Read Gateway 1</TableHead>
                <TableHead className="font-semibold">Read Gateway 2</TableHead>
                <TableHead className="font-semibold">Read Risk</TableHead>
                <TableHead className="font-semibold">Read Ops</TableHead>
                <TableHead className="font-semibold">Write Gateway 1</TableHead>
                <TableHead className="font-semibold">Write Gateway 2</TableHead>
                <TableHead className="font-semibold">Write Risk</TableHead>
                <TableHead className="font-semibold">Write Ops</TableHead>
                <TableHead className="font-semibold">Account ID</TableHead>
                <TableHead className="font-semibold">Details</TableHead>
                {view === 'active' && <TableHead className="font-semibold">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(view === 'archived' ? filteredArchivedTasks : filteredTasks).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={view === 'active' ? 19 : 18} className="text-center py-12 text-gray-500">
                    {view === 'archived' ? 'No archived tasks found' : 'No tasks found'}
                  </TableCell>
                </TableRow>
              ) : (
                (view === 'archived' ? filteredArchivedTasks : filteredTasks).map((task) => (
                  <TableRow key={task.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell className="text-xs text-gray-700">{task.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>
                          {domainConfigs.find(d => d.id === task.domain)?.icon || '•'}
                        </span>
                        <span className="capitalize font-medium">{task.domain.toString().replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {task.type.toString().replace('-', ' ')}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium line-clamp-1">{task.title}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(task.priority || task.details.priority) ? (
                        <Badge variant="outline" className="capitalize">
                          {task.priority || task.details.priority}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(task.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.readgatewayresponse1 || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.readgatewayresponse2 || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.readriskagentresponse || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.readopagentresponse || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.writegatewayagentresponse1 || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.writegatewayresponse2 || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.writeriskagentresponse || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[180px] truncate">{task.writeopagentresponse || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600">{task.accountid || '-'}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[260px] truncate">{JSON.stringify(task.details || {})}</TableCell>
                    {view === 'active' && (
                      <TableCell>
                        <Select
                          value={isTaskStatus(task.status) ? task.status : 'pending'}
                          onValueChange={(value) => handleStatusChange(task.id, value)}
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
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </div>
    </div>
  );
}