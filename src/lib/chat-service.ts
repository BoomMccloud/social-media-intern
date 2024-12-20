// src/lib/chat-service.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { ModelConfig } from "@/types/chat";

export class ChatService {
  private static instance: ChatService;
  private openrouter;

  private constructor(apiKey: string) {
    this.openrouter = createOpenRouter({ apiKey });
  }

  // Singleton pattern to avoid multiple instances
  public static getInstance(apiKey: string): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService(apiKey);
    }
    return ChatService.instance;
  }

  async streamResponse(message: string, config: ModelConfig) {
    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      return await streamText({
        model: this.openrouter(config.modelId),
        system: config.systemPrompt,
        prompt: message,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });
    } catch (error) {
      console.error("Streaming error:", error);
      throw new Error(
        `Failed to stream response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
