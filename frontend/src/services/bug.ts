import api from "./api";

import type {
  Bug,
  CreateBugRequest,
  UpdateBugRequest,
  BugStatus,
  BugPriority,
} from "../types/bug";


export async function getBugs(
  search?: string,
  status?: string,
  priority?: string
): Promise<Bug[]> {
  const response = await api.get<Bug[]>(
    "/bugs/",
    {
      params: {
        search: search || undefined,
        status:
          status === "ALL"
            ? undefined
            : status,
        priority:
          priority === "ALL"
            ? undefined
            : priority,
      },
    }
  );

  return response.data;
}


export async function getBug(
  bugId: number
): Promise<Bug> {
  const response = await api.get<Bug>(
    `/bugs/${bugId}`
  );

  return response.data;
}


export async function createBug(
  data: CreateBugRequest
): Promise<Bug> {
  const response = await api.post<Bug>(
    "/bugs/",
    data
  );

  return response.data;
}


export async function updateBug(
  bugId: number,
  data: UpdateBugRequest
): Promise<Bug> {
  const response = await api.put<Bug>(
    `/bugs/${bugId}`,
    data
  );

  return response.data;
}


export async function deleteBug(
  bugId: number
): Promise<void> {
  await api.delete(
    `/bugs/${bugId}`
  );
}


export async function updateBugStatus(
  bugId: number,
  status: BugStatus
): Promise<Bug> {
  const response = await api.patch<Bug>(
    `/bugs/${bugId}/status`,
    {
      status,
    }
  );

  return response.data;
}


export async function updateBugPriority(
  bugId: number,
  priority: BugPriority
): Promise<Bug> {
  const response = await api.patch<Bug>(
    `/bugs/${bugId}/priority`,
    {
      priority,
    }
  );

  return response.data;
}


export async function assignBug(
  bugId: number,
  assignedTo: number | null
): Promise<Bug> {
  const response = await api.patch<Bug>(
    `/bugs/${bugId}/assign`,
    {
      assigned_to: assignedTo,
    }
  );

  return response.data;
}