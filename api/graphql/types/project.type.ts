import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { getMnaagerByProjectId } from "../../services/project.service";
import { UserType } from "./user.type";

export const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    manager: {
      type: UserType,
      resolve: async (source, args, context) => {
        console.log(source.id);
        return await getMnaagerByProjectId(source.id);
      },
    },
  }),
});

export const ProjectsType = new GraphQLObjectType({
  name: "Projects",
  fields: () => ({
    count: { type: GraphQLInt },
    projects: { type: new GraphQLList(ProjectType) },
  }),
});
