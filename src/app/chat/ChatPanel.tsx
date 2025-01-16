import { AiChat, ChatItem } from "@nlux/react";
import { Skeleton } from "antd";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createStreamingAdapter, DEFAULT_CONFIG_ID } from "@/app/chat/stream";
import { ChatMessage, LLMConfig } from "@/types/chat";
import { useChatStore } from "@/store/chat-store";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { Scenario } from "@/types/scenario";
import { Character } from "@/types/character";

const ErrorState = ({
  error,
  onReturn,
}: {
  error: string;
  onReturn: () => void;
}) => (
  <div className="flex flex-col justify-center w-screen h-screen items-center gap-4">
    <div className="text-xl text-red-500">{error}</div>
    <button
      onClick={onReturn}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Return to Model Selection
    </button>
  </div>
);

export const ChatPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const llmConfigId = searchParams.get("configId"); // matches LLMConfig.configId

  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  const [character, setCharacter] = useState<Character | null>(null);
  const [llmConfig, setLLMConfig] = useState<LLMConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });

  // Fetch character data
  useEffect(() => {
    if (characterId) {
      fetch(`/api/listCharacters/${characterId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch character data");
          return res.json();
        })
        .then((character: Character) => {
          setCharacter(character);
        })
        .catch((error) => {
          console.error("Error fetching character:", error);
          setError(error);
        });
    }
  }, [characterId]);

  // Only fetch LLM configuration if configId is provided
  useEffect(() => {
    if (llmConfigId) {
      fetch(`/api/listLLMs/${llmConfigId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch LLM configuration");
          return res.json();
        })
        .then((config: LLMConfig) => setLLMConfig(config))
        .catch((error) => {
          console.error("Error fetching LLM config:", error);
          setError(error);
        });
    }
  }, [llmConfigId]);

  const { addMessage, getMessages, clearSession } = useChatStore();
  const sessionId = useMemo(
    () =>
      characterId ? `${characterId}-${llmConfigId || DEFAULT_CONFIG_ID}` : null,
    [characterId, llmConfigId]
  );

  const messages = useMemo(
    () => (sessionId ? getMessages(sessionId) : []),
    [sessionId, getMessages, selectedScenario]
  );

  const handleClearChat = useCallback(() => {
    if (sessionId) {
      clearSession(sessionId);
      window.location.reload();
    }
  }, [sessionId, clearSession]);

  const handleScenarioSelect = async (scenario: Scenario) => {
    if (sessionId && character) {
      clearSession(sessionId);
      setSelectedScenario(scenario);
      setShowScenarioSelector(false);
      localStorage.setItem(`scenario-${sessionId}`, JSON.stringify(scenario));

      const triggerMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: "/start",
        createdAt: new Date(),
        hidden: true,
      };

      try {
        const adapter = createStreamingAdapter(
          llmConfigId || DEFAULT_CONFIG_ID,
          llmConfig
        );
        let assistantResponse = "";

        await new Promise((resolve, reject) => {
          adapter.streamText([triggerMessage], {
            next: (content: string) => {
              assistantResponse += content;
            },
            error: (error: Error) => {
              console.error("Error sending initial greeting:", error);
              reject(error);
            },
            complete: () => {
              const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: assistantResponse,
                createdAt: new Date(),
              };
              addMessage(sessionId, assistantMessage);
              resolve(null);
            },
          });
        });
      } catch (error) {
        console.error("Failed to generate initial greeting:", error);
      }
    }
  };

  const customStreamingAdapter = useCallback(
    (sessionId: string | null) => {
      const baseAdapter = createStreamingAdapter(
        llmConfigId || DEFAULT_CONFIG_ID,
        llmConfig
      );

      return {
        streamText: async (text: string, observer: any) => {
          // Create the user message
          const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            createdAt: new Date(),
          };

          // Add user message to the store
          if (sessionId) {
            addMessage(sessionId, userMessage);
          }

          // Get current messages and add the new user message
          const currentMessages = sessionId ? getMessages(sessionId) : [];
          const messagesToSend = [...currentMessages, userMessage];

          let accumulatedContent = "";

          return baseAdapter.streamText(messagesToSend, {
            next: (content: string) => {
              accumulatedContent += content;
              observer.next(content);
            },
            error: (error: Error) => {
              console.error("Stream error:", error);
              observer.error(error);
            },
            complete: () => {
              if (sessionId && accumulatedContent) {
                const finalAssistantMessage: ChatMessage = {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: accumulatedContent,
                  createdAt: new Date(),
                };
                addMessage(sessionId, finalAssistantMessage);
              }
              observer.complete();
            },
          });
        },
      };
    },
    [sessionId, llmConfig, addMessage, getMessages, llmConfigId]
  );

  const initialConversation = useMemo<ChatItem[]>(() => {
    // Debug point 4: Check messages being transformed
    console.log("All messages:", messages);
    return messages
      .filter((msg) => !msg.hidden && msg.role !== "system")
      .map(({ role, content: message }) => ({ role, message }));
  }, [messages]);

  if (!characterId) {
    return <div>Select a character</div>;
  }

  // Only wait for character to load, not llmConfig
  if (status === "loading" || (!error && !character)) {
    return (
      <div
        className="flex flex-col items-stretch w-full gap-2"
        style={{ maxWidth: 600 }}
      >
        <Skeleton.Avatar
          className="text-center"
          style={{ height: 60, width: 60 }}
        />
        <Skeleton.Node style={{ height: 16, width: "100%" }} />
        <Skeleton.Node style={{ height: 16, width: "90%" }} />
        <Skeleton.Node style={{ height: 16, width: "70%" }} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error.message || "Configuration error"}
        onReturn={() => router.push("/")}
      />
    );
  }

  if (!character) {
    return null;
  }

  return (
    <div className="flex justify-center h-screen items-center p-2 md:p-4 w-full">
      <div style={{ height: "85vh", width: "90%" }} className="max-w-full">
        <ScenarioSelector
          isOpen={showScenarioSelector}
          onSelect={handleScenarioSelect}
          onClose={() => setShowScenarioSelector(false)}
          modelSystemPrompt={character.characterInfo.toString()}
        />
        <AiChat
          displayOptions={{
            width: "100%",
            height: "100%",
          }}
          adapter={customStreamingAdapter(sessionId)}
          personaOptions={{
            assistant: {
              name: character.name,
              avatar: character.profilePicture,
              tagline: character.displayDescription,
            },
            user: {
              name: session?.user?.name || "User",
              avatar: session?.user?.image || "/images/user/avatar.jpg",
            },
          }}
          initialConversation={initialConversation}
        />
        <button
          onClick={() => setShowScenarioSelector(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
        >
          Change Scenario
        </button>
        <button
          onClick={handleClearChat}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Chat History
        </button>
      </div>
    </div>
  );
};
