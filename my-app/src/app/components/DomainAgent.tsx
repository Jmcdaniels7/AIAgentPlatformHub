import { useState, useEffect, useRef } from 'react';
import { Domain, ChatMessage, Task } from '../types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Send, Minimize2, Maximize2, Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import { saveMessage, getDomainConfig, getTasks } from '@/app/utils/storage';
import { generateAIResponse, generateTaskFromMessage } from '@/app/utils/ai';
import { formatDistanceToNow } from 'date-fns';

interface DomainAgentProps {
  domain: Domain;
  onClose: () => void;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
}

export function DomainAgent({ domain, onClose, onTaskStatusChange }: DomainAgentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const domainConfig = getDomainConfig(domain);

  useEffect(() => {
    loadMessages();
    loadTasks();
    
    const handleUpdate = () => {
      loadMessages();
      loadTasks();
    };
    
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('tasks-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('tasks-updated', handleUpdate);
    };
  }, [domain]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const storedMessages = localStorage.getItem('ai-agent-messages');
    if (storedMessages) {
      const allMessages: ChatMessage[] = JSON.parse(storedMessages);
      const filtered = allMessages.filter(m => m.domain === domain);
      setMessages(filtered);
    } else {
      setMessages([]);
    }
  };

  const loadTasks = () => {
    const allTasks = getTasks();
    const filtered = allTasks.filter(t => t.domain === domain);
    setTasks(filtered);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    saveMessage({
      domain,
      role: 'user',
      content: userMessage
    });

    loadMessages();

    await new Promise(resolve => setTimeout(resolve, 800));

    const task = generateTaskFromMessage(domain, userMessage);
    const aiResponse = generateAIResponse(domain, userMessage);
    
    saveMessage({
      domain,
      role: 'assistant',
      content: aiResponse
    });

    loadMessages();
    
    if (task) {
      loadTasks();
      window.dispatchEvent(new Event('tasks-updated'));
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!domainConfig) return null;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
      {/* Agent Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
            {domainConfig.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{domainConfig.name} Agent</h3>
            <p className="text-xs text-blue-100">{tasks.length} tasks • {messages.length} messages</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tasks Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Task Outputs ({tasks.length})
              </span>
              {showTasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showTasks && (
              <div className="max-h-48 overflow-auto px-4 py-2 bg-gray-50">
                {tasks.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No tasks yet</p>
                ) : (
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-1">
                            {task.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0"
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 capitalize">
                            {task.type.replace('-', ' ')}
                          </span>
                          {task.details.priority && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {task.details.priority} priority
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
                      <p className="text-sm text-gray-800">
                        Hello! I'm your {domainConfig.name} assistant. {domainConfig.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-2xl p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}