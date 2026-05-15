import type { Paper } from "./paper";

export type InteractionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface Interaction {
  id: string;

  proteinA: string;

  proteinB: string;

  interactionType: string;

  evidenceText: string;

  confidence: number;

  extractionModel: string;

  extractionMethod: string;

  extractionTimestamp: string;

  status: InteractionStatus;

  paper: Paper;
}
