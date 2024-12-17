// src/utils/openrouter.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

// Define a type for the chat message
// interface ChatMessage {
//   role: "user" | "assistant";
//   content: string;
// }

export const streamChat = async (prompt: string, modelName: string) => {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  try {
    const result = await streamText({
      model: openrouter(modelName),
      prompt: prompt,
      // Add any additional parameters you might need
      temperature: 0.7,
      max_tokens: 1000,
    });

    return result;
  } catch (error) {
    console.error("Error in streamChat:", error);
    throw error;
  }
};
