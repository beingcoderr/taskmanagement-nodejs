import express, { NextFunction, Request, Response } from "express";
import { getCurrentUser, sendSuccess } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { CreateTaskDto } from "../dto/create-task.dto";
import { createTask, getAllTasks } from "../services/task.service";

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

taskRouter.post(
  "/",
  validate("create-task"),
  validateResult,
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

export default taskRouter;
