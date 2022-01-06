import { TaskStatus } from "../common/enums";

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  userId?: string;
  completedAt?: Date;
}
