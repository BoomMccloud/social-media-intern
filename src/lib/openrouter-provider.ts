// src/lib/openrouter-provider.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { LLMProvider, Message, LLMConfig } from "@/types/chat";

export class OpenRouterProvider implements LLMProvider {
  private openrouter;

  constructor(apiKey: string) {
    this.openrouter = createOpenRouter({ apiKey });
  }

  async *generateResponse(
    prompt: string,
    config: LLMConfig,
    systemPrompt: string
  ): AsyncIterable<string> {
    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      const { textStream } = await streamText({
        model: this.openrouter(config.modelId),
        system: systemPrompt,
        prompt: prompt,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });

      for await (const chunk of textStream) {
        yield chunk;
      }
    } catch (error) {
      throw new Error(
        `Failed to generate response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async *generateConversationResponse(
    messages: Message[],
    config: LLMConfig,
    systemPrompt: string
  ): AsyncIterable<string> {
    if (!config?.modelId) {
      throw new Error("Invalid model configuration");
    }

    try {
      // Extract the system message and other messages
      const systemMessage = messages.find((msg) => msg.role === "system");
      const conversationMessages = messages.filter(
        (msg) => msg.role !== "system"
      );

      // Format conversation without the system message
      const conversationText = conversationMessages
        .map((msg) => {
          if (msg.role === "user") {
            return `user: ${msg.content}`;
          } else {
            return msg.content;
          }
        })
        .join("\n");

      // Add format instruction to system prompt
      const formatInstruction =
        "\nImportant: Respond naturally in first person without prefixing your responses with your name or 'assistant:'.";
      const combinedSystemPrompt = `${systemPrompt}\n\n${
        systemMessage?.content || ""
      }${formatInstruction}`;

      const { textStream } = await streamText({
        model: this.openrouter(config.modelId),
        system: combinedSystemPrompt,
        prompt: conversationText,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });

      for await (const chunk of textStream) {
        yield chunk;
      }
    } catch (error) {
      throw new Error(
        `Failed to generate conversation response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
