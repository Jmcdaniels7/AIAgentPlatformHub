import { useState, useEffect, useRef } from 'react';
import { Domain, ChatMessage } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User } from 'lucide-react';
import { clearMessages, saveMessage, getDomainConfig } from '@/app/utils/storage';
import { generateAIResponse, generateTaskFromMessage } from '@/app/utils/ai';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  domain: Domain | null;
}

//on refresh chat interfaces are cleared, tasks are cleared, only persistance happening is tasks, pending tasks for that account
//  will appear in task feed 
export function ChatInterface({ domain }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [domain]);

  useEffect(() => {
    clearMessages();
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const storedMessages = localStorage.getItem('ai-agent-messages');
    if (storedMessages) {
      const allMessages: ChatMessage[] = JSON.parse(storedMessages);
      const filtered = domain 
        ? allMessages.filter(m => m.domain === domain)
        : allMessages;
      setMessages(filtered);
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !domain) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Save user message
    saveMessage({
      domain,
      role: 'user',
      content: userMessage
    });

    loadMessages();

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate task if applicable
    const task = generateTaskFromMessage(domain, userMessage);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(domain, userMessage);
    
    saveMessage({
      domain,
      role: 'assistant',
      content: aiResponse.final || aiResponse.immediate
    });

    loadMessages();
    
    if (task) {
      // Trigger task feed update
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

  const domainConfig = domain ? getDomainConfig(domain) : null;

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 border-b-2 border-slate-300 px-6 py-4 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-gray-900">{domainConfig?.name || 'AI Assistant'}</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <div className="space-y-4">
          {!domain ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Bot className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-700">Select a domain to start chatting</p>
            </div>
          ) : (
            <>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg border border-blue-400">
                  <p className="text-sm text-white">Hello, how can I assist you today?</p>
                </div>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg border ${
                      message.role === 'user'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 border border-blue-400 rounded-2xl p-4 shadow-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={domain ? `Type your message...` : 'Select a domain first...'}
            disabled={!domain || isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm disabled:bg-gray-100 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !domain || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}