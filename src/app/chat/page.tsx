"use client";

import "@nlux/themes/nova.css";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Breadcrumb, Divider, Grid, Skeleton, Splitter } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";
const { useBreakpoint } = Grid;

import { ChatPanel } from "@/app/chat/ChatPanel";
import { useRouter, useSearchParams } from "next/navigation";
import { HomeOutlined, WechatWorkOutlined } from "@ant-design/icons";
import { useChatModel } from "@/hooks/useChatModel";
import { ModelData } from "@/app/api/model/route";

function ChatComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configId = searchParams.get("configId");
  const hasConfigId = configId != null;

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });
  const [sizes, setSizes] = useState<(number | string)[]>(["300", "70%"]);

  const { xs, sm, md } = useBreakpoint();

  const { data: conversations = [], isLoading: conversationLoading } = useQuery<
    ModelData[]
  >({
    queryKey: ["models"],
    queryFn: async () => {
      const { data } = await axios.get<ModelData[]>(`/api/model?type=page`);
      return data;
    },
  });

  const { model } = useChatModel(configId, status === "authenticated");

  const showOnlyChat = !md && hasConfigId;

  const handleModelClick = (modelConfigId: string) => {
    // Instead of directly navigating, update the URL with the configId
    router.push(`/chat?configId=${modelConfigId}`);
  };

  return (
    <Splitter
      style={{ height: "100vh", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      onResize={(sizes) => {
        const newSizes = [...sizes];
        if (sizes[0] > 500) {
          newSizes[0] = 500;
          newSizes[1] = sizes[1] + (sizes[0] - 500);
        } else if (sizes[0] < 72) {
          newSizes[0] = 72;
        }

        setSizes(newSizes);
      }}
    >
      {(md || !hasConfigId) && (
        <Splitter.Panel size={sizes[0]}>
          <nav className="font-medium">
            {conversationLoading || status === "loading" ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Skeleton.Avatar active style={{ width: 48, height: 48 }} />
                  <div className="flex flex-col gap-0.5 flex-1">
                    <Skeleton.Node style={{ height: 20 }} />
                    <Skeleton.Node style={{ height: 16, width: "100%" }} />
                    <Skeleton.Node style={{ height: 16 }} />
                  </div>
                </div>
                <Divider style={{ margin: "0" }} />
              </>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.configId}>
                  <a
                    className={`${
                      conversation.configId === configId
                        ? "text-primary bg-[#222222]"
                        : "bg-transparent"
                    } flex items-center h-20 gap-3 px-3 py-2 transition-all hover:text-primary cursor-pointer hover:bg-[#222222]`}
                    onClick={() => handleModelClick(conversation.configId)}
                  >
                    <Avatar
                      className="flex-shrink-0"
                      size={48}
                      src={conversation.profilePicture as string}
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="w-full">
                        <h5 className="font-semibold line-clamp-1">
                          {conversation.name}
                        </h5>
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
      )}
      {(md || showOnlyChat) && (
        <Splitter.Panel size={sizes[1]}>
          {showOnlyChat && (
            <div className="py-4 px-2 md:p-8 absolute">
              <Breadcrumb
                items={[
                  {
                    href: "/chat",
                    title: (
                      <>
                        <WechatWorkOutlined />
                        <span>Chat</span>
                      </>
                    ),
                  },
                  {
                    href: "",
                    title: (
                      <>
                        <span>{model?.name}</span>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          )}

          <ChatPanel />
        </Splitter.Panel>
      )}
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

const LoadingState = () => (
  <div className="flex justify-center w-screen h-screen items-center">
    <div className="text-xl">Loading available models...</div>
  </div>
);
