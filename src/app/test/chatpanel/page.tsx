// src/app/chat/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { nanoid } from "nanoid";
import { ChatMessage, LLMConfig } from "@/types/chat";

const defaultConfig: LLMConfig = {
  configId: "default",
  modelId: "openai/gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 1000,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: inputMessage.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/openRouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map(({ role, content }) => ({ role, content })),
          config: defaultConfig,
          systemPrompt: "", // Define your system prompt here
        }),
      });

      if (!response.ok) throw new Error("Failed to generate response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += new TextDecoder().decode(value);
      }

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: assistantContent,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg max-w-[80%] ${
              message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            <div className="text-sm text-gray-500 mb-1">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
            Generating response...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
