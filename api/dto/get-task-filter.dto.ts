import { TaskStatus } from "../common/enums";

export interface TaskFilterDto {
  skip: number;
  take: number;
  query?: string;
  taskStatus?: TaskStatus[];
  createdAtFrom?: Date;
  createdAtTo?: Date;
  completedAtFrom?: Date;
  completedAtTo?: Date;
}
