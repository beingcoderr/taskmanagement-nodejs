import { Request } from "express";
import { InternalServerException } from "../exceptions/exceptions";
import { CurrentUserInterface } from "../interfaces/user.interface";

export function getCurrentUser(req: Request) {
  if (!req.user) {
    throw new InternalServerException("user does not exists in request");
  }
  const id = req.user["id"];
  const role = req.user["role"];
  const currentUser: CurrentUserInterface = { id, role };
  return currentUser;
}
