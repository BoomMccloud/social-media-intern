import { StreamingAdapterObserver } from "@nlux/react";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

export const streamText = async (
  prompt: string,
  observer: StreamingAdapterObserver
) => {
  const messages = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages,
      modelName: "meta-llama/llama-3.2-1b-instruct", // Default model
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.status !== 200) {
    observer.error(new Error("Failed to connect to the server"));
    return;
  }

  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  const textDecoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const chunk = textDecoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6); // Remove 'data: ' prefix

          // Check if it's the completion signal
          if (data === "[DONE]") {
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
    }
  } catch (error) {
    // Convert unknown error to Error object
    observer.error(error instanceof Error ? error : new Error(String(error)));
  }

  observer.complete();
};
