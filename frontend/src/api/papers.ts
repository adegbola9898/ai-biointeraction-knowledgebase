import { apiClient } from "./client";
import type { Paper } from "../types/paper";

export interface CreatePaperRequest {
  title: string;
  abstractText: string;
}

export async function getPapers(): Promise<Paper[]> {
  const response = await apiClient.get<Paper[]>("/papers");
  return response.data;
}

export async function getPaperById(id: string): Promise<Paper> {
  const response = await apiClient.get<Paper>(`/papers/${id}`);
  return response.data;
}

export async function createPaper(request: CreatePaperRequest): Promise<Paper> {
  const response = await apiClient.post<Paper>("/papers", request);
  return response.data;
}
