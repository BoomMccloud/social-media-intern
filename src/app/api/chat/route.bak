// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { ChatService } from "@/lib/chat-service";
import { getModelConfigs } from "@/lib/config";
import { DEFAULT_MODELS } from "@/config/default-models";
import { ModelConfig } from "@/types/chat";

const selectModel = async (
  configId: string | undefined
): Promise<ModelConfig> => {
  const modelConfigs = await getModelConfigs(DEFAULT_MODELS);

  if (configId) {
    const requestedModel = modelConfigs.find(
      (model) => model.configId === configId
    );
    if (requestedModel) return requestedModel;
  }

  return modelConfigs.find((model) => model.isActive) || modelConfigs[0];
};

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
    const { messages, configId } = await req.json();

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

    const selectedModel = await selectModel(configId);
    if (!selectedModel.modelId) {
      return NextResponse.json(
        { error: "Invalid model configuration" },
        { status: 500 }
      );
    }

    const chatService = ChatService.getInstance(process.env.OPENROUTER_API_KEY);
    const { textStream } = await chatService.streamResponse(
      messages[messages.length - 1].content,
      selectedModel
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
