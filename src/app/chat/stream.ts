// src/app/chat/stream.ts
import { ChatMessage } from "@/types/chat";

interface StreamObserver {
  next: (content: string) => void;
  error: (error: Error) => void;
  complete: () => void;
}

interface StreamingAdapter {
  streamText: (text: string, observer: StreamObserver) => Promise<void>;
}

const processSSEChunk = (chunk: string, observer: StreamObserver) => {
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;

    const data = line.slice(6);
    if (data === "[DONE]") return true;

    try {
      const message: ChatMessage = JSON.parse(data);
      observer.next(message.content);
    } catch (e) {
      console.warn("Failed to parse SSE message:", e);
    }
  }
  return false;
};

export const createStreamingAdapter = (
  configId?: string | null
): StreamingAdapter => ({
  streamText: async (text: string, observer: StreamObserver) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          configId,
        }),
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const textDecoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = textDecoder.decode(value);
        const isDone = processSSEChunk(chunk, observer);
        if (isDone) break;
      }

      observer.complete();
    } catch (error) {
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
});
