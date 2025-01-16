// hooks/useChatModel.ts
import { Character } from "@/types/character";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useChatModel(
  configId: string | null,
  isAuthenticated: boolean
) {
  const {
    data: model,
    error,
    isLoading: loading,
  } = useQuery<Character>({
    queryKey: ["character", configId],
    queryFn: async () => {
      // First fetch the list of characters
      const { data: characters } = await axios.get<Character[]>(
        `/api/listCharacters`
      );

      // Find the character that matches the configId
      const character = characters.find((char) => char.id === configId);

      if (!character) {
        throw new Error(`Character with ID ${configId} not found`);
      }

      // Transform the character data to match the expected model interface
      return {
        ...character,
        description: character.displayDescription,
        systemPrompt: "", // You might want to generate this based on characterInfo
      };
    },
    enabled: isAuthenticated && !!configId,
  });

  return { model, loading, error };
}
