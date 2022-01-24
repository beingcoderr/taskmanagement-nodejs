import * as yup from "yup";
import { TaskStatus } from "../../common/enums";

export const idValidator = yup.string().required().uuid();

export const signInValidator = yup.object().shape({
  phone: yup.number().required().integer().positive(),
  password: yup.string().required().min(8).max(18),
});

export const resetPasswordValidator = yup.object().shape({
  id: yup.string().required().uuid(),
  input: yup.object().shape({
    currentPassword: yup.string().required().min(8).max(18),
    newPassword: yup.string().required().min(8).max(18),
  }),
});

export const createUserValidator = yup.object().shape({
  phone: yup.number().required().integer().positive(),
  firstName: yup.string().required().min(8).max(18),
  lastName: yup.string().required().min(8).max(18),
  email: yup.string().required().email(),
  password: yup.string().required().min(8).max(18),
  managerId: yup.string().optional().uuid(),
});

export const skipTakeValidator = yup.object().shape({
  skip: yup.number().required().min(0),
  take: yup.number().required().min(0).max(100),
});

export const createProjectValidator = yup.object().shape({
  name: yup.string().required().min(3).max(18),
  description: yup.string().optional().min(3).max(250),
  managerId: yup.string().required().uuid(),
});

export const getTasksValidator = yup.object().shape({
  skip: yup.number().required().min(0),
  take: yup.number().required().min(0).max(100),

  query: yup.string().optional().min(3).max(18),
  taskStatus: yup
    .array(yup.mixed<TaskStatus>().oneOf(Object.values(TaskStatus)))
    .optional(),
  createdAtFrom: yup.date().optional(),
  createdAtTo: yup.date().optional(),
  completedAtFrom: yup.date().optional(),
  completedAtTo: yup.date().optional(),
});

export const createTaskValidator = yup.object().shape({
  title: yup.string().required().min(3).max(18),
  description: yup.string().optional().min(3).max(250),
  projectId: yup.string().required().uuid(),
  userId: yup.string().optional().uuid(),
});

export const updateTaskValidator = yup.object().shape({
  taskId: yup.string().required().uuid(),
  options: yup
    .object()
    .required()
    .shape({
      title: yup.string().optional().min(3).max(18),
      description: yup.string().optional().min(3).max(250),
      status: yup
        .mixed<TaskStatus>()
        .oneOf(Object.values(TaskStatus))
        .optional(),
      userId: yup.string().optional().uuid(),
      completedAt: yup.date().optional(),
    }),
});
