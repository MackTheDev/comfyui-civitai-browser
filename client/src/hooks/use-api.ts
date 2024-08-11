import { useCallback, useState } from "react";
import axios from "axios";

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (params: Record<string, never>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>("https://civitai.com/api/v1/models", {
        params,
      });
      setData(response.data);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    data,
    error,
    fetchData,
  };
}
