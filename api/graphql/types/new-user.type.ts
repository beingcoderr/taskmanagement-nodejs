import { GraphQLObjectType, GraphQLString } from "graphql";

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
