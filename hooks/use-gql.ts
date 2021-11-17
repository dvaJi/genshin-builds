import { useEffect } from "react";
import useLazyQuery from "./use-lazy-gql";

function useQuery(query: string, variables: Record<string, any> = {}) {
  const [fetchData, result] = useLazyQuery(query);

  useEffect(() => {
    fetchData(variables);
  }, [fetchData, variables]);

  return result;
}

export default useQuery;
