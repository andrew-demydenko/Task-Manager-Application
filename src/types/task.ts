import type { IProject } from "./project";

export interface ITask {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  project: IProject;
  dueDate: string;
}
