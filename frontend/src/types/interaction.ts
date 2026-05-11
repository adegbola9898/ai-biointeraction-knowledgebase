import type { Paper } from "./paper";

export type InteractionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Interaction {
  id: string;
  proteinA: string;
  proteinB: string;
  interactionType: string;
  evidenceText: string;
  status: InteractionStatus;
  paper: Paper;
}
