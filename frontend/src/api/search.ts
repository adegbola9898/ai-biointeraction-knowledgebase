import { apiClient } from "./client";
import type { SearchResponse } from "../types/search";

export async function searchKnowledgebase(query: string): Promise<SearchResponse> {
  const response = await apiClient.get<SearchResponse>("/search", {
    params: { q: query },
  });

  return response.data;
}
