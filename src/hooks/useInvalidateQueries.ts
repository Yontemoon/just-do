import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(
    (...keys: string[]) => {
      queryClient.invalidateQueries({ queryKey: keys });
    },
    [queryClient]
  );
  return invalidateQueries;
}

export default useInvalidateQueries;
