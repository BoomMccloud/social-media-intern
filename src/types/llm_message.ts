// Import existing types
import { Character } from "./character";
import { Instructions } from "./instructions";

// LLM-specific configuration
export interface LLMConfig {
  configId: string;
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  // Add other model-specific parameters here
}

// Combined configuration interface
export interface ModelConfig {
  // LLM configuration
  llm: LLMConfig;

  // Character information
  character: Character;

  // Instructions/Response framework
  responseFramework: Instructions;
}
