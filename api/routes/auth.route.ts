import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { getCurrentUser, sendSuccess } from "../common/utils";
import { validate, validateResult } from "../common/validator";
import { CreateUserDto } from "../dto/create-user.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { SignInDto } from "../dto/sign-in.dto";
import {
  ForbiddenException,
  InternalServerException,
  UnauthorizedException,
} from "../exceptions/exceptions";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { rolesMiddleware } from "../middlewares/roles.middleware";
import { createUser, resetPassword, signIn } from "../services/auth.service";

const authRouter = express.Router();

authRouter.post(
  "/create-manager",
  validate("sign-up"),
  validateResult,
  jwtMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = getCurrentUser(req);
      const input: CreateUserDto = req.body;

      // Manager cannot create operatives under other managers
      if (
        currentUser.role !== UserRole.ADMIN &&
        input.managerId !== currentUser.id
      ) {
        throw new ForbiddenException("managerId mismatch");
      }

      const newUser = await createUser(input, {
        createManager: true,
        createUser: false,
      });
      if (newUser) {
        sendSuccess(req, res, newUser);
        return;
      } else {
        throw new InternalServerException("something went wrong");
      }
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/create-user",
  validate("sign-up"),
  validateResult,
  jwtMiddleware,
  rolesMiddleware(UserRole.ADMIN, UserRole.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = getCurrentUser(req);
      const input: CreateUserDto = req.body;

      // Manager cannot create operatives under other managers
      if (
        currentUser.role !== UserRole.ADMIN &&
        input.managerId !== currentUser.id
      ) {
        throw new UnauthorizedException("manager id mismatch");
      }

      const newUser = await createUser(input, {
        createManager: false,
        createUser: true,
      });
      if (newUser) {
        sendSuccess(req, res, newUser);
        return;
      } else {
        throw new InternalServerException("something went wrong");
      }
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/sign-in-admin",
  validate("sign-in"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: SignInDto = req.body;
      const token = await signIn(input, { onlyAdmins: true });
      if (token) {
        sendSuccess(req, res, token);
        return;
      }
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/sign-in",
  validate("sign-in"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: SignInDto = req.body;
      const token = await signIn(input);
      if (token) {
        res.status(201).json(token);
        return;
      }
    } catch (error) {
      next(error);
    }
  }
);

authRouter.patch(
  "/reset-password/:id",
  validate("reset-password"),
  validateResult,
  jwtMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params["id"];
      const input: ResetPasswordDto = req.body;
      const currentUser = getCurrentUser(req);
      const passwordReset = await resetPassword(id, input, currentUser);
      if (passwordReset) {
        sendSuccess(req, res);
        return;
      }
      throw new InternalServerException();
      // const token = await signIn(input);
      // if (token) {
      //   res.status(201).json({ token });
      //   return;
      // }
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
