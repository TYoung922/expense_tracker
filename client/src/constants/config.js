import { QueryClient } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const AXIOS_URL = "http://localhost:5002/api/";

export { AXIOS_URL, queryClient };
