import { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums";
import { UnauthorizedException } from "../exceptions/exceptions";

export function rolesMiddleware(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("-> rolesMiddleware");
    try {
      if (roles.length && !roles.includes(req.user["role"])) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log("<- rolesMiddleware");
      next(error);
    }
    console.log("<- rolesMiddleware");
    next();
  };
}
