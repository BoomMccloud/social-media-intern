// src/app/chat/page.tsx
"use client";
import { createStreamingAdapter } from "@/app/chat/stream";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";

export default function Chat() {
  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <AiChat
        displayOptions={{ width: "50%", height: "50%" }}
        adapter={createStreamingAdapter()}
        personaOptions={{
          assistant: {
            name: "HarryBotter",
            avatar: "https://docs.nlkit.com/nlux/images/personas/harry-botter.png",
            tagline: "Making Magic With Mirthful AI",
          },
          user: {
            name: "Alex",
            avatar: "https://docs.nlkit.com/nlux/images/personas/alex.png",
          },
        }}
        conversationOptions={{
          conversationStarters: [
            { prompt: "What is the spell to make my code work?" },
            { prompt: "Can you show me a magic trick?" },
            { prompt: "Where can I find the book of wizardry?" },
          ],
        }}
      />
    </div>
  );
}