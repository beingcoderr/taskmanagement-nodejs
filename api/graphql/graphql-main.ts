import { graphqlHTTP } from "express-graphql";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import depthLimit from "graphql-depth-limit";
import ExpressPlaygroundMiddleware from "graphql-playground-middleware-express";
import autMutationshResolver from "./resolvers/auth.resolver";
import {
  projectMutationResolver,
  projectQueryResolver,
} from "./resolvers/project.resolver";
import {
  taskMutationResolver,
  taskQueryResolver,
} from "./resolvers/task.resolver";
import { userQueryResolver } from "./resolvers/user.resolver";

// GraphQL config
const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...userQueryResolver,
    ...projectQueryResolver,
    ...taskQueryResolver,
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...autMutationshResolver,
    ...projectMutationResolver,
    ...taskMutationResolver,
  },
});

const schema = new GraphQLSchema({ query, mutation });
const graphqlServer = graphqlHTTP({
  schema,
  graphiql: false,
  // customFormatErrorFn: (error) => {
  //   return error.originalError ?? new InternalServerException();
  // },
  validationRules: [depthLimit(5)],
});

const playground = ExpressPlaygroundMiddleware({
  endpoint: "/graphql",
});

export { graphqlServer, playground };
