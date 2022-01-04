import { NextFunction, Request, Response } from "express";
import {
  body,
  param,
  ValidationChain,
  validationResult,
} from "express-validator";

export enum Methods {
  createUser = "createUser",
}

type methods = "sign-up" | "sign-in" | "reset-password";

export function validate(method: methods): ValidationChain[] {
  var validationChain: ValidationChain[];

  switch (method) {
    case "sign-up":
      validationChain = signUpUserChain();
      break;
    case "sign-in":
      validationChain = signInUserChain();
      break;
    case "reset-password":
      validationChain = resetPasswordChain();
      break;
    default:
      validationChain = [];
      break;
  }

  return validationChain;
}

export function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array({ onlyFirstError: true }));
    return;
  }
  next();
}

function signUpUserChain() {
  return [
    body("phone", "phone is required").exists(),
    body("phone", "phone should be numeric").isNumeric(),
    body("email", "email is required").exists(),
    body("email", "email must be e-mail").isEmail(),
    body("firstName", "firstName is required").exists(),
    body("firstName", "firstName length should be min 3 and max 18").isLength({
      min: 3,
      max: 18,
    }),
    body("lastName", "lastName is required").exists(),
    body("lastName", "lastName length should be min 3 and max 18").isLength({
      min: 3,
      max: 18,
    }),
    body("password", "password is required").exists(),
    body("password", "password should be min 8 and max 18 characters").isLength(
      {
        min: 8,
        max: 18,
      }
    ),
    body("managerId", "managerId should be a valid UUID").exists().isUUID(),
  ];
}

function signInUserChain() {
  return [
    body("phone", "phone is required").exists(),
    body("phone", "phone is required").isNumeric(),

    body("password", "password is required").exists(),
    body("password", "password should be min 8 and max 18 characters").isLength(
      {
        min: 8,
        max: 18,
      }
    ),
  ];
}

function resetPasswordChain() {
  return [
    param("id", "invalid UUID").exists().isUUID(),
    body("currentPassword", "oldPassword should be min 8 and max 18 characters")
      .exists()
      .isLength({
        min: 8,
        max: 18,
      }),
    body("newPassword", "newPassword should be min 8 and max 18 characters")
      .exists()
      .isLength({
        min: 8,
        max: 18,
      }),
  ];
}