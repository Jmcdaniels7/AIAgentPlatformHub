import { Domain, Task, TaskType } from '../types';
import { addTask } from './storage';

// Simulate AI processing and task generation
export function generateTaskFromMessage(domain: Domain, userMessage: string): Task | null {
  const lowerMessage = userMessage.toLowerCase();
  
  // Gateway Agent(Risk-management and Operations) needs results to populate task fields
  
  
  // Risk Management domain needs results to populate task fields
  
  
  // Operations domain needs results to populate task fields
  
    
}

function extractTaskDescription(message: string): string {
  return message.length > 100 ? message.substring(0, 97) + '...' : message;
}

function extractRecipient(message: string): string {
  // Simple extraction - look for common patterns
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) return emailMatch[0];
  
  const nameMatch = message.match(/(?:to|for|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (nameMatch) return nameMatch[1];
  
  return 'Not specified';
}

function extractDate(message: string): string {
  const dateMatch = message.match(/(?:on|for|by)\s+(\w+\s+\d+|\d+\/\d+)/i);
  if (dateMatch) return dateMatch[1];
  return 'To be determined';
}

function extractQuantity(message: string): number {
  const qtyMatch = message.match(/(\d+)\s*(?:units?|items?|pieces?)/i);
  if (qtyMatch) return parseInt(qtyMatch[1]);
  return 0;
}

function determinePriority(message: string): 'low' | 'medium' | 'high' {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('critical')) {
    return 'high';
  }
  if (lowerMessage.includes('low priority') || lowerMessage.includes('when possible')) {
    return 'low';
  }
  return 'medium';
}

export function generateAIResponse(domain: Domain, userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (domain === 'gateway') {
    if (lowerMessage.includes('email') || lowerMessage.includes('outreach')) {
      return "I've created a draft outreach email task for your review. The email will be personalized based on the prospect's background and your value proposition. You can review and approve it in the task panel.";
    }
    if (lowerMessage.includes('follow up')) {
      return "I've scheduled a follow-up task. I'll remind you to check in with the prospect at the optimal time based on your previous interaction patterns.";
    }
    return "I'm here to help with sales outreach, follow-ups, and deal analysis. What would you like me to assist with?";
  }
  
  if (domain === 'risk-management') {
    if (lowerMessage.includes('respond') || lowerMessage.includes('email')) {
      return "I've prepared a customer support response for your review. The response addresses their concerns while maintaining our brand voice and support standards.";
    }
    return "I can help you manage customer inquiries, draft responses, and track support issues. How can I assist you today?";
  }
  
  if (domain === 'operations') {
    if (lowerMessage.includes('schedule')) {
      return "I've created a scheduling task with the details provided. I'll ensure all stakeholders are notified and conflicts are flagged for your review.";
    }
    if (lowerMessage.includes('reorder')) {
      return "I've generated a reorder task based on current inventory levels and usage patterns. Please review the quantities and approve the order.";
    }
    return "I'm here to help with scheduling, inventory management, and operational coordination. What do you need?";
  }
  
  
  
  return "How can I assist you today?";
}

