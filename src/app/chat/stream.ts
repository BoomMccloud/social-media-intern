// src/app/chat/stream.ts
import { StreamingAdapter } from "@nlux/react";
import { ChatMessage, ModelConfig } from "@/types/chat";

const fetchActiveModelId = async (): Promise<string> => {
  // Always fetch fresh configuration
  const configResponse = await fetch("/api/config");
  if (!configResponse.ok) {
    throw new Error("Failed to fetch model configuration");
  }

  const models: ModelConfig[] = await configResponse.json();
  const activeModel = models.find((model) => model.isActive);
  const firstModel = models[0];

  if (!activeModel && !firstModel) {
    throw new Error("No models configured");
  }

  const modelId = activeModel?.modelId || firstModel?.modelId;

  if (!modelId) {
    throw new Error("Selected model configuration has no modelId");
  }

  return modelId;
};

// This function now exists just for compatibility with the config page
// It doesn't do anything since we always fetch fresh config
export const invalidateModelConfig = () => {
  // No-op: we always fetch fresh config
};

export const createStreamingAdapter = (): StreamingAdapter => ({
  streamText: async (text, observer) => {
    try {
      const modelId = await fetchActiveModelId();

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          modelId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const textDecoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = textDecoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const message: ChatMessage = JSON.parse(data);
            observer.next(message.content);
          } catch (e) {
            console.error("Failed to parse SSE message:", e);
          }
        }
      }

      observer.complete();
    } catch (error) {
      observer.error(error instanceof Error ? error : new Error(String(error)));
    }
  },
});
