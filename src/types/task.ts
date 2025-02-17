
export type Priority = "Low" | "Medium" | "High";
export type Status = "Done" | "In progress" | "To do" | "Pending Review";

export interface Task {
  id: string;
  dateRequested: Date;
  taskCreator: string;
  client: string;
  description: string;
  pageLink: string;
  loginDetails: string;
  priority: Priority;
  deadline: Date;
  status: Status;
  notes: string;
  clientDiscussion: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFormData = Omit<Task, "id" | "createdAt" | "updatedAt">;
