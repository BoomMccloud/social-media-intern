import { AiChat, ChatItem } from "@nlux/react";
// import { Skeleton } from "antd"; // commented out, likely not used currently
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

// Component to display error messages
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

// Component to display a loading animation
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

// Main chat panel component
export const ChatPanel = () => {
  const router = useRouter(); // Router for navigation
  const searchParams = useSearchParams(); // Hook to read URL params
  const characterId = searchParams.get("characterId"); // Character ID from URL
  const llmConfigId = searchParams.get("configId"); // LLM config ID from URL

  // State for showing/hiding the scenario selector
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  // State to store the selected scenario
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  // State to store the fetched character data
  const [character, setCharacter] = useState<Character | null>(null);
  // State to store errors during data fetching or processing
  const [error, setError] = useState<Error | null>(null);
  // State to track loading state for data fetching
  const [isLoading, setIsLoading] = useState(true);

  // Authentication using next-auth
  const { status, data: session } = useSession({
    required: true, // Require authentication
    onUnauthenticated() {
      // Redirect to login if not authenticated, passing current URL as callback
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });

  // Fetch character data when characterId changes
  useEffect(() => {
    if (characterId) {
      setIsLoading(true); // Start loading
      fetch(`/api/listCharacters/${characterId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch character data");
          return res.json(); // Parse the response JSON
        })
        .then((character: Character) => {
          setCharacter(character); // Set the character state
        })
        .catch((error) => {
          console.error("Error fetching character:", error);
          setError(error); // Set the error state
        })
        .finally(() => {
          setIsLoading(false); // Stop loading in any case (success or error)
        });
    }
  }, [characterId]); // Dependency array: run effect only when characterId changes

  // Access chat state management functions
  const { addMessage, getMessages, clearSession } = useChatStore();
  // Generate session ID based on character and llm config.
  const sessionId = useMemo(
    () =>
      characterId ? `${characterId}-${llmConfigId || DEFAULT_CONFIG_ID}` : null,
    [characterId, llmConfigId]
  );

  // Get all messages of a session. The component re-renders whenever the session or selectedScenario changes.
  const messages = useMemo(
    () => (sessionId ? getMessages(sessionId) : []),
    [sessionId, getMessages, selectedScenario]
  );

  // Function to clear the chat history
  const handleClearChat = useCallback(() => {
    if (sessionId) {
      clearSession(sessionId); // Clear messages in chat store
      window.location.reload(); // Reload to reset UI
    }
  }, [sessionId, clearSession]);

  // Handle selection of scenario
  const handleScenarioSelect = async (scenario: Scenario) => {
    if (sessionId && character && characterId) {
      clearSession(sessionId); // Clear existing messages for new scenario
      setSelectedScenario(scenario); // Set the selected scenario
      setShowScenarioSelector(false); // Close scenario selector modal
      localStorage.setItem(`scenario-${sessionId}`, JSON.stringify(scenario)); // Store selected scenario locally

      // Generate initial message to trigger the bot
      const triggerMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: "/start",
        createdAt: new Date(),
        hidden: true, // Hidden message will not be displayed on the UI
      };

      try {
        // create a streaming adapter to communicate with the backend
        const adapter = createStreamingAdapter(characterId);
        let assistantResponse = "";

        //  handle the streaming response for the initial message
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
              // when stream is completed, store the response message in the chat store
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

  // Custom streaming adapter to send and receive messages
  const customStreamingAdapter = useCallback(
    (sessionId: string | null) => {
      // Validate the characterId
      if (!characterId) {
        throw new Error("Character ID is required");
      }

      // create a base streaming adapter
      const baseAdapter = createStreamingAdapter(characterId);

      return {
        // override the streamText function to handle the chat history
        streamText: async (text: string, observer: any) => {
          // create a new user message
          const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            createdAt: new Date(),
          };

          // save user message to the store
          if (sessionId) {
            addMessage(sessionId, userMessage);
          }

          // Get the current chat history.
          const messagesToSend = sessionId ? getMessages(sessionId) : [];
          let accumulatedContent = ""; // Store the response

          // Pass the history to base adapter to stream the response
          return baseAdapter.streamText(messagesToSend, {
            next: (content: string) => {
              accumulatedContent += content;
              observer.next(content); // notify the UI with incremental data
            },
            error: (error: Error) => {
              console.error("Stream error:", error);
              observer.error(error); // notify error to the UI
            },
            complete: () => {
              // when the stream is complete, generate a final assistant message
              if (sessionId && accumulatedContent) {
                const finalAssistantMessage: ChatMessage = {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: accumulatedContent,
                  createdAt: new Date(),
                };
                addMessage(sessionId, finalAssistantMessage); // Store the final response in the store
              }
              observer.complete(); // Notify completion to the UI
            },
          });
        },
      };
    },
    [sessionId, addMessage, getMessages, characterId]
  );

  // Format the messages array to be used by the AiChat component
  const initialConversation = useMemo<ChatItem[]>(() => {
    return messages
      .filter((msg) => !msg.hidden && msg.role !== "system") // filter out hidden and system messages
      .map(({ role, content: message }) => ({ role, message })); // mapping the messages into chat items
  }, [messages]);

  // Render different UI elements based on the current state

  // if there is no character id, render the character select component
  if (!characterId) {
    return <CharacterSelect />;
  }

  // Render loading state if loading or no character data
  if (status === "loading" || (!error && !character) || isLoading) {
    return <LoadingState />;
  }

  // Render error state if there is error during data fetching or processing
  if (error) {
    return (
      <ErrorState
        error={error.message || "Configuration error"}
        onReturn={() => router.push("/")} // return to the base page on error
      />
    );
  }

  // if the character object is null then return null
  if (!character) {
    return null;
  }

  // Main chat UI rendering
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
          adapter={customStreamingAdapter(sessionId)} // pass custom streaming adapter
          personaOptions={{
            // configure persona options to be used in the AiChat component
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
          initialConversation={initialConversation} // pass initial messages
        />
        <FloatingActionButton
          onScenarioClick={() => setShowScenarioSelector(true)} // show the scenario selector on click
          onClearChat={handleClearChat} // handle the chat clear action
        />
      </div>
    </div>
  );
};
