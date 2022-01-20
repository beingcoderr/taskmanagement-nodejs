import { GraphQLObjectType, GraphQLString } from "graphql";

const AuthTokenType = new GraphQLObjectType({
  name: "Token",
  fields: {
    token: { type: GraphQLString },
  },
});

export default AuthTokenType;
