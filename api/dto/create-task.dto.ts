export interface CreateTaskDto {
  title: string;
  description: string;
  userId?: string;
  projectId: string;
}
