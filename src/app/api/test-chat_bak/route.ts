// src/app/api/test-chat/route.ts
import { NextResponse } from "next/server";
import { OpenRouterProvider } from "@/lib/openrouter-provider";
import { ChatService } from "@/lib/chatService";
import { ChatMessage, LLMConfig } from "@/types/chat";

export async function GET() {
  try {
    // Test messages
    const messages: ChatMessage[] = [
      {
        id: "1",
        role: "system",
        content: "You are a helpful AI assistant.",
        createdAt: new Date(),
      },
      {
        id: "2",
        role: "user",
        content: "What is the capital of France?",
        createdAt: new Date(),
      },
    ];

    // Test config
    const llmConfig: LLMConfig = {
      configId: "test-config",
      modelId: "anthropic/claude-3-opus",
      temperature: 0.7,
      maxTokens: 1000,
    };

    const systemPrompt = "You are a helpful AI assistant.";

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const provider = new OpenRouterProvider(process.env.OPENROUTER_API_KEY);
    const chatService = ChatService.getInstance(provider);

    const textStream = chatService.continueConversation(
      messages,
      llmConfig,
      systemPrompt
    );

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            const data = {
              id: crypto.randomUUID(),
              content: chunk,
              createdAt: new Date(),
            };
            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          }
          controller.enqueue("data: [DONE]\n\n");
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Test chat error:", error);
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
