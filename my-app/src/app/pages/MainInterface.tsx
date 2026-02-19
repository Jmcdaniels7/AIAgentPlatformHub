import { useState } from 'react';
import { Domain } from '@/app/types';
import { TaskFeed } from '@/app/components/TaskFeed';
import { ChatInterface } from '@/app/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { updateTaskStatus, domainConfigs } from '@/app/utils/storage';
import { useNavigate } from 'react-router';
import { Database, Sparkles } from 'lucide-react';

export function MainInterface() {
  const [selectedDomain, setSelectedDomain] = useState<Domain>('sales');
  const navigate = useNavigate();

  const handleTaskStatusChange = (taskId: string, status: any) => {
    updateTaskStatus(taskId, status);
    window.dispatchEvent(new Event('tasks-updated'));
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
                <Sparkles className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold text-white">AI Agent</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Navigation Bar */}
      <nav className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 hover:bg-white/60 rounded-xl transition-all duration-200 text-gray-700 hover:text-blue-600 hover:shadow-md"
          >
            Home
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('operations')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md ${
              selectedDomain === 'operations' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            Logistics
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('operations')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md ${
              selectedDomain === 'operations' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            Inventory
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('sales')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md ${
              selectedDomain === 'sales' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            Sales
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('operations')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md ${
              selectedDomain === 'operations' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            Manufacturing
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('maintenance')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md ${
              selectedDomain === 'maintenance' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            Maintenance
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 hover:bg-white/60 rounded-xl transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            Settings
          </button>
        </div>
      </nav>

      {/* Split View */}
      <div className="flex-1 grid grid-cols-[1fr_450px] overflow-hidden gap-6 p-6">
        {/* Left: Task Feed */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden p-8">
          <TaskFeed
            domain={selectedDomain}
            onTaskStatusChange={handleTaskStatusChange}
          />
        </div>

        {/* Right: Chat Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
          <ChatInterface domain={selectedDomain} />
        </div>
      </div>
    </div>
  );
}