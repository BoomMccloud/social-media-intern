"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { createStreamingAdapter } from "@/app/chat/stream";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";
import { Suspense, useEffect, useState } from "react";
import { ModelConfig } from "@/types/chat";
import { useSession } from "next-auth/react";

function LoadingState() {
  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <div className="text-xl">Loading chat model...</div>
    </div>
  );
}

function ErrorState({
  error,
  onReturn,
}: {
  error: string;
  onReturn: () => void;
}) {
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
  const configId = searchParams.get("configId");
  const [model, setModel] = useState<ModelConfig | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // Get the full current URL including query parameters
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });

  useEffect(() => {
    // Validate configId exists
    if (!configId) {
      setError("No model selected");
      return;
    }

    async function fetchModel() {
      setModelLoading(true);
      try {
        const response = await fetch(
          `/api/model?type=chat&configId=${configId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch model data");
        }
        const data = await response.json();
        if (!data) {
          throw new Error("Model not found");
        }
        setModel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load model");
      } finally {
        setModelLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchModel();
    }
  }, [configId, status, router]);

  // Handle authentication loading
  if (status === "loading") {
    return (
      <div className="flex justify-center w-screen h-screen items-center">
        <div className="text-xl">Verifying your access...</div>
      </div>
    );
  }

  // Handle model loading
  if (modelLoading) {
    return <LoadingState />;
  }

  if (error || !model) {
    return (
      <ErrorState
        error={error || "Model not found"}
        onReturn={() => router.push("/")}
      />
    );
  }

  return (
    <div className="flex justify-center h-screen items-center p-4">
      <div style={{ height: 500, maxWidth: 600 }}>
        <AiChat
          displayOptions={{ width: "100%", height: "100%" }}
          adapter={createStreamingAdapter(configId)}
          personaOptions={{
            assistant: {
              name: model.name,
              avatar: model.avatar,
              tagline: model.systemPrompt.split("\n")[0],
            },
            user: {
              name: session?.user?.name || "User",
              avatar: session?.user?.image || "/images/user/avatar.jpg",
            },
          }}
        />
      </div>
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
