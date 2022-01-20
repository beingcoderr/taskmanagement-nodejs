import { Request, Response } from "express";
import {
  InternalServerException,
  UnauthorizedException,
} from "../exceptions/exceptions";
import { CurrentUser } from "../interfaces/user.interface";

/**
 * Get current user form request object.
 */
export function getCurrentUser(req: Request) {
  if (!req.user) {
    throw new InternalServerException("user does not exists in request");
  }
  const id = req.user["id"];
  const role = req.user["role"];
  const currentUser: CurrentUser = { id, role };
  return currentUser;
}

/**
 * Send success response with proper status codes.
 *
 * [GET] => 200
 *
 * [POST] => 201
 *
 * [PATCH] => 204
 *
 * [DELETE] => 204
 *
 * else 200
 *
 * Send data along with it
 */
export function sendSuccess(req: Request, res: Response, data?: unknown) {
  if (req.method === "GET") {
    res.status(200).json(data);
  } else if (req.method === "POST") {
    res.status(201).json(data);
  } else if (req.method === "PATCH" || req.method === "DELETE") {
    res.status(204).json(data);
  } else {
    res.status(200).json(data);
  }
}

/**
 * Get current user form context object.
 */
export function getCurrentGqlUser(context) {
  if (!context["user"]) {
    throw new UnauthorizedException();
  }
  const id = context["user"]["id"];
  const role = context["user"]["role"];
  const currentUser: CurrentUser = { id, role };
  return currentUser;
}
