import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  }),
});

const UsersType = new GraphQLObjectType({
  name: "Users",
  fields: () => ({
    count: { type: GraphQLInt },
    users: { type: new GraphQLList(UserType) },
  }),
});
export { UserType, UsersType };
