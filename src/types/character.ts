interface DialogueExchange {
  context: string;
  response: string;
}

interface Appearance {
  age: number;
  build: string;
  hair?: string;
  eyes?: string;
  complexion?: string;
  height?: string;
}

interface CommunicationStyle {
  patterns: string[]; // Core speech patterns and habits
  terminology?: string[]; // Domain-specific language usage
  tone?: string[]; // Emotional and delivery aspects
}

interface CategoryTraits {
  category: string;
  traits: string[];
}

export interface CharacterInfo {
  occupation: string;
  appearance: Appearance;
  environment: string[];
  communicationStyle: CommunicationStyle;
  exampleDialogue?: DialogueExchange[];
  personality?: string[];
  traits?: CategoryTraits[];
}

export interface Character {
  id: string;
  name: string;
  profilePicture: string;
  displayDescription: string;
  tags: [string];
  characterInfo: CharacterInfo;
}
