import { apiClient } from "./client";
import type { InteractionGraph } from "../types/graph";

export async function getInteractionGraph(): Promise<InteractionGraph> {
  const response = await apiClient.get<InteractionGraph>("/graph/interactions");
  return response.data;
}
