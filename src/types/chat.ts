// src/types/chat.ts
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatMessage extends Message {
  id: string;
  createdAt: Date;
  hidden?: boolean;
}

export interface ModelConfig {
  configId: string;
  modelId: string;
  name: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  isActive: boolean;
  profilePicture: string;
  avatar: string;
  description: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
