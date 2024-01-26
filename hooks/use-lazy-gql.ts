"use client";

import { useCallback, useRef, useState } from "react";

type UseLazyQuery<T> = {
  data: T | null;
  loading: boolean;
  error: any;
  called: boolean;
  reset: () => void;
};

function useLazyQuery<T>(
  query: string
): [(variables: Record<string, any>) => void, UseLazyQuery<T>] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  const cache = useRef<any>({});

  const fetchData = useCallback(
    async (variables: Record<string, any>) => {
      setLoading(true);
      setCalled(true);
      setData(null);
      setError(null);

      const cacheKey = JSON.stringify({ query, variables });

      let cancelRequest = false;

      if (cache.current[cacheKey]) {
        setData(cache.current[cacheKey]);
        setLoading(false);
        setError(null);
      } else {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_GQL_ENDPOINT!, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ query, variables }),
          });
          const data = await response.json();
          cache.current[cacheKey] = data.data;
          if (cancelRequest) return;
          setData(data.data);
          setLoading(false);

          if (data.errors) {
            setError(data.errors);
          }
        } catch (error: any) {
          if (cancelRequest) return;
          setData(null);
          setLoading(false);
          setError(error.message);
        }
      }
    },
    [query]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setCalled(false);
  }, []);

  return [fetchData, { data, loading, error, called, reset }];
}

export default useLazyQuery;
