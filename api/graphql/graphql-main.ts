import { graphqlHTTP } from "express-graphql";
import { GraphQLInt, GraphQLObjectType, GraphQLSchema } from "graphql";
import ExpressPlaygroundMiddleware from "graphql-playground-middleware-express";
import {
  InternalServerException,
  UnauthorizedException,
} from "../exceptions/exceptions";
import { getAllUsers } from "../services/user.service";
import autMutationshResolver from "./resolvers/auth.resolver";
import {
  projectMutationResolver,
  projectQueryResolver,
} from "./resolvers/project.resolver";
import { UsersType } from "./types/user.type";

// GraphQL config
const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    getAllUsers: {
      type: UsersType,
      args: { skip: { type: GraphQLInt }, take: { type: GraphQLInt } },
      resolve: (parent, args, context) => {
        if (context["isAuth"]) {
          return getAllUsers({ skip: args.skip, take: args.take });
        } else {
          throw new UnauthorizedException();
        }
      },
    },
    ...projectQueryResolver,
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...autMutationshResolver,
    ...projectMutationResolver,
  },
});

const schema = new GraphQLSchema({ query, mutation });
const graphqlServer = graphqlHTTP({
  schema,
  graphiql: false,
  customFormatErrorFn: (error) => {
    return error.originalError ?? new InternalServerException();
  },
});

const playground = ExpressPlaygroundMiddleware({
  endpoint: "/graphql",
});

export { graphqlServer, playground };
