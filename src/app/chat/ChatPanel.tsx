import { AiChat, ChatItem } from "@nlux/react";
// import { Skeleton } from "antd";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createStreamingAdapter, DEFAULT_CONFIG_ID } from "@/app/chat/stream";
import { ChatMessage } from "@/types/chat";
import { useChatStore } from "@/store/chat-store";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { Scenario } from "@/types/scenario";
import { Character } from "@/types/character";
import FloatingActionButton from "@/components/FloatingActionButton";
import CharacterSelect from "@/components/CharacterSelect";

// Custom Response Render
import CustomResponseRenderer from "./CustomResponseRenderer"; // Adjust the path based on where you saved the file

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

const LoadingState = () => (
  <div className="flex justify-center h-screen items-center p-2 md:p-4 w-full">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-gray-500">Loading conversation...</div>
    </div>
  </div>
);

export const ChatPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const llmConfigId = searchParams.get("configId");

  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      fetch(`/api/listCharacters/${characterId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch character data");
          return res.json();
        })
        .then((character: Character) => {
          setCharacter(character);
          // if (sessionId) {
          //   // Clear any existing messages for clean slate
          //   clearSession(sessionId);
          // }
        })
        .catch((error) => {
          console.error("Error fetching character:", error);
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [characterId]);

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
    if (sessionId && character && characterId) {
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
        const adapter = createStreamingAdapter(characterId);
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
      if (!characterId) {
        throw new Error("Character ID is required");
      }

      const baseAdapter = createStreamingAdapter(characterId);

      return {
        streamText: async (text: string, observer: any) => {
          const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            createdAt: new Date(),
          };

          if (sessionId) {
            addMessage(sessionId, userMessage);
          }

          const messagesToSend = sessionId ? getMessages(sessionId) : [];
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
    [sessionId, addMessage, getMessages, characterId]
  );

  const initialConversation = useMemo<ChatItem[]>(() => {
    return messages
      .filter((msg) => !msg.hidden && msg.role !== "system")
      .map(({ role, content: message }) => ({ role, message }));
  }, [messages]);

  if (!characterId) {
    return <CharacterSelect />;
  }

  if (status === "loading" || (!error && !character) || isLoading) {
    return <LoadingState />;
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
        <FloatingActionButton
          onScenarioClick={() => setShowScenarioSelector(true)}
          onClearChat={handleClearChat}
        />
      </div>
    </div>
  );
};
