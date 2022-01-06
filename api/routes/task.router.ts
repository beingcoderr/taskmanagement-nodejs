import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { getCurrentUser, sendSuccess } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { CreateTaskDto } from "../dto/create-task.dto";
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
  validate("skip-take"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query["skip"] as string);
      const take = parseInt(req.query["take"] as string);
      const currentUser = getCurrentUser(req);
      const tasks = await getAllTasks({ skip, take }, currentUser);
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
