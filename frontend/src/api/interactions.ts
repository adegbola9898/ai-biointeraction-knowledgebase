import { apiClient } from "./client";
import type { Interaction } from "../types/interaction";

export async function getInteractions(): Promise<Interaction[]> {
  const response = await apiClient.get<Interaction[]>("/interactions");
  return response.data;
}

export async function getInteractionsByPaperId(paperId: string): Promise<Interaction[]> {
  const response = await apiClient.get<Interaction[]>(`/interactions/paper/${paperId}`);
  return response.data;
}
