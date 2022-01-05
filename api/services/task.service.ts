import { Includeable, WhereOptions } from "sequelize";
import { UserRole } from "../common/enums";
import { CreateTaskDto } from "../dto/create-task.dto";
import {
  ForbiddenException,
  NotFoundException,
} from "../exceptions/exceptions";
import { CurrentUser } from "../interfaces/user.interface";
import Project from "../models/project.model";
import Task from "../models/task.model";

/**
 * Get all tasks.
 *
 * Admins can get all tasks.
 * Managers can get all tasks based on projects they own.
 * Users can get tasks they have been assigned.
 */
export async function getAllTasks(
  options: { skip: number; take: number },
  currentUser: CurrentUser
) {
  const { id, role } = currentUser;
  const { skip, take } = options;
  let where: WhereOptions = {};
  const include: Includeable[] = [];
  if (role === UserRole.USER) {
    where = {
      ...where,
      userId: id,
    };
  } else if (role == UserRole.MANAGER) {
    include.push({
      association: "project",
      as: "project",
      attributes: [],
      include: [
        {
          association: "manager",
          as: "manager",
          attributes: [],
          where: {
            id: id,
          },
        },
      ],
    });
  }
  const tasks = await Task.findAndCountAll({
    where,
    include,
    offset: skip,
    limit: take,
  });
  return {
    count: tasks.count,
    tasks: tasks.rows,
  };
}

export async function createTask(
  input: CreateTaskDto,
  currentUser: CurrentUser
) {
  const { title, description, projectId, userId } = input;
  const { id, role } = currentUser;
  if (role === UserRole.USER && id !== userId) {
    throw new ForbiddenException("user cannot create task for another user");
  }
  const includeProject: Includeable[] = [];
  let whereProject: WhereOptions = { id: projectId };
  if (role === UserRole.MANAGER) {
    whereProject = {
      ...whereProject,
      managerId: id,
    };
  } else if (role === UserRole.USER) {
    // Users cannot create task if they don't have existing task in that project
    includeProject.push({
      association: "tasks",
      as: "tasks",
      where: {
        userId: userId,
      },
      required: true,
    });
  }
  const project = await Project.findOne({
    where: whereProject,
    include: includeProject,
  });
  if (!project) {
    throw new NotFoundException(`project with id ${projectId} was not found`);
  }

  const newTask = await Task.create({
    title,
    description,
    projectId,
    userId,
  });

  return newTask;
}
