// src/lib/chat-service.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { ModelConfig, Message } from "@/types/chat";

export class ChatService {
  private static instance: ChatService;
  private openrouter;

  private constructor(apiKey: string) {
    this.openrouter = createOpenRouter({ apiKey });
  }

  public static getInstance(apiKey: string): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService(apiKey);
    }
    return ChatService.instance;
  }

  async continueConversation(messages: Message[], config: ModelConfig) {
    console.log("=== continueConversation called ===");
    console.log("Messages received:", messages);
    console.log("Config received:", {
      modelId: config.modelId,
      systemPrompt: config.systemPrompt,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    });

    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      // Instead of creating a new stream, let's use streamText directly
      const conversationText = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      console.log("Formatted conversation text:", conversationText);

      return await streamText({
        model: this.openrouter(config.modelId),
        system: config.systemPrompt,
        prompt: conversationText,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });
    } catch (error) {
      throw new Error(
        `Failed to continue conversation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
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
      throw new Error(
        `Failed to stream response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
