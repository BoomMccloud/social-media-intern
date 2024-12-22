// hooks/useChatModel.ts
import { Model } from "@/app/page";
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
  } = useQuery<Model>({
    queryKey: [configId],
    queryFn: async () => {
      const { data } = await axios.get<Model>(
        `/api/model?type=chat&configId=${configId}`
      );
      return data;
    },
    enabled: isAuthenticated,
  });

  return { model, loading, error };
}
