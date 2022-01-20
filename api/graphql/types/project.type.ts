import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserType } from "./user.type";

export const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    manager: { type: UserType },
  }),
});

export const ProjectsType = new GraphQLObjectType({
  name: "Projects",
  fields: () => ({
    count: { type: GraphQLInt },
    projects: { type: new GraphQLList(ProjectType) },
  }),
});
