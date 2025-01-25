// src/types/chat.ts
import { RefObject } from "react";

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
  name: string;
  llmConfig: LLMConfig;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  modelConfig: LLMConfig;
  createdAt: Date;
}

export interface LLMConfig {
  configId: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMProvider {
  generateResponse(
    prompt: string,
    config: LLMConfig,
    systemPrompt: string
  ): AsyncIterable<string>;

  generateConversationResponse(
    messages: Message[],
    config: LLMConfig,
    systemPrompt: string
  ): AsyncIterable<string>;
}

// types.ts or types.tsx

export type StreamResponseComponentProps<AiMsg> = {
  uid: string;
  dataTransferMode: "stream";
  status: "streaming" | "complete";
  content?: AiMsg[] | undefined; // Correct the content type
  serverResponse?: unknown[];
  containerRef: RefObject<HTMLElement>;
};
