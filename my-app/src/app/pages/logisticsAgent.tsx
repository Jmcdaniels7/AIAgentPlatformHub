'use client';

import { useEffect, useState } from 'react';
import { Domain } from '../types';
import { TaskFeed } from '../components/TaskFeed';
import { ChatInterface } from '../components/ChatInterface';
import { Button } from '@/components/ui/button';
import { clearMessages, archiveTask, updateTaskStatus, domainConfigs } from '../utils/storage';
import Link from 'next/link';
import { ArrowLeft, Download, Filter, Sparkles, Database, Home, Shield, Cog, ChevronDown } from 'lucide-react';

export default function MainInterface() {
  //selected domain state is lifted to main interface to allow for consistent 
  // filtering across both task feed and chat interface,
  const [selectedDomain, setSelectedDomain] = useState<Domain>('gateway');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    clearMessages();
    
    // Check for domain query parameter
    const params = new URLSearchParams(window.location.search);
    const domain = params.get('domain');
    if (domain && (domain === 'gateway' || domain === 'risk-management' || domain === 'operations')) {
      setSelectedDomain(domain as Domain);
    }
  }, []);

  const handleTaskStatusChange = (taskId: string, status: any) => {
    if (status === 'rejected') {
      archiveTask(taskId);
    } else {
      updateTaskStatus(taskId, status);
    }
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
                <h1 className="text-2xl font-bold text-white">Logistics AI Agent</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Navigation Bar */}
      <nav className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <button
            onClick={() => setSelectedDomain('gateway')}
            style={{ cursor: 'pointer' }}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md flex items-center gap-2 ${
              selectedDomain === 'gateway' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>


          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('risk-management')}
            style={{ cursor: 'pointer' }}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md flex items-center gap-2 ${
              selectedDomain === 'risk-management' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Risk Management
          </button>

          <span className="text-gray-400">|</span>
          <button
            onClick={() => setSelectedDomain('operations')}
            style={{ cursor: 'pointer' }}
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md flex items-center gap-2 ${
              selectedDomain === 'operations' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-white/60 text-gray-700 hover:text-blue-600'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Operations
          </button>
          
          <span className="text-gray-400">|</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ cursor: 'pointer' }}
              className="px-4 py-2 hover:bg-white/60 rounded-xl transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:shadow-md"
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
