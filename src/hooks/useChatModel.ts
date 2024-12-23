// hooks/useChatModel.ts
import { ModelData } from "@/app/api/model/route";
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
  } = useQuery<ModelData>({
    queryKey: [configId],
    queryFn: async () => {
      const { data } = await axios.get<ModelData>(
        `/api/model?type=chat&configId=${configId}`
      );
      return data;
    },
    enabled: isAuthenticated && !!configId,
  });

  return { model, loading, error };
}
