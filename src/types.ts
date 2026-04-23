export interface Client {
  id: string;
  name: string;
  gstin: string;
  pan: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  type?: 'text' | 'voice' | 'alert' | 'tabular' | 'limit' | 'clarification' | 'irrelevant';
  voiceDuration?: string;
}

export interface ChatSession {
  id: string;
  clientId: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export interface MockData {
  booksAccounts: string;
  filedReturns: string;
  pendingReturns: string;
  notices: string;
  taxLiability: string;
  itc: string;
  ledgerBalances: string;
  reconciliation: string;
}
