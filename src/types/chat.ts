// src/types/chat.ts
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ModelConfig {
  configId: string; // Unique identifier for the configuration
  modelId: string; // The actual model ID (e.g., meta-llama/llama-3.2-1b-instruct)
  name: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  profilePicture: string;
  avatar: string;
}
