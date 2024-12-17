// src/app/chat/stream.ts
import { StreamingAdapterObserver } from "@nlux/react";
import { ChatMessage } from "@/types/chat";
import { DEFAULT_MODEL } from "@/lib/constants";

export const streamText = async (
  prompt: string,
  observer: StreamingAdapterObserver
) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        modelName: DEFAULT_MODEL,
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
};
