import express, { NextFunction, Request, Response } from "express";
import { TaskStatus, UserRole } from "../common/enums";
import { getCurrentUser, sendSuccess } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskFilterDto } from "../dto/get-task-filter.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { InternalServerException } from "../exceptions/exceptions";
import { rolesMiddleware } from "../middlewares/roles.middleware";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
} from "../services/task.service";

const taskRouter = express.Router();

taskRouter.get(
  "/",
  validate("get-task-filter"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query["skip"] as string);
      const take = parseInt(req.query["take"] as string);
      const query = req.query.q as string;
      const taskStatus = (req.query.status as string)
        ?.trim()
        ?.replace(/\s/g, "")
        ?.split(",") as TaskStatus[];
      let taskFilter: TaskFilterDto = {
        skip,
        take,
        query,
        taskStatus,
      };
      if (req.query.createdAtFrom) {
        const createdAtFrom = new Date(req.query.createdAtFrom as string);
        taskFilter = {
          ...taskFilter,
          createdAtFrom,
        };
      }
      if (req.query.createdAtTo) {
        const createdAtTo = new Date(req.query.createdAtTo as string);
        taskFilter = {
          ...taskFilter,
          createdAtTo,
        };
      }

      const currentUser = getCurrentUser(req);
      const tasks = await getAllTasks(taskFilter, currentUser);
      return sendSuccess(req, res, tasks);
    } catch (error) {
      next(error);
    }
  }
);

taskRouter.get(
  "/:id",
  validate("id"),
  validateResult,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const currentUser = getCurrentUser(req);
      const task = await getTaskById(id, currentUser);
      return sendSuccess(req, res, task);
    } catch (error) {
      next(error);
    }
  }
);

taskRouter.post(
  "/",
  validate("create-task"),
  validateResult,
  rolesMiddleware(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: CreateTaskDto = req.body;
      const currentUser = getCurrentUser(req);
      const newTask = await createTask(input, currentUser);
      sendSuccess(req, res, newTask);
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

taskRouter.patch(
  "/:id",
  validate("update-task"),
  validateResult,
  rolesMiddleware(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.id;
      const currentUser = getCurrentUser(req);
      const options: UpdateTaskDto = req.body;
      const isTaskUpdated = await updateTaskById(taskId, currentUser, options);
      if (isTaskUpdated) {
        return sendSuccess(req, res);
      }
      throw new InternalServerException("something went wrong");
    } catch (error) {
      next(error);
    }
  }
);

export default taskRouter;
