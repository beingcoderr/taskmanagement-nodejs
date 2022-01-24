import { GraphQLEnumType, GraphQLObjectType, GraphQLString } from "graphql";
import { TaskStatus } from "../../common/enums";

export const NewUserType = new GraphQLObjectType({
  name: "NewUser",
  fields: {
    id: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString,
    },
  },
});

export const TaskStatusType = new GraphQLEnumType({
  name: "TaskStatusEnum",
  values: {
    OPEN: {
      value: TaskStatus.OPEN,
    },
    IN_PROGRESS: {
      value: TaskStatus.IN_PROGRESS,
    },
    DONE: {
      value: TaskStatus.DONE,
    },
  },
});
