import { AiChat, ChatItem } from "@nlux/react";
import { Breadcrumb, Skeleton } from "antd";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatModel } from "@/hooks/useChatModel";
import { createStreamingAdapter } from "@/app/chat/stream";
import { ChatMessage } from "@/types/chat";
import { useChatStore } from "@/store/chat-store";
// import { HomeOutlined } from "@ant-design/icons";
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { Scenario } from '@/types/scenario';

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
  const configId = searchParams.get("configId");
  const hasConfigId = configId != null;
  
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });

  const { model, loading, error } = useChatModel(
    configId,
    status === "authenticated"
  );
  const { addMessage, getMessages, clearSession } = useChatStore();

  // Get existing messages for this chat
  const messages = useMemo(
    () => (configId ? getMessages(configId) : []),
    [configId, getMessages, selectedScenario]
  );

  // Debug logging to verify messages state
  // console.log('Current messages in chat:', messages);

  const handleClearChat = useCallback(() => {
    if (configId) {
      clearSession(configId);
      window.location.reload();
    }
  }, [configId, clearSession]);

  // Update the useEffect to check localStorage for existing scenario
  useEffect(() => {
    if (configId) {
      const savedScenario = localStorage.getItem(`scenario-${configId}`);
      if (savedScenario) {
        setSelectedScenario(JSON.parse(savedScenario));
      } else {
        setShowScenarioSelector(true);
      }
    }
  }, [configId]);

  const handleScenarioSelect = async (scenario: Scenario) => {
    if (configId && model) {
      // Clear messages first
      clearSession(configId);
      
      // Update state after clearing
      setSelectedScenario(scenario);
      setShowScenarioSelector(false);
      localStorage.setItem(`scenario-${configId}`, JSON.stringify(scenario));

      // Create and add system message
      const systemMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content: `You are playing your character in the following scenario:
${scenario.scenario_description}

Setting: ${scenario.setting.join(', ')}
Relationship with other character(s): ${scenario.relationship.join(', ')}

Important instructions:
1. Maintain your character's personality and background while adapting to this scenario
2. When talking to users, only use "hey there" or "you" until they tell you their name
3. Stay in character and interact according to this scenario
4. Start the conversation with a greeting that fits the scenario and your character
5. Respond naturally in first person without prefixing your responses with your name

Remember: You are still yourself (${model?.name ?? 'AI Assistant'}) with your unique traits and background, but you're now in this specific scenario. Speak naturally as if in a real conversation.`,
        createdAt: new Date(),
      };

      // Add system message and wait for store to update
      addMessage(configId, systemMessage);

      // Create a dummy user message
      const triggerMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: "/start",
        createdAt: new Date(),
        hidden: true
      };

      try {
        const adapter = createStreamingAdapter(configId);
        let assistantResponse = "";

        await new Promise((resolve, reject) => {
          adapter.streamText([systemMessage, triggerMessage], {
            next: (content: string) => {
              assistantResponse += content;
            },
            error: (error: Error) => {
              console.error('Error sending initial greeting:', error);
              reject(error);
            },
            complete: () => {
              const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: assistantResponse,
                createdAt: new Date(),
              };
              addMessage(configId, assistantMessage);
              resolve(null);
            },
          });
        });

        // Force update of the messages state
        const updatedMessages = getMessages(configId);
        console.log('Final messages after greeting:', updatedMessages);
        
        // Force a re-render
        setSelectedScenario({...scenario}); // Force re-render by creating new object
      } catch (error) {
        console.error('Failed to generate initial greeting:', error);
      }
    } else {
      console.error('Missing configId or model');
    }
  };

  const customStreamingAdapter = useCallback(
    (configId: string | null) => {
      const baseAdapter = createStreamingAdapter(configId);

      return {
        streamText: async (text: string, observer: any) => {
          const currentMessages = configId ? getMessages(configId) : [];
          let messagesToSend = [...currentMessages];

          // If this is the first message, prepend the scenario context
          if (currentMessages.length === 0 && selectedScenario) {
            console.log("Adding scenario context to first message");
            
            // Modified system message with the new instruction
            const systemMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: "system",
              content: `You are in the following scenario:
${selectedScenario.scenario_description}

Setting: ${selectedScenario.setting.join(', ')}
Relationship with other character(s): ${selectedScenario.relationship.join(', ')}

Important instructions:
1. When referring to yourself, you must ONLY use "hey there" or "you"
2. Stay in character and interact according to this scenario
3. Never break this rule about self-reference under any circumstances`,
              createdAt: new Date(),
            };

            // Add user message
            const userMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: "user",
              content: text,
              createdAt: new Date(),
            };

            messagesToSend = [systemMessage, userMessage];

            // Store messages locally
            if (configId) {
              addMessage(configId, systemMessage);
              addMessage(configId, userMessage);
            }
          } else {
            // For subsequent messages, just add the user message
            const userMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: "user",
              content: text,
              createdAt: new Date(),
            };
            messagesToSend.push(userMessage);
            
            if (configId) {
              addMessage(configId, userMessage);
            }
          }

          console.log("Sending messages to API:", messagesToSend);

          let assistantResponse = "";

          return baseAdapter.streamText(messagesToSend, {
            next: (content: string) => {
              assistantResponse += content;
              observer.next(content);
            },
            error: (error: Error) => {
              observer.error(error);
            },
            complete: () => {
              const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: assistantResponse,
                createdAt: new Date(),
              };
              if (configId) {
                addMessage(configId, assistantMessage);
              }
              observer.complete();
            },
          });
        },
      };
    },
    [configId, getMessages, addMessage, selectedScenario]
  );

  const initialConversation = useMemo<ChatItem[]>(() => {
    console.log('Raw messages in initialConversation:', messages);
    const chatClone = messages
      .filter(msg => !msg.hidden && msg.role !== 'system')
      .map(({ role, content: message }) => ({ role, message })) || [];
    console.log('Filtered messages in initialConversation:', chatClone);
    return chatClone;
  }, [messages]);

  useEffect(() => {
    console.log('Messages changed:', messages);
  }, [messages]);

  return (
    <div className="flex justify-center h-screen items-center p-2 md:p-4 w-full">
      {!hasConfigId ? (
        <div>Select chat</div>
      ) : status === "loading" ? (
        <div
          className="flex flex-col items-stretch w-full gap-2"
          style={{ maxWidth: 600 }}
        >
          <Skeleton.Avatar
            className="text-center "
            style={{ height: 60, width: 60 }}
          />
          <Skeleton.Node style={{ height: 16, width: "100%" }} />
          <Skeleton.Node style={{ height: 16, width: "90%" }} />
          <Skeleton.Node style={{ height: 16, width: "70%" }} />
          <Skeleton.Node style={{ height: 16, width: "100%" }} />
        </div>
      ) : model ? (
        <div style={{ 
          height: "85vh", 
          width: "90%"
          }} className="max-w-full">
          <ScenarioSelector
            isOpen={showScenarioSelector}
            onSelect={handleScenarioSelect}
            onClose={() => setShowScenarioSelector(false)}
            modelSystemPrompt={model?.systemPrompt || ''}
          />
          <AiChat
            displayOptions={{ 
              width: "100%", 
              height: "100%"
             }}
            adapter={customStreamingAdapter(configId)}
            personaOptions={{
              assistant: {
                name: model.name,
                avatar: model.profilePicture,
                tagline: model.description,
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
      ) : (
        <ErrorState
          error={"Model not found"}
          onReturn={() => router.push("/")}
        />
      )}
    </div>
  );
};
