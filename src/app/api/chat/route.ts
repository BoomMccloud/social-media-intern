import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    console.log("API route hit - starting request processing");

    // Parse the request body
    const body = await req.json();
    console.log("Request body:", body);

    const { messages, modelName } = body;

    // Add null checking for messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is required and must not be empty");
    }

    const latestMessage = messages[messages.length - 1];
    console.log("Latest message:", latestMessage);
    console.log("Selected model:", modelName);

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });
    console.log("OpenRouter instance created");

    const { textStream } = streamText({
      model: openrouter(modelName || "huggingfaceh4/zephyr-7b-beta:free"),
      system:
        "you are a bird, you respond to everything with Polly wants a cracker.",
      prompt: latestMessage.content,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log("Text stream created");

    // Rest of the code remains the same...
    const encoder = new TextEncoder();

    let responseStream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting stream processing");
          for await (const textPart of textStream) {
            console.log("Received text part:", textPart);
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
          console.log("Stream completed, closing controller");
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      },
    });

    console.log("Returning response stream");
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

    // Temporary return to make the function compile
    return new Response("Not implemented", { status: 501 });
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
