// src/lib/chat-service.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
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

    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      // Extract the system message and other messages
      const systemMessage = messages.find((msg) => msg.role === "system");
      const conversationMessages = messages.filter(
        (msg) => msg.role !== "system"
      );

      // Format conversation without the system message, and remove role prefixes
      const conversationText = conversationMessages
        .map((msg) => {
          if (msg.role === "user") {
            return `user: ${msg.content}`;
          } else {
            // For assistant messages, just include the content without role prefix
            return msg.content;
          }
        })
        .join("\n");

      // Add additional instruction about response format
      const formatInstruction =
        "\nImportant: Respond naturally in first person without prefixing your responses with your name or 'assistant:'.";
      const combinedSystemPrompt = `${config.systemPrompt}\n\n${
        systemMessage?.content || ""
      }${formatInstruction}`;

      console.log("Combined system prompt:", combinedSystemPrompt);
      console.log("Conversation text:", conversationText);

      return await streamText({
        model: this.openrouter(config.modelId),
        system: combinedSystemPrompt,
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
