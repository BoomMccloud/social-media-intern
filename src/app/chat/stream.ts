// src/app/chat/stream.ts
import { ChatMessage } from "@/types/chat";

interface StreamObserver {
  next: (content: string, type?: 'message' | 'action') => void;
  error: (error: Error) => void;
  complete: () => void;
}

interface StreamingAdapter {
  streamText: (
    messages: ChatMessage[],
    observer: StreamObserver
  ) => Promise<void>;
}

let messageBuffer = '';
let isProcessingActions = false;

const processSSEChunk = (chunk: string, observer: StreamObserver) => {
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;

    const data = line.slice(6);
    if (data === "[DONE]") {
      // If there's any remaining content in the buffer, send it
      if (messageBuffer) {
        observer.next(messageBuffer, isProcessingActions ? 'action' : 'message');
      }
      return true;
    }

    try {
      const message: ChatMessage = JSON.parse(data);
      
      // Add the new content to our buffer
      messageBuffer += message.content;
      
      // Check if we've received the separator
      const separatorIndex = messageBuffer.indexOf('---');
      
      if (separatorIndex !== -1 && !isProcessingActions) {
        // We found the separator for the first time
        // Send everything before the separator as the main message
        const mainMessage = messageBuffer.substring(0, separatorIndex).trim();
        observer.next(mainMessage, 'message');
        
        // Start buffering the actions
        messageBuffer = messageBuffer.substring(separatorIndex + 3).trim();
        isProcessingActions = true;
      } else if (isProcessingActions) {
        // We're in the actions section, accumulate it
        observer.next(message.content, 'action');
      } else {
        // We're still in the main message section
        observer.next(message.content, 'message');
      }
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
        console.log("Sending messages to API:", messages);

        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: formatMessagesForAPI(messages),
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
