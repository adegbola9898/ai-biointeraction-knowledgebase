import { apiClient } from "./client";
import type { Interaction, InteractionStatus } from "../types/interaction";

export async function getInteractions(): Promise<Interaction[]> {
  const response = await apiClient.get<Interaction[]>("/interactions");
  return response.data;
}

export async function getInteractionsByPaperId(paperId: string): Promise<Interaction[]> {
  const response = await apiClient.get<Interaction[]>(`/interactions/paper/${paperId}`);
  return response.data;
}

export async function updateInteractionStatus(
  interactionId: string,
  status: InteractionStatus
): Promise<Interaction> {
  const response = await apiClient.patch<Interaction>(
    `/interactions/${interactionId}/status`,
    { status }
  );

  return response.data;
}

export async function approveInteraction(interactionId: string): Promise<Interaction> {
  return updateInteractionStatus(interactionId, "APPROVED");
}

export async function rejectInteraction(interactionId: string): Promise<Interaction> {
  return updateInteractionStatus(interactionId, "REJECTED");
}
