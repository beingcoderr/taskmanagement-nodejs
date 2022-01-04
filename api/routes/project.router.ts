import express, { NextFunction, Request, Response } from "express";
import { getCurrentUser } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { getAllProjects } from "../services/project.service";

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
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }
);

// TODO: Get project by projectId
// projectRouter.get("/:id", validate("id"), validateResult);
export default projectRouter;
