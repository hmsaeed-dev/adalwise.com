import { MiniSearchProvider, invalidateSearchPoolCache } from "./minisearch-provider";
import { SearchProvider } from "./types";

function createSearchProvider(): SearchProvider {
  return new MiniSearchProvider();
}

export const searchService = createSearchProvider();
export { invalidateSearchPoolCache };
