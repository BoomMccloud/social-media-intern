// src/app/chat/stream.ts
import { StreamingAdapter } from "@nlux/react";
import { ChatMessage, ModelConfig } from "@/types/chat";

const fetchActiveModelId = async (): Promise<string> => {
  console.log("Fetching current model configuration...");
  const configResponse = await fetch("/api/config");
  if (!configResponse.ok) {
    console.error("Failed to fetch configuration:", configResponse.status);
    throw new Error("Failed to fetch model configuration");
  }

  const models: ModelConfig[] = await configResponse.json();
  console.log("Loaded models:", models);

  const activeModel = models.find((model) => model.isActive);
  console.log("Found active model:", activeModel || "none");

  const firstModel = models[0];
  console.log("First model in array:", firstModel || "none");

  if (!activeModel && !firstModel) {
    console.error("No models found in configuration");
    throw new Error("No models configured");
  }

  let modelId;
  if (activeModel) {
    console.log("Using active model:", {
      configId: activeModel.configId,
      modelId: activeModel.modelId,
      name: activeModel.name,
      isActive: activeModel.isActive,
    });
    modelId = activeModel.modelId;
  } else {
    console.log("No active model found, falling back to first model:", {
      configId: firstModel.configId,
      modelId: firstModel.modelId,
      name: firstModel.name,
      isActive: firstModel.isActive,
    });
    modelId = firstModel.modelId;
  }

  if (!modelId) {
    console.error("Selected model has no modelId", {
      usingActiveModel: !!activeModel,
      selectedModel: activeModel || firstModel,
    });
    throw new Error("Selected model configuration has no modelId");
  }

  console.log("Final selected modelId for chat request:", modelId);
  return modelId;
};

export const invalidateModelConfig = () => {
  console.log(
    "invalidateModelConfig called - ensuring fresh config on next request"
  );
};

export const createStreamingAdapter = (): StreamingAdapter => ({
  streamText: async (text, observer) => {
    try {
      console.log("Starting new chat stream request...");
      const modelId = await fetchActiveModelId();
      console.log("Sending chat request with modelId:", modelId);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          modelId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat API request failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
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
          if (data === "[DONE]") {
            console.log("Stream completed successfully");
            break;
          }

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
      console.error("Stream error:", error);
      observer.error(error instanceof Error ? error : new Error(String(error)));
    }
  },
});
