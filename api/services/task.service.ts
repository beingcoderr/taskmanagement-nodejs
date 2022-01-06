import { Includeable, WhereOptions } from "sequelize";
import { TaskStatus, UserRole } from "../common/enums";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import {
  BadRequestException,
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

/**
 * Get task by ID.
 *
 * Admins can get all tasks.
 * Managers can get all tasks based on projects they own.
 * Users can get tasks they have been assigned.
 */
export async function getTaskById(taskId: string, currentuser: CurrentUser) {
  const { id, role } = currentuser;
  let where: WhereOptions = {
    id: taskId,
  };
  const include: Includeable[] = [];

  if (role === UserRole.USER) {
    where = {
      ...where,
      userId: id,
    };
  }

  if (role === UserRole.MANAGER) {
    include.push({
      association: "project",
      as: "project",
      include: [
        {
          association: "manager",
          as: "manager",
          required: true,
          where: {
            managerId: id,
          },
          attributes: [],
        },
      ],
      attributes: [],
    });
  }

  const task = await Task.findOne({
    where,
    include,
  });
  if (!task) {
    throw new NotFoundException(`task with id ${taskId} was not found`);
  }
  return task;
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

  // Check if managers owns the project that the task is been created on
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

  const status = userId ? TaskStatus.IN_PROGRESS : TaskStatus.OPEN;

  const newTask = await Task.create({
    title,
    description,
    projectId,
    userId,
    status,
  });

  return newTask;
}

export async function updateTaskById(
  taskId: string,
  currentUser: CurrentUser,
  options: UpdateTaskDto
) {
  const { title, description, status, userId, completedAt } = options;
  if (!title && !description && !userId && !completedAt) {
    throw new BadRequestException("specify update params in body");
  }
  const task = await getTaskById(taskId, currentUser);
  if (!task) {
    throw new NotFoundException(`task with id ${taskId} was not found`);
  }
  if (title) {
    task.setDataValue("title", title);
  }
  if (description) {
    task.setDataValue("description", description);
  }
  if (status) {
    switch (status) {
      case TaskStatus.OPEN: {
        if (userId) {
          throw BadRequestException("userId should be null if status is Open");
        }
        task.setDataValue("status", TaskStatus.OPEN);
        task.setDataValue("completedAt", null);
        break;
      }
      case TaskStatus.IN_PROGRESS: {
        if (!userId) {
          throw BadRequestException(
            "userId should not be null if status is In_Progress"
          );
        }
        task.setDataValue("status", TaskStatus.IN_PROGRESS);
        task.setDataValue("completedAt", null);
        break;
      }
      case TaskStatus.DONE: {
        if (!completedAt) {
          throw new BadRequestException(
            "completedAt is required status is Done"
          );
        }
        task.setDataValue("status", TaskStatus.DONE);
        task.setDataValue("completedAt", completedAt);
        break;
      }
      default:
        break;
    }
  }
  const newTask = await task.save();
  return newTask;
}
