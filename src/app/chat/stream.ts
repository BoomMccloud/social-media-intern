// src/app/chat/stream.ts
import { ChatMessage } from "@/types/chat";

interface StreamObserver {
  next: (content: string) => void;
  error: (error: Error) => void;
  complete: () => void;
}

interface StreamingAdapter {
  streamText: (
    messages: ChatMessage[],
    observer: StreamObserver
  ) => Promise<void>;
}

const processSSEChunk = (chunk: string, observer: StreamObserver) => {
  // console.log("Processing SSE chunk:", chunk);
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;

    const data = line.slice(6);
    if (data === "[DONE]") {
      // console.log("Stream completed");
      return true;
    }

    try {
      const message: ChatMessage = JSON.parse(data);
      // console.log("Processed message:", message);
      observer.next(message.content);
    } catch (e) {
      // console.warn("Failed to parse SSE message:", e);
    }
  }
  return false;
};

const formatMessagesForAPI = (messages: ChatMessage[]): ChatMessage[] => {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    id: msg.id,
    createdAt: msg.createdAt,
  }));
};

export const createStreamingAdapter = (
  configId?: string | null
): StreamingAdapter => {
  console.log("Creating streaming adapter with configId:", configId);

  return {
    streamText: async (messages: ChatMessage[], observer: StreamObserver) => {
      console.log("Stream text called with messages:", messages);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages,
            configId,
          }),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        console.log("API response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const textDecoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log("Reader completed");
            break;
          }

          const chunk = textDecoder.decode(value);
          // console.log("Received chunk:", chunk);
          const isDone = processSSEChunk(chunk, observer);
          if (isDone) break;
        }

        observer.complete();
      } catch (error) {
        console.error("Stream error:", error);
        if (error instanceof Error) {
          observer.error(
            error.name === "AbortError" ? new Error("Request timeout") : error
          );
        } else {
          observer.error(new Error(String(error)));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
};
