import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Task from "../../models/task.model";
import { TaskStatusType } from "./common.type";
import { UserType } from "./user.type";

export const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: TaskStatusType },
    completedAt: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: async (source, args, context) => {
        const task = await Task.findOne({
          include: [
            {
              association: "user",
              as: "user",
              attributes: ["id", "phone", "email", "firstName", "lastName"],
              required: true,
            },
          ],
          attributes: [],
          where: {
            id: source.id,
          },
          logging: console.log,
        });
        return task?.user;
      },
    },
  },
});

export const TasksType = new GraphQLObjectType({
  name: "Tasks",
  fields: {
    count: { type: GraphQLInt },
    tasks: {
      type: new GraphQLList(TaskType),
    },
  },
});
