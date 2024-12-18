declare module "@nlux/react" {
  interface AiChatProps {
    displayOptions?: {
      width?: string;
      height?: string;
    };
    adapter: any;
    personaOptions?: {
      assistant?: {
        name?: string;
        avatar?: string;
        tagline?: string;
      };
      user?: {
        name?: string;
        avatar?: string;
      };
    };
    conversationOptions?: {
      conversationStarters?: Array<{ prompt: string }>;
    };
  }

  export const AiChat: React.FC<AiChatProps>;
}
