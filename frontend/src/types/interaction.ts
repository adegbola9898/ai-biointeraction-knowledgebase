export type InteractionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Interaction {
  id: string;
  proteinA: string;
  proteinB: string;
  interactionType: string;
  status: InteractionStatus;
}
