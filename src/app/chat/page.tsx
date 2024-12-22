"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { createStreamingAdapter } from "@/app/chat/stream";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";
import { Suspense, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useChatModel } from "@/hooks/useChatModel";
import { useChatStore } from "@/store/chat-store";
import { ChatMessage } from "@/types/chat";

const LoadingState = () => (
  <div className="flex justify-center w-screen h-screen items-center">
    <div className="text-xl">Loading chat model...</div>
  </div>
);

const ErrorState = ({ error, onReturn }: { error: string; onReturn: () => void }) => (
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

function ChatComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configId = searchParams.get('configId');
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });

  const { model, loading, error } = useChatModel(configId, status === "authenticated");
  const { addMessage, getMessages, clearSession } = useChatStore();

  // Get existing messages for this chat
  const messages = useMemo(() => 
    configId ? getMessages(configId) : [],
    [configId, getMessages]
  );

  // Debug logging to verify messages state
  console.log('Current messages in chat:', messages);

  const handleClearChat = useCallback(() => {
    if (configId) {
      clearSession(configId);
      window.location.reload();
    }
  }, [configId, clearSession]);

  const customStreamingAdapter = useCallback((configId: string | null) => {
    // Create a new base adapter for each chat session
    const baseAdapter = createStreamingAdapter(configId);
    
    return {
      streamText: async (text: string, observer: any) => {
        // Get the latest messages at the time of the request
        const currentMessages = configId ? getMessages(configId) : [];
        
        const userMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: text,
          createdAt: new Date()
        };

        if (configId) {
          addMessage(configId, userMessage);
        }

        let assistantResponse = '';

        // Pass both existing messages and new user message to the API
        return baseAdapter.streamText([...currentMessages, userMessage], {
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
              role: 'assistant',
              content: assistantResponse,
              createdAt: new Date()
            };
            if (configId) {
              addMessage(configId, assistantMessage);
            }
            observer.complete();
          }
        });
      }
    };
  }, [configId, getMessages, addMessage]); // Added getMessages to dependencies

  if (status === "loading") {
    return <LoadingState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error || !model) {
    return <ErrorState error={error || 'Model not found'} onReturn={() => router.push('/')} />;
  }

  return (
    <div className="flex flex-col justify-center w-screen h-screen items-center relative">
      <AiChat
        displayOptions={{ width: "60%", height: "50%" }}
        adapter={customStreamingAdapter(configId)}
        personaOptions={{
          assistant: {
            name: model.name,
            avatar: model.avatar,
            tagline: model.systemPrompt.split('\n')[0],
          },
          user: {
            name: session?.user?.name || "User",
            avatar: session?.user?.image || "/images/user/avatar.jpg",
          },
        }}
      />
      <button
        onClick={handleClearChat}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Clear Chat History
      </button>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ChatComponent />
    </Suspense>
  );
}