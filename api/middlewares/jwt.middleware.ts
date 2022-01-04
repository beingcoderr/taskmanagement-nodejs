import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/exceptions";
import User from "../models/user.model";

export async function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findOne({
      where: {
        id: decoded["id"],
      },
      attributes: ["id", "role"],
    });
    if (user) {
      const role = user.getDataValue("role");
      decoded["role"] = role;
      req.user = decoded;
    } else {
      throw new UnauthorizedException();
    }
  } catch (error) {
    next(error);
  }
  next();
}
