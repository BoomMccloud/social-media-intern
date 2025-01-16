// src/app/chat/stream.ts
import { ChatMessage, LLMConfig, Message } from "@/types/chat";
import { generatePrompt } from "@/lib/generatePrompt";
import { Character } from "@/types/character";

export interface StreamObserver {
  next: (content: string) => void;
  error: (error: Error) => void;
  complete: () => void;
}

export const DEFAULT_CONFIG_ID = "config-987fcdeb-51d3-12a4-b456-426614174001";

interface ConfigWithSystemPrompt {
  llmConfig: LLMConfig;
  systemPrompt: string;
}

async function fetchCharacter(characterId: string): Promise<Character> {
  const response = await fetch(`/api/listCharacters/${characterId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch character: ${response.statusText}`);
  }
  return response.json();
}

const getAvailableConfigs = async (
  characterId: string
): Promise<ConfigWithSystemPrompt[]> => {
  const character = await fetchCharacter(characterId);
  const systemPrompt = generatePrompt(characterId, [character]); // Pass as single-element array

  return [
    {
      llmConfig: {
        configId: DEFAULT_CONFIG_ID,
        modelId: "microsoft/wizardlm-2-8x22b",
        temperature: 0.6,
        maxTokens: 1500,
      },
      systemPrompt,
    },
  ];
};

const selectConfig = async (
  characterId: string,
  configId: string | undefined,
  providedConfig?: LLMConfig
): Promise<ConfigWithSystemPrompt> => {
  const character = await fetchCharacter(characterId);

  if (providedConfig) {
    return {
      llmConfig: providedConfig,
      systemPrompt: generatePrompt(characterId, [character]),
    };
  }

  const configs = await getAvailableConfigs(characterId);

  if (configId) {
    const requested = configs.find(
      (config) => config.llmConfig.configId === configId
    );
    if (requested) return requested;
  }

  return configs[0];
};

const formatMessagesForAPI = (messages: ChatMessage[]): Message[] => {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

const processSSEChunk = (chunk: string, observer: StreamObserver): boolean => {
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;

    const data = line.slice(6);
    if (data === "[DONE]") {
      return true;
    }

    try {
      const message: ChatMessage = JSON.parse(data);
      observer.next(message.content);
    } catch (error) {
      console.warn("Failed to parse SSE message:", error);
      observer.error(
        error instanceof Error ? error : new Error("Failed to parse message")
      );
      return true;
    }
  }
  return false;
};

export const createStreamingAdapter = (
  characterId: string,
  configIdOrConfig?: string | LLMConfig
) => {
  return {
    streamText: async (messages: Message[], observer: StreamObserver) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const selectedConfig = await selectConfig(
          characterId,
          typeof configIdOrConfig === "string" ? configIdOrConfig : undefined,
          typeof configIdOrConfig === "object" ? configIdOrConfig : undefined
        );

        console.log(
          "Messages being sent to API:",
          messages instanceof Array ? messages : formatMessagesForAPI(messages)
        );
        console.log("Selected config:", selectedConfig);

        const response = await fetch("/api/handleMessages", {
          method: "POST",
          body: JSON.stringify({
            messages:
              messages instanceof Array
                ? messages
                : formatMessagesForAPI(messages),
            config: selectedConfig,
          }),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
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
        observer.error(
          error instanceof Error && error.name === "AbortError"
            ? new Error("Request timeout")
            : error instanceof Error
            ? error
            : new Error(String(error))
        );
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
};
