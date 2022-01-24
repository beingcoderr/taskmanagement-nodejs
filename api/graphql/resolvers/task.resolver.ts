import { GraphQLFieldConfig, ThunkObjMap } from "graphql";
import { UserRole } from "../../common/enums";
import { getCurrentGqlUser } from "../../common/utils";
import { CreateTaskDto } from "../../dto/create-task.dto";
import { TaskFilterDto } from "../../dto/get-task-filter.dto";
import { UpdateTaskDto } from "../../dto/update-task.dto";
import { BadRequestException } from "../../exceptions/exceptions";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
} from "../../services/task.service";
import {
  CreateTaskArgument,
  GetAllTasksArgument,
  IdArgument,
  UpdateTaskArgument,
} from "../arguments/gql-arguments";
import { checkGqlRoles } from "../middlewares/roles-gql.middleware";
import { TasksType, TaskType } from "../types/task.type";
import {
  createTaskValidator,
  getTasksValidator,
  idValidator,
  updateTaskValidator,
} from "../validators/gql-validators";

const taskQueryResolver: ThunkObjMap<GraphQLFieldConfig<unknown, unknown>> = {
  tasks: {
    type: TasksType,
    args: GetAllTasksArgument,
    resolve: async (source, args, context) => {
      try {
        await getTasksValidator.validate(args.options);
        checkGqlRoles(context, UserRole.ADMIN);
        const options: TaskFilterDto = args.options;
        const currentUser = getCurrentGqlUser(context);

        const tasks = await getAllTasks(options, currentUser);
        return tasks;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new BadRequestException(error.errors);
        }
        throw error;
      }
    },
  },

  task: {
    type: TaskType,
    args: IdArgument,
    resolve: async (source, args, context) => {
      try {
        await idValidator.validate(args.id);

        const id = args.id;
        const currentUser = getCurrentGqlUser(context);
        const task = await getTaskById(id, currentUser);
        return task;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new BadRequestException(error.errors);
        }
        throw error;
      }
    },
  },
};

const taskMutationResolver: ThunkObjMap<GraphQLFieldConfig<unknown, unknown>> =
  {
    createTask: {
      type: TaskType,
      args: CreateTaskArgument,
      resolve: async (_, args, context) => {
        try {
          await createTaskValidator.validate(args.input);
          const currentUser = getCurrentGqlUser(context);
          checkGqlRoles(
            context,
            UserRole.ADMIN,
            UserRole.MANAGER,
            UserRole.USER
          );
          const input: CreateTaskDto = args.input;
          const newTask = await createTask(input, currentUser);
          return newTask;
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },

    updateTask: {
      type: TaskType,
      args: UpdateTaskArgument,
      resolve: async (_, args, context) => {
        try {
          await updateTaskValidator.validate(args);
          const taskId: string = args.taskId;
          const options: UpdateTaskDto = args.options;
          const currentUser = getCurrentGqlUser(context);
          const updatedTask = await updateTaskById(
            taskId,
            currentUser,
            options
          );
          return updatedTask;
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },
  };

export { taskQueryResolver, taskMutationResolver };
