// hooks/useChatModel.ts
import { useState, useEffect } from "react";
import { ModelConfig } from "@/types/chat";

export function useChatModel(
  configId: string | null,
  isAuthenticated: boolean
) {
  const [model, setModel] = useState<ModelConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configId) {
      setError("No model selected");
      return;
    }

    if (!isAuthenticated) return;

    async function fetchModel() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/model?type=chat&configId=${configId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch model data");
        }
        const data = await response.json();
        if (!data) {
          throw new Error("Model not found");
        }
        setModel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load model");
      } finally {
        setLoading(false);
      }
    }

    fetchModel();
  }, [configId, isAuthenticated]);

  return { model, loading, error };
}
