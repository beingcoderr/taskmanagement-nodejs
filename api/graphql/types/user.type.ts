import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { getUserManagerByUserId } from "../../services/user.service";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    manager: {
      type: UserType,
      resolve: async (source) => {
        if (source?.id) {
          console.log(source.id);
          return await getUserManagerByUserId(source.id);
        }
        return null;
      },
    },
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
