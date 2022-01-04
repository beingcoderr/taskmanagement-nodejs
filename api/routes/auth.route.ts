import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { validate, validateResult } from "../common/validator";
import { CreateUserDto } from "../dto/create-user.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { SignInDto } from "../dto/sign-in.dto";
import {
  InternalServerException,
  UnauthorizedException,
} from "../exceptions/exceptions";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { rolesMiddleware } from "../middlewares/roles.middleware";
import { createUser, resetPassword, signIn } from "../services/auth.service";

const authRouter = express.Router();

authRouter.post(
  "/sign-up",
  validate("sign-up"),
  validateResult,
  jwtMiddleware,
  rolesMiddleware(UserRole.ADMIN, UserRole.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: CreateUserDto = req.body;

      // Manager cannot create operatives under other managers
      if (
        req.user["role"] !== UserRole.ADMIN &&
        input.managerId !== req.user["id"]
      ) {
        throw new UnauthorizedException("manager id mismatch");
      }

      const token = await createUser(input);
      if (token) {
        res.status(201).json({ token });
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
        res.status(201).json({ token });
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
        res.status(201).json({ token });
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
      const passwordReset = await resetPassword(id, input, req.user);
      if (passwordReset) {
        res.status(200).json({
          status: 200,
          message: "password reset successful",
        });
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
