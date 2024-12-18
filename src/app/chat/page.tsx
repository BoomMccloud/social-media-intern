"use client";
import { useSearchParams } from "next/navigation";
import { createStreamingAdapter } from "@/app/chat/stream";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ModelData {
  configId: string;
  name: string;
  systemPrompt: string;
  isActive: boolean;
  modelId: string;
}

function LoadingState() {
  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <div className="text-xl">Loading chat model...</div>
    </div>
  );
}

function ErrorState({ error, onReturn }: { error: string; onReturn: () => void }) {
  return (
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
}

function ChatComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configId = searchParams.get('configId');
  const [model, setModel] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModel() {
      try {
        const response = await fetch(`/api/model?type=chat${configId ? `&configId=${configId}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch model data');
        }
        const data = await response.json();
        setModel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model');
      } finally {
        setLoading(false);
      }
    }

    fetchModel();
  }, [configId]);

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
            avatar: "/api/placeholder/200/200",
            tagline: model.systemPrompt.split('\n')[0], // Use first line of system prompt as tagline
          },
          user: {
            name: "User",
            avatar: "/api/placeholder/200/200",
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