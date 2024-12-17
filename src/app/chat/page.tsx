"use client";
import { streamText } from "@/app/chat/stream";
import { AiChat, AiChatUI, useAsStreamAdapter } from "@nlux/react";
import "@nlux/themes/nova.css";

export default function Chat() {
  // We transform the streamText function into an adapter that <AiChat /> can use
  const chatAdapter = useAsStreamAdapter(streamText);

  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <AiChat
        displayOptions={{ width: "50%", height: "50%" }}
        adapter={chatAdapter}
        personaOptions={{
          assistant: {
            name: "HarryBotter",
            avatar:
              "https://docs.nlkit.com/nlux/images/personas/harry-botter.png",
            tagline: "Making Magic With Mirthful AI",
          },
          user: {
            name: "Alex",
            avatar: "https://docs.nlkit.com/nlux/images/personas/alex.png",
          },
        }}
        conversationOptions={{
          conversationStarters: [
            // Funny prompts as if you're talking to HarryBotter
            { prompt: "What is the spell to make my code work?" },
            { prompt: "Can you show me a magic trick?" },
            { prompt: "Where can I find the book of wizardry?" },
          ],
        }}
      >
        {/* <AiChatUI.Greeting>
          <span className="rounded">Hello! 👋</span>
        </AiChatUI.Greeting> */}
      </AiChat>
    </div>
  );
}
