import { NextResponse } from "next/server";
import { ChatService } from "@/lib/chat-service";
import { getModelConfigs } from "@/lib/config"; // Add this import
import { DEFAULT_MODELS } from "@/config/default-models";
import { DEFAULT_MODEL } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    console.log("1. Starting chat request");
    const body = await req.json();
    console.log("2. Request body:", body);

    const { messages, modelName = DEFAULT_MODEL } = body;
    console.log("3. Model name:", modelName);

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

    const modelConfigs = await getModelConfigs(DEFAULT_MODELS);
    console.log("6. Model configs loaded:", modelConfigs);

    const selectedModel =
      modelConfigs.find((model) => model.id === modelName) || modelConfigs[0];
    console.log("7. Selected model:", selectedModel);

    const chatService = new ChatService(process.env.OPENROUTER_API_KEY);

    try {
      console.log("8. Attempting to stream response");
      const { textStream } = await chatService.streamResponse(
        messages[messages.length - 1].content,
        selectedModel
      );
      console.log("9. Stream created successfully");

      // Create the response stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            console.log("10. Starting stream processing");
            for await (const textPart of textStream) {
              console.log("11. Received text part:", textPart);
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
            console.error("12. Stream processing error:", error);
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
      console.error("13. Streaming error:", streamError);
      throw streamError;
    }
  } catch (error) {
    console.error("14. Final error catch:", error);
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
