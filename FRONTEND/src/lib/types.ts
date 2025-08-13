export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskCategory = "Work" | "Personal" | "Shopping" | "Other";

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: Date;
}
