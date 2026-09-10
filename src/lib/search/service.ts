import { LocalSearchProvider } from "./local-provider";
import { SearchProvider } from "./types";

// Factory function: currently returns LocalSearchProvider, can return MeiliSearchProvider or AlgoliaProvider later
function createSearchProvider(): SearchProvider {
  return new LocalSearchProvider();
}

export const searchService = createSearchProvider();
