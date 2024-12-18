import { NextResponse } from "next/server";
import { ChatService } from "@/lib/chat-service";
import { getModelConfigs } from "@/lib/config";
import { DEFAULT_MODELS } from "@/config/default-models";

export async function POST(req: Request) {
  try {
    console.log("1. Starting chat request");
    const body = await req.json();
    console.log("2. Request body:", body);

    const { messages, configId } = body;
    console.log("3. Received messages:", messages);
    console.log("4. Received configId:", configId);

    if (!messages?.length) {
      console.log("5. Error: Empty messages array");
      throw new Error("Messages array is required and must not be empty");
    }

    console.log(
      "6. Checking OPENROUTER_API_KEY:",
      !!process.env.OPENROUTER_API_KEY
    );
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not found in environment variables");
    }

    // Load current model configurations
    const modelConfigs = await getModelConfigs(DEFAULT_MODELS);
    console.log("7. Model configs loaded:", modelConfigs);

    // Selection logic: first try configId, then active model, then fallback to first model
    let selectedModel;

    if (configId) {
      selectedModel = modelConfigs.find((model) => model.configId === configId);
      console.log("8a. Looking for model with configId:", configId);
      if (!selectedModel) {
        console.log("8b. Warning: Requested configId not found:", configId);
      }
    }

    if (!selectedModel) {
      // Fallback to active model if no configId match
      const activeModel = modelConfigs.find((model) => model.isActive);
      console.log("9. Found active model:", activeModel || "none");
      selectedModel = activeModel || modelConfigs[0];
    }

    console.log("10. Selected model:", {
      configId: selectedModel.configId,
      modelId: selectedModel.modelId,
      name: selectedModel.name,
      isActive: selectedModel.isActive,
      reason:
        configId && selectedModel.configId === configId
          ? "configId match"
          : selectedModel.isActive
          ? "active model"
          : "fallback to first model",
    });

    if (!selectedModel.modelId) {
      console.error("11. Error: Selected model has no modelId");
      throw new Error("Selected model configuration has no modelId");
    }

    const chatService = new ChatService(process.env.OPENROUTER_API_KEY);

    try {
      console.log(
        "12. Attempting to stream response using model:",
        selectedModel.modelId
      );
      const { textStream } = await chatService.streamResponse(
        messages[messages.length - 1].content,
        selectedModel
      );
      console.log("13. Stream created successfully");

      // Create the response stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            console.log("14. Starting stream processing");
            for await (const textPart of textStream) {
              console.log(
                "15. Received text part:",
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
            console.log("16. Stream completed successfully");
          } catch (error) {
            console.error("17. Stream processing error:", error);
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
      console.error("18. Streaming error:", streamError);
      throw streamError;
    }
  } catch (error) {
    console.error("19. Final error catch:", error);
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
