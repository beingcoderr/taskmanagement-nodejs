import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { TaskStatusType } from "../types/common.type";

export const IdArgument: GraphQLFieldConfigArgumentMap = {
  id: {
    type: new GraphQLNonNull(GraphQLString),
  },
};
export const SignInArguments: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLNonNull(
      new GraphQLInputObjectType({
        name: "signin",
        fields: {
          phone: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
      })
    ),
  },
};

export const ResetPasswordArguments: GraphQLFieldConfigArgumentMap = {
  id: { type: new GraphQLNonNull(GraphQLString) },
  input: {
    type: new GraphQLInputObjectType({
      name: "resetPassword",
      fields: {
        currentPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
    }),
  },
};

export const CreateUserArgument: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: "creatUserInput",
      fields: {
        phone: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        managerId: { type: GraphQLString },
      },
    }),
  },
};

export const SkipTakeArgument: GraphQLFieldConfigArgumentMap = {
  options: {
    type: new GraphQLInputObjectType({
      name: "skipTakeInput",
      fields: {
        skip: { type: new GraphQLNonNull(GraphQLInt) },
        take: { type: new GraphQLNonNull(GraphQLInt) },
      },
    }),
  },
};

export const CreateProjectArgument: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: "createProjectInput",
      fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        managerId: { type: new GraphQLNonNull(GraphQLString) },
      },
    }),
  },
};

export const GetAllTasksArgument: GraphQLFieldConfigArgumentMap = {
  options: {
    type: new GraphQLNonNull(
      new GraphQLInputObjectType({
        name: "getTasksInput",
        fields: {
          skip: { type: new GraphQLNonNull(GraphQLInt) },
          take: { type: new GraphQLNonNull(GraphQLInt) },
          description: { type: GraphQLString },
          taskStatus: { type: new GraphQLList(TaskStatusType) },
          createdAtFrom: { type: GraphQLString },
          createdAtTo: { type: GraphQLString },
          completedAtFrom: { type: GraphQLString },
          completedAtTo: { type: GraphQLString },
        },
      })
    ),
  },
};

export const CreateTaskArgument: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLNonNull(
      new GraphQLInputObjectType({
        name: "createTaskInput",
        fields: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          description: { type: new GraphQLNonNull(GraphQLString) },
          projectId: { type: new GraphQLNonNull(GraphQLString) },
          userId: { type: GraphQLString },
        },
      })
    ),
  },
};

export const UpdateTaskArgument: GraphQLFieldConfigArgumentMap = {
  taskId: { type: new GraphQLNonNull(GraphQLString) },
  options: {
    type: new GraphQLNonNull(
      new GraphQLInputObjectType({
        name: "updateTaskInput",
        fields: {
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          status: { type: TaskStatusType },
          userId: { type: GraphQLString },
          completedAt: { type: GraphQLString },
        },
      })
    ),
  },
};
