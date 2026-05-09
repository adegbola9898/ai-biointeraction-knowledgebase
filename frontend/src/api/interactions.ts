import { apiClient } from "./client";
import type { Interaction, InteractionStatus } from "../types/interaction";

export async function getInteractions(): Promise<Interaction[]> {
  const response = await apiClient.get<Interaction[]>("/interactions");
  return response.data;
}

export async function updateInteractionStatus(
  id: string,
  status: InteractionStatus
): Promise<Interaction> {
  const response = await apiClient.patch<Interaction>(`/interactions/${id}/status`, {
    status,
  });

  return response.data;
}
