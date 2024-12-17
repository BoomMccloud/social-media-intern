// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { ChatService } from "@/lib/chat-service";
import { getModelConfigs } from "@/lib/config";
import { DEFAULT_MODELS } from "@/config/default-models";
import { DEFAULT_MODEL } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    console.log("1. Starting chat request");
    const body = await req.json();
    console.log("2. Request body:", body);

    const { messages } = body;
    console.log("3. Received messages:", messages);

    if (!messages?.length) {
      console.log("4. Error: Empty messages array");
      throw new Error("Messages array is required and must not be empty");
    }

    console.log(
      "5. Checking OPENROUTER_API_KEY:",
      !!process.env.OPENROUTER_API_KEY
    );
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not found in environment variables");
    }

    // Load current model configurations
    const modelConfigs = await getModelConfigs(DEFAULT_MODELS);
    console.log("6. Model configs loaded:", modelConfigs);

    // Always try to find the active model first
    const activeModel = modelConfigs.find((model) => model.isActive);
    console.log("7. Found active model:", activeModel || "none");

    // Fallback to first model if no active model
    const selectedModel = activeModel || modelConfigs[0];
    console.log("8. Selected model:", {
      configId: selectedModel.configId,
      modelId: selectedModel.modelId,
      name: selectedModel.name,
      isActive: selectedModel.isActive,
      reason: activeModel ? "active model" : "fallback to first model",
    });

    if (!selectedModel.modelId) {
      console.error("9. Error: Selected model has no modelId");
      throw new Error("Selected model configuration has no modelId");
    }

    const chatService = new ChatService(process.env.OPENROUTER_API_KEY);

    try {
      console.log(
        "10. Attempting to stream response using model:",
        selectedModel.modelId
      );
      const { textStream } = await chatService.streamResponse(
        messages[messages.length - 1].content,
        selectedModel
      );
      console.log("11. Stream created successfully");

      // Create the response stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            console.log("12. Starting stream processing");
            for await (const textPart of textStream) {
              console.log(
                "13. Received text part:",
                textPart.slice(0, 50) + "..."
              );
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
            console.log("14. Stream completed successfully");
          } catch (error) {
            console.error("15. Stream processing error:", error);
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
    } catch (streamError) {
      console.error("16. Streaming error:", streamError);
      throw streamError;
    }
  } catch (error) {
    console.error("17. Final error catch:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
