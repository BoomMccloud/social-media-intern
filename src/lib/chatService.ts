// src/lib/chatService.ts
import { LLMProvider, Message, LLMConfig } from "@/types/chat";

export class ChatService {
  private static instance: ChatService | null = null;
  private provider: LLMProvider;

  private constructor(provider: LLMProvider) {
    this.provider = provider;
  }

  public static getInstance(provider: LLMProvider): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService(provider);
    } else {
      // Update provider if needed
      ChatService.instance.provider = provider;
    }
    return ChatService.instance;
  }

  async *continueConversation(
    messages: Message[],
    config: LLMConfig,
    systemPrompt: string
  ) {
    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      for await (const chunk of this.provider.generateConversationResponse(
        messages,
        config,
        systemPrompt
      )) {
        yield chunk;
      }
    } catch (error) {
      throw new Error(
        `Failed to continue conversation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async *streamResponse(
    message: string,
    config: LLMConfig,
    systemPrompt: string
  ) {
    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      for await (const chunk of this.provider.generateResponse(
        message,
        config,
        systemPrompt
      )) {
        yield chunk;
      }
    } catch (error) {
      throw new Error(
        `Failed to stream response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
