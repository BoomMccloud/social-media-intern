// src/app/api/handleMessages/route.ts
import { NextResponse } from "next/server";
import { ChatService } from "@/lib/chatService";
import { OpenRouterProvider } from "@/lib/openrouter-provider";
import { Message, LLMConfig } from "@/types/chat";

interface RequestBody {
  messages: Message[];
  config: {
    llmConfig: LLMConfig;
    systemPrompt: string;
  };
}

const createResponseStream = async (textStream: AsyncIterable<string>) => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const textPart of textStream) {
          const chunk = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: textPart,
            createdAt: new Date(),
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
          );
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
};

export async function POST(req: Request) {
  try {
    const { messages, config } = (await req.json()) as RequestBody;

    if (!messages?.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const provider = new OpenRouterProvider(process.env.OPENROUTER_API_KEY);
    const chatService = ChatService.getInstance(provider);

    const textStream = chatService.continueConversation(
      messages,
      config.llmConfig,
      config.systemPrompt
    );

    const stream = await createResponseStream(textStream);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
