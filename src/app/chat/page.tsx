"use client";

import "@nlux/themes/nova.css";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Breadcrumb, Divider, Grid, Skeleton, Splitter } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";
import { ChatPanel } from "@/app/chat/ChatPanel";
import { useRouter, useSearchParams } from "next/navigation";
import { WechatWorkOutlined } from "@ant-design/icons";
import { Character } from "@/types/character";
import { useChatStore } from "@/store/chat-store";

const { useBreakpoint } = Grid;

function ChatComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const hasCharacterId = characterId != null;
  const [isLoading, setIsLoading] = useState(false);
  const { clearSession } = useChatStore();
  const currentCharacterId = searchParams.get("characterId");
  const llmConfigId = searchParams.get("configId");
  const sessionId = currentCharacterId
    ? `${currentCharacterId}-${llmConfigId || "default"}`
    : null;

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    },
  });
  const [sizes, setSizes] = useState<(number | string)[]>(["300", "70%"]);

  const { md } = useBreakpoint();

  const { data: characters = [], isLoading: charactersLoading } = useQuery<
    Character[]
  >({
    queryKey: ["characters"],
    queryFn: async () => {
      const { data } = await axios.get<Character[]>("/api/listCharacters");
      return data;
    },
  });

  const selectedCharacter = characters.find((char) => char.id === characterId);
  const showOnlyChat = !md && hasCharacterId;

  // Then modify handleCharacterClick:
  const handleCharacterClick = (characterId: string) => {
    // Don't do anything if clicking the same character
    if (characterId === currentCharacterId) return;

    // Set loading state while we switch
    setIsLoading(true);

    // Clear current chat panel
    if (sessionId) {
      clearSession(sessionId);
    }

    // Navigate to new character
    router.push(`/chat?characterId=${characterId}`);
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
      {(md || !hasCharacterId) && (
        <Splitter.Panel size={sizes[0]}>
          <nav className="font-medium">
            {charactersLoading || status === "loading" ? (
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
              characters.map((character) => (
                <div key={character.id}>
                  <a
                    className={`${
                      character.id === characterId
                        ? "text-primary bg-[#222222]"
                        : "bg-transparent"
                    } flex items-center h-20 gap-3 px-3 py-2 transition-all hover:text-primary cursor-pointer hover:bg-[#222222]`}
                    onClick={() => handleCharacterClick(character.id)}
                  >
                    <Avatar
                      className="flex-shrink-0"
                      size={48}
                      src={character.profilePicture}
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="w-full">
                        <h5 className="font-semibold line-clamp-1">
                          {character.name}
                        </h5>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {character.displayDescription}
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
                        <span>{selectedCharacter?.name}</span>
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
    <div className="text-xl">Loading available characters...</div>
  </div>
);
