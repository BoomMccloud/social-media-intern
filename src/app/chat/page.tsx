"use client";

import { createStreamingAdapter } from "@/app/chat/stream";
import { Model } from "@/app/page";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Divider, Skeleton, Splitter } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
  const hasConfigId = configId != null;
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // Get the full current URL including query parameters
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });

  const {
    data: model,
    error: modelError,
    isLoading: modelLoading,
  } = useQuery<Model>({
    queryKey: [configId],
    queryFn: async () => {
      const { data } = await axios.get<Model>(
        `/api/model?type=chat&configId=${configId}`
      );
      return data;
    },
    enabled: status === "authenticated",
  });

  const {
    data: conversations = [],

    isLoading: conversationLoading,
  } = useQuery<Model[]>({
    queryKey: ["models"],
    queryFn: async () => {
      const { data } = await axios.get<Model[]>(`/api/model?type=page`);
      return data;
    },
  });

  return (
    <Splitter
      style={{ height: "100vh", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
    >
      <Splitter.Panel defaultSize="300" min="100" max="70%">
        <nav className="font-medium">
          {conversationLoading || status === "loading" ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <Skeleton.Avatar
                  active
                  size="medium"
                  style={{ width: 48, height: 48 }}
                />
                <div className="flex flex-col gap-0.5 flex-1">
                  <Skeleton.Node style={{ height: 20 }} />
                  <Skeleton.Node style={{ height: 16, width: "100%" }} />
                  <Skeleton.Node style={{ height: 16 }} />
                </div>
              </div>
              <Divider style={{ margin: "0" }} />
              <div className="flex items-center gap-3 px-3 py-2">
                <Skeleton.Avatar
                  active
                  size="medium"
                  style={{ width: 48, height: 48 }}
                />
                <div className="flex flex-col gap-0.5 flex-1">
                  <Skeleton.Node style={{ height: 20 }} />
                  <Skeleton.Node style={{ height: 16, width: "100%" }} />
                  <Skeleton.Node style={{ height: 16 }} />
                </div>
              </div>
              <Divider style={{ margin: "0" }} />
              <div className="flex items-center gap-3 px-3 py-2">
                <Skeleton.Avatar
                  active
                  size="medium"
                  style={{ width: 48, height: 48 }}
                />
                <div className="flex flex-col gap-0.5 flex-1">
                  <Skeleton.Node style={{ height: 20 }} />
                  <Skeleton.Node style={{ height: 16, width: "100%" }} />
                  <Skeleton.Node style={{ height: 16 }} />
                </div>
              </div>
              <Divider style={{ margin: "0" }} />
            </>
          ) : (
            conversations.map((conversation, index) => (
              <div key={conversation.configId}>
                <a
                  key={`conversation-${conversation.configId}`}
                  className={`${
                    conversation.configId == configId
                      ? "text-primary bg-[#222222]"
                      : "bg-transparent"
                  } flex items-center h-20 gap-3 px-3 py-2 transition-all hover:text-primary cursor-pointer hover:bg-[#222222]`}
                  onClick={() => {
                    router.push(`/chat?configId=${conversation.configId}`);
                  }}
                >
                  <Avatar
                    className="flex-shrink-0"
                    size={48}
                    src={conversation.avatar as string}
                  />

                  <div className="flex flex-col gap-0.5">
                    <div className="w-full">
                      <h5 className="font-semibold">{conversation.name}</h5>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {conversation.description}
                      </p>
                    </div>
                  </div>
                </a>

                <Divider style={{ margin: "0" }} />
              </div>
            ))
          )}
        </nav>
      </Splitter.Panel>
      <Splitter.Panel>
        <div className="flex justify-center h-screen items-center p-4">
          {!hasConfigId && <div>Select chat</div>}
          {status === "loading" ? (
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
            <div style={{ height: 500, maxWidth: 600 }}>
              <AiChat
                displayOptions={{ width: "100%", height: "100%" }}
                adapter={createStreamingAdapter(configId)}
                personaOptions={{
                  assistant: {
                    name: model.name,
                    avatar: model.avatar,
                    tagline: model.systemPrompt?.split("\n")[0],
                  },
                  user: {
                    name: session?.user?.name || "User",
                    avatar: session?.user?.image || "/images/user/avatar.jpg",
                  },
                }}
              />
            </div>
          ) : (
            <ErrorState
              error={"Model not found"}
              onReturn={() => router.push("/")}
            />
          )}
        </div>
      </Splitter.Panel>
    </Splitter>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ChatComponent />
    </Suspense>
  );
}
