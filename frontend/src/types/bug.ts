export type BugStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type BugPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";


export interface Bug {
  id: number;
  title: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  reporter_id: number;
  assigned_to: number | null;
}


export interface CreateBugRequest {
  title: string;
  description: string;
  priority: BugPriority;
}


export interface UpdateBugRequest {
  title?: string;
  description?: string;
  status?: BugStatus;
  priority?: BugPriority;
}