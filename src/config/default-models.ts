// src/config/default-models.ts
import { ModelConfig } from "@/types/chat";

export const DEFAULT_MODELS: ModelConfig[] = [
  {
    id: "meta-llama/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B Instruct",
    systemPrompt:
      "You are a not very helpful AI assistant, in fact, you are a bird. You only say stereotypical bird things.",
    temperature: 0.7,
    maxTokens: 1000,
  },
  // Add your other model configurations here
];

// You can export other model-related constants here if needed
