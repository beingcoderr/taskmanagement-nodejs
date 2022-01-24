import { GraphQLFieldConfig, ThunkObjMap } from "graphql";
import { UserRole } from "../../common/enums";
import { getCurrentGqlUser } from "../../common/utils";
import { BadRequestException } from "../../exceptions/exceptions";
import { getAllUsers, getUserById } from "../../services/user.service";
import { IdArgument, SkipTakeArgument } from "../arguments/gql-arguments";
import { checkGqlRoles } from "../middlewares/roles-gql.middleware";
import { UsersType, UserType } from "../types/user.type";
import { idValidator, skipTakeValidator } from "../validators/gql-validators";

const userQueryResolver: ThunkObjMap<GraphQLFieldConfig<unknown, unknown>> = {
  users: {
    type: UsersType,
    args: SkipTakeArgument,
    resolve: async (source, args, context) => {
      try {
        await skipTakeValidator.validate(args.options);
        getCurrentGqlUser(context);
        checkGqlRoles(context, UserRole.ADMIN);
        return getAllUsers({ skip: args.skip, take: args.take });
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new BadRequestException(error.errors);
        }
        throw error;
      }
    },
  },

  user: {
    type: UserType,
    args: IdArgument,
    resolve: async (_, args, context) => {
      try {
        await idValidator.validate(args);
        getCurrentGqlUser(context);
        const user = await getUserById(args.id);
        return user;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new BadRequestException(error.errors);
        }
        throw error;
      }
    },
  },
};

export { userQueryResolver };
