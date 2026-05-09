import { apiClient } from "./client";
import type { Paper } from "../types/paper";

export async function getPapers(): Promise<Paper[]> {
  const response = await apiClient.get<Paper[]>("/papers");
  return response.data;
}
