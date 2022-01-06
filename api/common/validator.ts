import { NextFunction, Request, Response } from "express";
import {
  body,
  param,
  query,
  ValidationChain,
  validationResult,
} from "express-validator";
import { TaskStatus } from "./enums";

export enum Methods {
  createUser = "createUser",
}

type methods =
  | "sign-up"
  | "sign-in"
  | "reset-password"
  | "skip-take"
  | "id"
  | "create-project"
  | "create-task"
  | "update-task";

export function validate(method: methods): ValidationChain[] {
  let validationChain: ValidationChain[];

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
    case "skip-take":
      validationChain = skipTakeChain();
      break;
    case "id":
      validationChain = [
        param("id", "valid UUID is required").exists().isUUID(),
      ];
      break;
    case "create-project":
      validationChain = createProjectChain();
      break;
    case "create-task":
      validationChain = createTaskChain();
      break;
    case "update-task":
      validationChain = updateTaskChain();
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

function skipTakeChain() {
  return [
    query("skip", "skip is required, non negative number").exists().isInt({
      gt: -1,
    }),
    query("take", "take is required, should not be greater than 25")
      .exists()
      .isInt()
      .isInt({
        gt: 0,
        lt: 26,
      }),
  ];
}

function createProjectChain() {
  return [
    body("name", "name is required").exists(),
    body("name", "name should be min 8 and max 18 characters").isLength({
      min: 8,
      max: 18,
    }),

    body("description", "description should be min 8 and max 250 characters")
      .optional()
      .isLength({
        min: 8,
        max: 250,
      }),

    body("managerId", "managerId is required").exists(),
    body("managerId", "managerId should be a UUID").isUUID(),
  ];
}

function createTaskChain() {
  return [
    body("title", "title is required").exists(),
    body("title", "title should be min 8 and max 18 characters").isLength({
      min: 8,
      max: 18,
    }),

    body("description", "description is required").exists(),
    body(
      "description",
      "description should be min 8 and max 500 characters"
    ).isLength({
      min: 8,
      max: 500,
    }),

    body("projectId", "projectId is required").exists(),
    body("projectId", "projectId should be a UUID").isUUID(),

    body("userId", "userId should be a UUID").optional().isUUID(),
  ];
}

function updateTaskChain() {
  return [
    param("id", "task id should be a valid UUID").exists().isUUID(),
    body("title", "title should be min 8 and max 18 characters")
      .optional()
      .isLength({
        min: 8,
        max: 18,
      }),
    body("description", "description should be min 8 and max 500 characters")
      .optional()
      .isLength({
        min: 8,
        max: 500,
      }),
    body(
      "status",
      `status values should be one of the following ${Object.values(
        TaskStatus
      )}`
    )
      .optional()
      .isIn(Object.values(TaskStatus)),
    body("userId", "userId should be a valid UUID").optional().isUUID(),
    body("completedAt", "completedAt should be a valid date format")
      .optional()
      .isDate(),
  ];
}
