import { ApolloClient, InMemoryCache } from "@apollo/client";

export const CMFXSWAP_URL = "https://versa.money/subgraphs/name/versaswap";

export const CMFXCANDLES_URL =
  "https://versa.money/subgraphs/name/versaswapcandles2";

  // versacandles3
  // versaswapcandles

const client = new ApolloClient({
  uri: CMFXSWAP_URL,
  cache: new InMemoryCache(),
});

export default client;
