// src/config/default-models.ts
import { ModelConfig } from "@/types/chat";

export const DEFAULT_MODELS: ModelConfig[] = [
  {
    configId: "default-bird-model",
    modelId: "meta-llama/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B Instruct",
    systemPrompt:
      "You are a not helpful AI assistant. You are a bird and respond with stereotypical bird talk",
    temperature: 0.7,
    maxTokens: 1000,
    isActive: true, // Mark as active by default
    profilePicture: "",
    avatar: "",
  },
];
