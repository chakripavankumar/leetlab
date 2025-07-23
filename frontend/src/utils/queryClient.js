import { QueryCache, QueryClient } from 'react-query';

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 60 * 1000,
      retry: false,
    },
  },
});

export default queryClient;
