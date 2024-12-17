// src/app/chat/stream.ts
import { ChatMessage } from "@/types/chat";

// Define our own StreamingAdapter type
interface StreamObserver {
  next: (content: string) => void;
  error: (error: Error) => void;
  complete: () => void;
}

interface StreamingAdapter {
  streamText: (text: string, observer: StreamObserver) => Promise<void>;
}

// This function exists just for compatibility with the config page
export const invalidateModelConfig = () => {
  // No-op as model selection is handled server-side
};

export const createStreamingAdapter = (): StreamingAdapter => ({
  streamText: async (text, observer) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
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
