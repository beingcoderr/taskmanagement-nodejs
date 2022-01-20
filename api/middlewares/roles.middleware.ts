import { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { ForbiddenException } from "../exceptions/exceptions";

export function rolesMiddleware(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (roles.length && req.user && !roles.includes(req.user["role"])) {
        throw new ForbiddenException();
      }
    } catch (error) {
      next(error);
    }
    next();
  };
}
