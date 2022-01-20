import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

export const SignInArguments: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: "signin",
      fields: {
        phone: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
    }),
  },
};

export const ResetPasswordArguments: GraphQLFieldConfigArgumentMap = {
  id: { type: new GraphQLNonNull(GraphQLString) },
  input: {
    type: new GraphQLInputObjectType({
      name: "resetPassword",
      fields: {
        currentPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
    }),
  },
};

export const CreateUserArgument: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: "creatUserInput",
      fields: {
        phone: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        managerId: { type: GraphQLString },
      },
    }),
  },
};

export const SkipTakeArgument: GraphQLFieldConfigArgumentMap = {
  options: {
    type: new GraphQLInputObjectType({
      name: "skipTakeInput",
      fields: {
        skip: { type: new GraphQLNonNull(GraphQLInt) },
        take: { type: new GraphQLNonNull(GraphQLInt) },
      },
    }),
  },
};

export const CreateProjectArgument: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: "createProjectInput",
      fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        managerId: { type: new GraphQLNonNull(GraphQLString) },
      },
    }),
  },
};
