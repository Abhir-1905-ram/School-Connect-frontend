import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: 1,
        retryDelay: 300,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
}
