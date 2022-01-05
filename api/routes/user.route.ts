import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { sendSuccess } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { rolesMiddleware } from "../middlewares/roles.middleware";
import { getAllUsers, getUserById } from "../services/user.service";
const userRouter = express.Router();

userRouter.get(
  "/",
  validate("skip-take"),
  validateResult,
  rolesMiddleware(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip: number = parseInt(req.query["skip"] as string);
      const take: number = parseInt(req.query["take"] as string);
      const users = await getAllUsers({ skip, take });
      sendSuccess(req, res, users);
      return;
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await getUserById(req.params["id"]);
    sendSuccess(req, res, user);
    return;
  } catch (error) {
    next(error);
  }
});

export default userRouter;
