import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";

export async function jwtGqlMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers.authorization) {
      req["isAuth"] = false;
      return next();
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
      req["isAuth"] = false;
      return next();
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!process.env.JWT_SECRET) {
      throw new Error("please define JWT_SECRET");
    }
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
      req["isAuth"] = true;
      return next();
    } else {
      req["isAuth"] = false;
      return next();
    }
  } catch (error) {
    req["isAuth"] = false;
    return next();
  }
}
