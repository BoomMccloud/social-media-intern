// src/lib/chat-service.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { ModelConfig } from "@/types/chat";

export class ChatService {
  private openrouter;

  constructor(apiKey: string) {
    this.openrouter = createOpenRouter({ apiKey });
  }

  async streamResponse(message: string, selectedModel: ModelConfig) {
    return streamText({
      model: this.openrouter(selectedModel.modelId),
      system: selectedModel.systemPrompt,
      prompt: message,
      temperature: selectedModel.temperature,
      maxTokens: selectedModel.maxTokens,
    });
  }
}
