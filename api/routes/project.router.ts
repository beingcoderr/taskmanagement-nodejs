import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { getCurrentUser, sendSuccess } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { CreateProjectDto } from "../dto/create-project.dto";
import { rolesMiddleware } from "../middlewares/roles.middleware";
import {
  createProject,
  getAllProjects,
  getProjectById,
} from "../services/project.service";

const projectRouter = express.Router();

// Get all projects
projectRouter.get(
  "/",
  validate("skip-take"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip: number = parseInt(req.query["skip"] as string);
      const take: number = parseInt(req.query["take"] as string);
      const currentUser = getCurrentUser(req);
      const projects = await getAllProjects({ skip, take, currentUser });
      sendSuccess(req, res, projects);
      return;
    } catch (error) {
      next(error);
    }
  }
);

// Get project by projectId
projectRouter.get(
  "/:id",
  validate("id"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const project = await getProjectById(id);
      sendSuccess(req, res, project);
      return;
    } catch (error) {
      next(error);
    }
  }
);

projectRouter.post(
  "/",
  validate("create-project"),
  validateResult,
  rolesMiddleware(UserRole.MANAGER, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: CreateProjectDto = req.body;
      const currentUser = getCurrentUser(req);
      const newProject = await createProject(input, currentUser);
      sendSuccess(req, res, newProject);
      return;
    } catch (error) {
      next(error);
    }
  }
);

export default projectRouter;
