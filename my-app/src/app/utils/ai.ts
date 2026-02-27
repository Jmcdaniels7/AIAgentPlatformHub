import { Domain, Task, TaskType } from '../types';
import { addTask } from './storage';
 
// Simulate AI processing and task generation
export function generateTaskFromMessage(domain: Domain, userMessage: string): Task | null {
  const lowerMessage = userMessage.toLowerCase();
  
  const wantsTask =
    lowerMessage.includes('task') ||
    lowerMessage.includes('task card') ||
    lowerMessage.includes('create') ||
    lowerMessage.includes('add') ||
    lowerMessage.includes('draft');

  let type: TaskType | null = null;

  if (lowerMessage.includes('respond') || lowerMessage.includes('email')) {
    type = 'email';
  } else if (lowerMessage.includes('follow up') || lowerMessage.includes('follow-up')) {
    type = 'follow-up';
  } else if (lowerMessage.includes('schedule') || lowerMessage.includes('reschedule')) {
    type = 'reschedule';
  } else if (lowerMessage.includes('outreach') || lowerMessage.includes('contact')) {
    type = 'outreach';
  } else if (lowerMessage.includes('reorder') || lowerMessage.includes('restock')) {
    type = 'reorder';
  } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
    type = 'maintenance';
  } else if (lowerMessage.includes('analysis') || lowerMessage.includes('risk') || lowerMessage.includes('inventory')) {
    type = 'analysis';
  }

  if (!type && !wantsTask) return null;

  const recipient = extractRecipient(userMessage);
  const scheduledDate = extractDate(userMessage);
  const quantity = extractQuantity(userMessage);
  const priority = determinePriority(userMessage);

  const titleBase = type ? `${type.replace('-', ' ')} task` : 'new task';
  const title = recipient !== 'Not specified'
    ? `${titleBase} for ${recipient}`
    : titleBase;

  const newTask = addTask({
    domain,
    type: type ?? 'analysis',
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: extractTaskDescription(userMessage),
    status: 'pending',
    details: {
      recipient,
      scheduledDate,
      quantity,
      priority,
      notes: userMessage
    }
  });

  return newTask;
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

//could use AI to determine priority based on language cues in the message.
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

export async function generateAIResponse(domain: Domain, userMessage: string): Promise<{ immediate: string; final: string }> {
  const lowerMessage = userMessage.toLowerCase();
  const isRiskTopic = lowerMessage.includes('risk') || lowerMessage.includes('incident') || lowerMessage.includes('compliance') || lowerMessage.includes('audit') || lowerMessage.includes('security');
  const isOperationsTopic = lowerMessage.includes('schedule') || lowerMessage.includes('route') || lowerMessage.includes('inventory') || lowerMessage.includes('reorder') || lowerMessage.includes('dispatch') || lowerMessage.includes('warehouse') || lowerMessage.includes('delivery');
  
  const sendMessage = async (message: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  if (domain === 'gateway') {

    const gatewayMessage = `Domain: ${domain} User Request: ${lowerMessage} Please tell me which agents to utilize`;
    
    //API logic sent to gateway with domain and lowerMessage variables to determine routing and response. 
    // Gateway can respond with immediate feedback and then follow up with more detailed response after processing.
    if (isRiskTopic && isOperationsTopic) {
      const immediate = "I can route this to both Risk Management and Operations Agents. I can draft a task for now, awaiting response from agents.";
      const response = await sendMessage(gatewayMessage);
      return { immediate, final: response?.response || immediate };
    }
    if (isRiskTopic) {
      const immediate = "This sounds like a Risk Management request. I can draft a task for now, awaiting response from the Risk Management agent.";
      const response = await sendMessage(gatewayMessage);
      return { immediate, final: response?.response || immediate };
    }
    if (isOperationsTopic) {
      const immediate = "This sounds like an Operations request. I can draft a task, awaiting response from the Operations agent....";
      const response = await sendMessage(gatewayMessage);
      return { immediate, final: response?.response || immediate };
    }
    /*if (lowerMessage.includes('follow up')) {
      return "I can route follow-ups to the appropriate agent. Is this about a risk/compliance issue or an operations/scheduling issue?";
    }
    */
    const message = "I'm not sure I can help with that. I'm the Logistics (Gateway) agent. Please tell me if this is a risk or an operations issue.";
    return { immediate: message, final: "" };
  }
  
  if (domain === 'risk-management') {
     const riskManMessage = `Domain: ${domain} User Request: ${lowerMessage}`;

    if (isOperationsTopic && !isRiskTopic) {
      const immediate = "That sounds like an Operations request. I can't execute scheduling or inventory actions. Please switch to Operations or ask the Gateway agent to route it.";
      const response = await sendMessage(riskManMessage);
      return { immediate, final: response?.response || immediate };
    }
    if (lowerMessage.includes('respond') || lowerMessage.includes('email')) {
      const immediate = "I can draft risk-related communications (incident notices, compliance updates, mitigation plans). Share the details and audience.";
      const response = await sendMessage(riskManMessage);
      return { immediate, final: response?.response || immediate };
    }
    const message = "I'm not sure I can help with that. I handle risk analysis, compliance, incident response, and mitigation planning. Tell me the risk, impact, and desired outcome.";
    return { immediate: message, final: ""};
  }
  
  if (domain === 'operations') {
    const operationsMessage = `Domain: ${domain} User Request: ${lowerMessage}`;
    if (isRiskTopic && !isOperationsTopic) {
      const immediate = "That sounds like a Risk Management request. I can't handle compliance or risk analysis. Please switch to Risk Management or ask the Gateway agent to route it.";
      const response = await sendMessage(operationsMessage);
      return { immediate, final: response?.response || immediate };
    }
    if (lowerMessage.includes('schedule')) {
      const immediate = "I can create a scheduling task. Please share the date, time window, and stakeholders.";
      const response = await sendMessage(operationsMessage);
      return { immediate, final: response?.response || immediate };
    }
    if (lowerMessage.includes('reorder')) {
      const immediate = "I can create a reorder task. Please share item, quantity, and target delivery date.";
      const response = await sendMessage(operationsMessage);
      return { immediate, final: response?.response || immediate };
    }
    const message = "I'm not sure I can help with that. I handle scheduling, inventory, routing, and operational coordination. Tell me what needs to be scheduled, reordered, or routed.";
    return { immediate: message, final: "" };
  }
  
  return { immediate: "How can I assist you today?", final: "" };
}

