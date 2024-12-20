"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { createStreamingAdapter } from "@/app/chat/stream";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";
import { Suspense, useEffect } from "react";
import { ModelConfig } from "@/types/chat";
import { useSession } from "next-auth/react";
import { useChatModel } from "@/hooks/useChatModel";

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
    <div className="flex justify-center w-screen h-screen items-center">
      <AiChat
        displayOptions={{ width: "60%", height: "50%" }}
        adapter={createStreamingAdapter(configId)}
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